/**
 * Email API Route Handler
 * Handles sending emails using SendGrid service
 * POST /api/email
 */

import { NextRequest, NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { logger } from "@/lib/logger";

// Initialize SendGrid with API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

/**
 * POST /api/email
 * Sends an email through SendGrid
 *
 * @param request - Request object containing email data
 * @returns JSON response with success status and message ID
 *
 * @example
 * curl -X POST http://localhost:3000/api/email \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "to": "user@example.com",
 *     "subject": "Welcome!",
 *     "html": "<h3>Hello from OneRoute!</h3>"
 *   }'
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key exists
    if (!process.env.SENDGRID_API_KEY) {
      logger.error("SendGrid API key not configured");
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body: EmailPayload = await request.json();

    // Validate required fields
    if (!body.to || !body.subject || !body.html) {
      logger.warn("Missing required email fields", {
        to: !!body.to,
        subject: !!body.subject,
        html: !!body.html,
      });
      return NextResponse.json(
        { success: false, error: "Missing required fields: to, subject, html" },
        { status: 400 }
      );
    }

    // Validate email address format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const toAddresses = Array.isArray(body.to) ? body.to : [body.to];
    const invalidEmails = toAddresses.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      logger.warn("Invalid email addresses", { emails: invalidEmails });
      return NextResponse.json(
        { success: false, error: "Invalid email address format" },
        { status: 400 }
      );
    }

    // Prepare email data
    const emailData = {
      to: body.to,
      from: body.from || process.env.SENDGRID_SENDER || "no-reply@oneroute.com",
      subject: body.subject,
      html: body.html,
      replyTo: body.replyTo,
      cc: body.cc,
      bcc: body.bcc,
    };

    // Send email through SendGrid
    const response = await sendgrid.send(emailData);

    logger.info("Email sent successfully", {
      to: body.to,
      subject: body.subject,
      messageId: response[0].headers?.["x-message-id"],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        messageId: response[0].headers?.["x-message-id"],
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorCode = error instanceof Error && "code" in error ? (error as any).code : "INTERNAL_ERROR";

    logger.error("Failed to send email", {
      error: errorMessage,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email
 * Health check endpoint for email service
 */
export async function GET() {
  const isConfigured = !!process.env.SENDGRID_API_KEY && !!process.env.SENDGRID_SENDER;

  return NextResponse.json(
    {
      status: isConfigured ? "configured" : "not-configured",
      service: "SendGrid",
      sender: process.env.SENDGRID_SENDER || "not-configured",
    },
    { status: isConfigured ? 200 : 503 }
  );
}
