import * as v from "valibot";

export const createUserSchema = v.object({
  full_name: v.string("Enter full_name"),
  email: v.pipe(
    v.string("Enter email address"),
    v.email("Invalid email address")
  ),
  contact_phone: v.string("Enter contact_phone"),
  password: v.pipe(
    v.string("Enter password"),
    v.minLength(8, "Password must be at least 8 characters long"),
    v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    v.regex(/[0-9]/, "Password must contain at least one number"),
    v.regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
  ),
});

export const loginUserScheme = v.object({
  email: v.pipe(
    v.string("Enter email address"),
    v.email("Invalid email address")
  ),
  password: v.string("Enter password"),
});

export const emailSchema = v.object({
  email: v.pipe(
    v.string("Enter email address"),
    v.email("Invalid email address")
  ),
});

export const updatePasswordSchema = v.object({
  password: v.pipe(
    v.string("Enter password"),
    v.minLength(8, "Password must be at least 8 characters long"),
    v.regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    v.regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
    v.regex(/[0-9]/, "Password must contain at least one number"),
    v.regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
  ),
});
