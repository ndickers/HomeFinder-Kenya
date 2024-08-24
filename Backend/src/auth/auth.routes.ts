import { Hono } from "hono";
import {
  Register,
  verifyUser,
  resendVerificationToken,
} from "./auth.controller";

export const authRoutes = new Hono();

authRoutes.post("register", Register);

authRoutes.post("verify-user", verifyUser);

authRoutes.post("resend-verification", resendVerificationToken);
