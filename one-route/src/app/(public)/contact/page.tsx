"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactFormData } from "@/schemas/contact.schema";
import { useToast } from "@/app/hooks/useToast";
import FormInput from "@/app/components/form/FormInput";
import FormTextarea from "@/app/components/form/FormTextarea";


export default function ContactPage() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    toast.loading("Sending message...");

    try {
      await new Promise((res) => setTimeout(res, 800)); // mock API
      toast.dismiss();
      toast.success("Message sent successfully!");
    } catch {
      toast.dismiss();
      toast.error("Failed to send message");
    }
  };

  return (
    <main className="flex justify-center py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-4 bg-white p-6 border rounded-lg shadow"
      >
        <h1 className="text-xl font-bold text-center">Contact Us</h1>

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

        <FormTextarea
          label="Message"
          name="message"
          register={register}
          error={errors.message?.message}
          rows={5}
        />

        <button
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </main>
  );
}
