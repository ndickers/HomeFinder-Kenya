import { TIToken, TSUser } from "./../drizzle/schema";
import db from "../drizzle/db";
import { users, verification_tokens } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export interface TNewUser {
  full_name: string;
  email: string;
  contact_phone: string;
  password: string;
}

export async function registerUserService(
  newUser: TNewUser
): Promise<{ id: number }[] | null> {
  return await db.insert(users).values(newUser).returning({ id: users.id });
}

export async function createTokenService(
  verificationDetails: TIToken
): Promise<{ id: number }[] | null> {
  return await db
    .insert(verification_tokens)
    .values(verificationDetails)
    .returning({ id: verification_tokens.token_id });
}

export async function getTokenService(
  token: string
): Promise<{ userId: number; expiresAt: Date }[] | null> {
  return db
    .select({
      expiresAt: verification_tokens.expires_at,
      userId: verification_tokens.user_id,
    })
    .from(verification_tokens)
    .where(eq(verification_tokens.token, token));
}

export async function getOneUserService(id: number) {
  return db
    .select({
      verified: users.account_status,
    })
    .from(users)
    .where(eq(users.id, id));
}

export async function getOneUserServiceByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email));
}

export async function updateUserOnVerified(
  userId: number
): Promise<{ id: number }[] | null> {
  return await db
    .update(users)
    .set({ account_status: "verified" })
    .where(eq(users.id, userId))
    .returning({ id: users.id });
}

export async function createResendToken(
  verificationDetails: TIToken,
  userId: number
) {
  await db.transaction(async (tx) => {
    await tx
      .delete(verification_tokens)
      .where(eq(verification_tokens.user_id, userId));
    await tx
      .insert(verification_tokens)
      .values(verificationDetails)
      .returning({ id: verification_tokens.token_id });
    return "token-saved";
  });
}
