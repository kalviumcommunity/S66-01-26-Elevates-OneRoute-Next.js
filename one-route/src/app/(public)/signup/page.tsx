"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  SignupFormData } from "@/schemas/signup.schema";
import { signupSchema } from "@/lib/schemas/authSchema";
import { useToast } from "@/app/hooks/useToast";
import FormInput from "@/app/components/form/FormInput";

export default function SignupPage() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    toast.loading("Creating account...");

    try {
      await new Promise((res) => setTimeout(res, 800));
      toast.dismiss();
      toast.success("Account created successfully!");
    } catch {
      toast.dismiss();
      toast.error("Signup failed");
    }
  };

  return (
    <main className="flex justify-center py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 bg-white p-6 border rounded-lg shadow"
      >
        <h1 className="text-xl font-bold text-center">Create Account</h1>

        <FormInput
          label="Name"
          name="name"
          register={register}
          error={errors.name?.message}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
        />

        <button
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
}
