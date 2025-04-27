"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { signInSchema } from "@/lib/Zod/signInFormSchema";

const SignInForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    if (!isLoaded) return;

    try {
      setSigningIn(true);
      const result = await signIn.create(data);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/dashboard");
      } else {
        console.error(result);
      }
    } catch (err) {
      err.errors.forEach((error) => {
        setError(error.meta.paramName, {
          type: "manual",
          message: error.message.replace("identifier", "Email/Username"),
        });
      });
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="block text-sm font-medium text-primary">
            Email/Username
          </label>
          <input {...register("identifier")} type="text" placeholder="name@example.com" />
          {errors.identifier && <p className="ml-1 text-sm text-red-500">{errors.identifier.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input {...register("password")} type="password" placeholder="••••••••" />
          {errors.password && <p className="ml-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button variant="outline" type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={signingIn}>
          {signingIn ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-primary">
        Don't have an account? &nbsp;
        <Link href="/sign-up" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default SignInForm;
