"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth-errors";

export async function login(formData: FormData) {
  try {
    await auth.api.signInEmail({
      body: {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      headers: await headers(),
    });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }

  redirect("/dashboard");
}

export async function register(formData: FormData) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: (formData.get("fullName") as string).trim(),
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      headers: await headers(),
    });
  } catch (error) {
    return { error: authErrorMessage(error) };
  }

  redirect("/dashboard");
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
