// Server Actions in Next.js are special functions that run only on the server, not in the user's browser.

// They let you perform things like database queries, API calls,  form submissions, or data mutations directly from your React components without creating a separate API route.

// You just mark a function with "use server" and Next.js auto-matically runs it on the server.

// When you submit a <form> in next.js using action={yourServerAction}, the framework sends a FormData object to that server function.

// FormData is a built-in web API type ( just like Request, Response, or URLSearchParams ).

// It provides methods like .get(), set(), append(), and .entries() which you are already using here.
"use server";

import db from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import {
  LoginUserData,
  loginUserSchema,
  RegisterUserData,
  registerUserSchema,
} from "../auth.schema";
import {
  createSessionAndSetCookies,
  invalidateSession,
} from "./use-cases/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RegistrationAction = async (data: RegisterUserData) => {
  try {
    const { data: ValidateData, error } = registerUserSchema.safeParse(data);
    if (error) {
      console.error("Validation Error:", error);
      return { success: false, message: error.issues[0].message };
    }
    const { name, username, email, password, role } = ValidateData;

    // Check if the username or email already exists in the database
    const userExists = await db
      .select()
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, email)))
      .limit(1);

    if (userExists.length > 0) {
      if (userExists[0].username === username) {
        return { success: false, message: "Username already exists" };
      } else {
        return { success: false, message: "Email already exists" };
      }
    }

    // Hash the password before storing it in the database
    const hashPassword = await argon2.hash(password);

    await db.transaction(async (tx) => {
    // Insert the new user into the database
    const [result] = await tx
      .insert(users)
      .values({ name, username, email, password: hashPassword, role });

    console.log(result);

    // insert into applicants or employers table based on the role of the user
    if (role === "applicant") {
      // Create a profile for the applicant
      await tx.insert(applicants).values({ id: result.insertId });
    } else {
      await tx.insert(employers).values({ id: result.insertId });
    }

    // Create a session for the user and set cookies
    await createSessionAndSetCookies(result.insertId, tx);

    });

    return { success: true, message: "Registration completed successfully" };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, message: "Registration failed" };
  }
};
export { RegistrationAction };

// ------------------ ** ------------------- ** ------------- //

// Login Action

export const loginUserAction = async (data: LoginUserData) => {
  try {
    const { data: validatedData, error } = loginUserSchema.safeParse(data);

    if (error) {
      console.error("Validation Error:", error);
      return {
        success: false,
        message: error.issues[0].message,
      };
    }
    const { email, password } = validatedData;
    // Find the user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const isValidPassword = await argon2.verify(user[0].password, password);
    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Create a session for the user and set cookies
    await createSessionAndSetCookies(user[0].id);

    return {
      success: true,
      message: "Login successful",
      

    };
  } catch (error) {
    console.error("Login Error:", error);
    return {
      success: false,
      message: "Unknown error occurred please try again later",
    };
  }
};

// ------------------- ** ------------------- ** ------------- //

// logout User
export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return redirect("/login");

  const hashToken = async (session: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(session);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };
  const tokenHash = await hashToken(session);

  await invalidateSession(tokenHash);
  cookieStore.delete("session");

  return redirect("/login");
};

// ------------------- ** ------------------- ** ------------- //
