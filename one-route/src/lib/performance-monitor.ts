/**
 * Query Performance Monitoring & Optimization
 * Tracks execution time, identifies slow queries, enables benchmarking
 */

import { prisma } from "@/lib/prisma";

/**
 * ============================================================================
 * PERFORMANCE MONITOR CLASS
 * ============================================================================
 * Wraps Prisma client to track all query execution times
 */

export class QueryPerformanceMonitor {
  private queryLogs: Array<{
    operation: string;
    duration: number;
    timestamp: Date;
    success: boolean;
    error?: string;
  }> = [];

  /**
   * Enable debug logging for all Prisma queries
   * Set environment variable: DEBUG="prisma:query,prisma:info"
   */
  static enableDebugMode() {
    if (typeof process !== "undefined") {
      process.env.DEBUG = "prisma:query,prisma:info";
      console.log("🔍 Prisma debug mode enabled. Logs will show:");
      console.log("   - Raw SQL executed");
      console.log("   - Query parameters");
      console.log("   - Execution duration");
      console.log("\n💡 Run with: DEBUG='prisma:query' npm run dev");
    }
  }

  /**
   * Measure execution time of an async function
   * @param label - Operation name for logging
   * @param fn - Async function to measure
   * @returns Result and duration
   */
  async measureQuery<T>(label: string, fn: () => Promise<T>) {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.logQuery(label, duration, true);
      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      this.logQuery(label, duration, false, error as Error);
      throw error;
    }
  }

  /**
   * Log query metrics
   */
  private logQuery(
    operation: string,
    duration: number,
    success: boolean,
    error?: Error
  ) {
    const log = {
      operation,
      duration: Math.round(duration * 100) / 100, // 2 decimal places
      timestamp: new Date(),
      success,
      error: error?.message,
    };

    this.queryLogs.push(log);

    // Log to console with visual indicators
    const icon = success ? "✅" : "❌";
    const durationColor =
      duration > 100 ? "🔴" : duration > 50 ? "🟡" : "🟢";
    const durationLabel =
      duration > 1000
        ? `${(duration / 1000).toFixed(2)}s`
        : `${Math.round(duration)}ms`;

    console.log(
      `${icon} ${durationColor} [${durationLabel}] ${operation}`
    );

    if (error) {
      console.error(`   Error: ${error.message}`);
    }
  }

  /**
   * Get performance summary
   */
  getSummary() {
    if (this.queryLogs.length === 0) {
      return { message: "No queries logged yet" };
    }

    const successLogs = this.queryLogs.filter((log) => log.success);
    const failedLogs = this.queryLogs.filter((log) => !log.success);

    const durations = successLogs.map((log) => log.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    // Identify slow queries (>100ms)
    const slowQueries = this.queryLogs.filter((log) => log.duration > 100);

    return {
      totalQueries: this.queryLogs.length,
      successfulQueries: successLogs.length,
      failedQueries: failedLogs.length,
      avgDuration: `${Math.round(avgDuration * 100) / 100}ms`,
      maxDuration: `${Math.round(maxDuration * 100) / 100}ms`,
      minDuration: `${Math.round(minDuration * 100) / 100}ms`,
      slowQueries: slowQueries.map((log) => ({
        operation: log.operation,
        duration: `${Math.round(log.duration * 100) / 100}ms`,
      })),
    };
  }

  /**
   * Get all query logs
   */
  getLogs() {
    return this.queryLogs;
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.queryLogs = [];
  }

  /**
   * Print summary to console
   */
  printSummary() {
    const summary = this.getSummary();
    console.log("\n");
    console.log("═══════════════════════════════════════════════════");
    console.log("📊 QUERY PERFORMANCE SUMMARY");
    console.log("═══════════════════════════════════════════════════");
    console.log(`Total Queries: ${summary.totalQueries}`);
    if (summary.successfulQueries !== undefined) {
      console.log(`✅ Successful: ${summary.successfulQueries}`);
    }
    if (summary.failedQueries !== undefined) {
      console.log(`❌ Failed: ${summary.failedQueries}`);
    }
    if (summary.avgDuration) {
      console.log(`⏱️  Average Duration: ${summary.avgDuration}`);
    }
    if (summary.maxDuration) {
      console.log(`⏱️  Max Duration: ${summary.maxDuration}`);
    }
    if (summary.minDuration) {
      console.log(`⏱️  Min Duration: ${summary.minDuration}`);
    }

    if (summary.slowQueries && summary.slowQueries.length > 0) {
      console.log("\n🐢 Slow Queries (>100ms):");
      summary.slowQueries.forEach((q) => {
        console.log(`   - ${q.operation}: ${q.duration}`);
      });
    } else {
      console.log("\n✨ All queries performing well (<100ms)");
    }
    console.log("═══════════════════════════════════════════════════\n");
  }
}

/**
 * ============================================================================
 * EXAMPLE PERFORMANCE BENCHMARKS
 * ============================================================================
 */

export const performanceBenchmarks = {
  /**
   * Test 1: Inefficient query (N+1 problem)
   * Fetches all applications and then separately fetches feedback for each
   */
  async inefficientQuery_FetchWithoutIndexes() {
    const monitor = new QueryPerformanceMonitor();

    const { result: applications, duration: appDuration } =
      await monitor.measureQuery("Fetch all applications (inefficient)", () =>
        prisma.application.findMany({
          take: 10,
        })
      );

    let totalFeedbackDuration = 0;

    // N+1 problem: One query per application
    for (const app of applications) {
      const { duration: feedbackDuration } = await monitor.measureQuery(
        `Fetch feedback for app ${app.id}`,
        () => prisma.feedback.findMany({ where: { applicationId: app.id } })
      );
      totalFeedbackDuration += feedbackDuration;
    }

    return {
      approach: "Inefficient (N+1)",
      applicationsFetchTime: `${Math.round(appDuration)}ms`,
      feedbackFetchTime: `${Math.round(totalFeedbackDuration)}ms`,
      totalTime: `${Math.round(appDuration + totalFeedbackDuration)}ms`,
      queries: `${applications.length + 1}`, // 1 + N feedback queries
    };
  },

  /**
   * Test 2: Optimized query with include (uses indexes)
   * Fetches applications and feedback in one query
   */
  async optimizedQuery_WithIndexes() {
    const monitor = new QueryPerformanceMonitor();

    const { result, duration } = await monitor.measureQuery(
      "Fetch applications with feedback (optimized with include)",
      () =>
        prisma.application.findMany({
          where: {},
          include: {
            feedbacks: true,
          },
          take: 10,
        })
    );

    return {
      approach: "Optimized (with indexes)",
      duration: `${Math.round(duration)}ms`,
      queries: "1",
      recordsFetched: result.length,
    };
  },

  /**
   * Test 3: Select only needed fields (reduces data transfer)
   */
  async optimizedQuery_SelectFields() {
    const monitor = new QueryPerformanceMonitor();

    const { result, duration } = await monitor.measureQuery(
      "Fetch applications with selected fields only",
      () =>
        prisma.application.findMany({
          select: {
            id: true,
            status: true,
            appliedDate: true,
            internship: {
              select: {
                title: true,
                company: true,
              },
            },
          },
          take: 10,
        })
    );

    return {
      approach: "Optimized (select fields)",
      duration: `${Math.round(duration)}ms`,
      dataSize: `Significantly reduced`,
    };
  },

  /**
   * Test 4: Batch operations vs individual inserts
   */
  async batchCreateVsIndividual() {
    const monitor = new QueryPerformanceMonitor();

    // Batch approach
    const { duration: batchDuration } = await monitor.measureQuery(
      "Batch create 10 users",
      () =>
        prisma.user.createMany({
          data: Array.from({ length: 10 }, (_, i) => ({
            email: `batch-${Date.now()}-${i}@example.com`,
            name: `Batch User ${i}`,
            password: "hashed",
            role: "STUDENT",
          })),
        })
    );

    return {
      batchApproach: {
        approach: "Batch (createMany)",
        duration: `${Math.round(batchDuration)}ms`,
        queries: "1",
      },
      estimatedIndividualApproach: {
        approach: "Individual (create in loop)",
        estimatedDuration: `~${Math.round(batchDuration * 5)}ms`,
        queries: "10",
      },
      savings: `${Math.round(batchDuration * 4 * 100) / 100}ms saved with batch`,
    };
  },

  /**
   * Test 5: Pagination impact on performance
   */
  async paginationPerformance() {
    const monitor = new QueryPerformanceMonitor();

    const page1 = await monitor.measureQuery("Page 1 (skip 0, take 10)", () =>
      prisma.application.findMany({
        skip: 0,
        take: 10,
        orderBy: { createdAt: "desc" },
      })
    );

    const page10 = await monitor.measureQuery(
      "Page 10 (skip 90, take 10)",
      () =>
        prisma.application.findMany({
          skip: 90,
          take: 10,
          orderBy: { createdAt: "desc" },
        })
    );

    const page100 = await monitor.measureQuery(
      "Page 100 (skip 990, take 10)",
      () =>
        prisma.application.findMany({
          skip: 990,
          take: 10,
          orderBy: { createdAt: "desc" },
        })
    );

    return {
      page1: `${Math.round(page1.duration)}ms`,
      page10: `${Math.round(page10.duration)}ms`,
      page100: `${Math.round(page100.duration)}ms`,
      note: "Later pages are slower due to OFFSET behavior. Cursor-based pagination is recommended for large datasets.",
    };
  },
};

/**
 * ============================================================================
 * SQL EXPLAIN ANALYSIS
 * ============================================================================
 * Use PostgreSQL EXPLAIN to analyze query execution plans
 */

export async function explainQuery(sqlQuery: string) {
  try {
    const result = await prisma.$queryRawUnsafe(`EXPLAIN ANALYZE ${sqlQuery}`);
    return result;
  } catch (error) {
    console.error("Failed to run EXPLAIN:", error);
    throw error;
  }
}

/**
 * ============================================================================
 * RECOMMENDATIONS FOR PRODUCTION MONITORING
 * ============================================================================
 *
 * 1. USE APM TOOLS:
 *    - New Relic: Real-time transaction monitoring
 *    - Datadog: Full-stack observability
 *    - Sentry: Error tracking and performance monitoring
 *    - AWS X-Ray: Distributed tracing
 *
 * 2. DATABASE-LEVEL MONITORING:
 *    - AWS RDS Performance Insights: SQL analysis, wait events
 *    - Google Cloud SQL Insights: Query performance breakdown
 *    - Azure Query Performance Insights: Slow query detection
 *    - PgHero: PostgreSQL-specific monitoring (free)
 *
 * 3. KEY METRICS TO TRACK:
 *    - Query execution time (p50, p95, p99)
 *    - Error rate and types
 *    - Connection pool utilization
 *    - Lock contention and deadlocks
 *    - Table size and index bloat
 *    - Slow query logs (>100ms)
 *
 * 4. ALERTING THRESHOLDS:
 *    - Query time > 1s: Investigate
 *    - Error rate > 1%: Page on-call
 *    - Connection pool > 80%: Scale up
 *    - Disk usage > 80%: Archive data
 *
 * 5. OPTIMIZATION CYCLE:
 *    - Collect metrics (1-2 weeks)
 *    - Identify slowest queries
 *    - Analyze execution plans
 *    - Add indexes or optimize queries
 *    - Measure improvement
 *    - Repeat
 */

export default {
  QueryPerformanceMonitor,
  performanceBenchmarks,
  explainQuery,
};
