import { Context } from "hono";
import * as v from "valibot";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  createResendToken,
  createTokenService,
  getOneUserService,
  getOneUserServiceByEmail,
  getTokenService,
  registerUserService,
  updateUserOnVerified,
} from "./auth.service";

const createUserSchema = v.object({
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

export async function Register(c: Context) {
  const userDetails = await c.req.json();
  userDetails.password = await bcrypt.hash(userDetails.password, 8);
  const result = v.safeParse(createUserSchema, userDetails, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }

  try {
    const createdUser = await registerUserService(result.output);
    if (createdUser !== null) {
      const token: string = uuidv4();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);
      const verificationDetails = {
        user_id: createdUser[0].id,
        token: token,
        expires_at: expirationTime,
      };
      try {
        const sendToken = await createTokenService(verificationDetails);
        if (sendToken !== null) {
          // send email
          // send v.email
          // send email

          return c.json({ token });
        }
      } catch (error) {
        return c.json({ error }, 404);
      }
    } else {
      return c.json({ error: "Unable to register user" }, 404);
    }
  } catch (error) {
    return c.json({ error }, 404);
  }
}

export async function verifyUser(c: Context) {
  const { token } = c.req.query();
  try {
    const getToken = await getTokenService(token);
    if (getToken !== null) {
      const currentTime = new Date();
      //   check if token has expired before verifying user
      if (currentTime < new Date(getToken[0].expiresAt)) {
        const isUserVerified = await getOneUserService(getToken[0].userId);
        if (isUserVerified[0].verified === "unverified") {
          // verify user
          const verifiedUser = await updateUserOnVerified(getToken[0].userId);
          return verifiedUser !== null
            ? c.json({ message: "user verification successful" })
            : c.json({ message: "Unable to verify user" }, 404);
        } else if (isUserVerified[0].verified === "banned") {
          return c.json({
            message: "This user is banned from using our platform",
          });
        }
        return c.json({
          message: "The user is already verified. Login to account",
        });
      } else {
        return c.json({ message: "Token has expired" });
      }
    } else {
      return c.json({ error: "Server error" }, 404);
    }
  } catch (error) {
    return c.json({ error }, 404);
  }
}

export async function resendVerificationToken(c: Context) {
  const { email } = await c.req.json();
  try {
    const getUser = await getOneUserServiceByEmail(email);

    if (getUser !== null) {
      if (getUser[0].verified === "verified") {
        return c.json({ message: "User is already verified" });
      } else if (getUser[0].verified === "banned") {
        return c.json({
          message: "This user is banned from using our platform",
        });
      }
      const token: string = uuidv4();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);
      const verificationDetails = {
        user_id: getUser[0].userId,
        token: token,
        expires_at: expirationTime,
      };
      const sendToken = await createResendToken(
        verificationDetails,
        getUser[0].userId
      );
      if (sendToken !== null) {
        // send email
        // send v.email
        // send email
        return c.json({ token });
      }
    } else {
      return c.json({ error: "Server error. unable to resend token" }, 404);
    }
  } catch (error) {
    return c.json({ error }, 404);
  }
}
