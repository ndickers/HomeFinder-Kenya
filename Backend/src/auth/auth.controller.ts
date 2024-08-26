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
  updateUserPassword,
  registerUserService,
  updateUserOnVerified,
} from "./auth.service";
import jwt from "jsonwebtoken";
import {
  createUserSchema,
  loginUserScheme,
  emailSchema,
  updatePasswordSchema,
} from "./validationSchemas";

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
    return c.json({ error }, 500);
  }
}

export async function verifyUser(c: Context) {
  const { token } = c.req.query();
  try {
    const getToken = await getTokenService(token);
    if (getToken !== null) {
      if (getToken.length !== 0) {
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
          return c.json({ message: "Token has expired" }, 401);
        }
      } else {
        return c.json({ error: "Invalid token" }, 404);
      }
    } else {
      return c.json({ error: "Server error" }, 404);
    }
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function resendVerificationToken(c: Context) {
  const { email } = await c.req.json();
  try {
    const getUser = await getOneUserServiceByEmail(email);

    if (getUser !== null) {
      if (getUser[0].account_status === "verified") {
        return c.json({ message: "User is already verified" });
      } else if (getUser[0].account_status === "banned") {
        return c.json({
          message: "This user is banned from using our platform",
        });
      }
      const token: string = uuidv4();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);
      const verificationDetails = {
        user_id: getUser[0].id,
        token: token,
        expires_at: expirationTime,
      };
      const sendToken = await createResendToken(
        verificationDetails,
        getUser[0].id
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
    return c.json({ error }, 500);
  }
}

// sign in user

export async function loginUser(c: Context) {
  const loginDetails = await c.req.json();
  const result = v.safeParse(loginUserScheme, loginDetails, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }

  try {
    const checkIfUserExist = await getOneUserServiceByEmail(
      result.output.email
    );
    if (checkIfUserExist !== null) {
      if (checkIfUserExist.length === 0) {
        return c.json({ message: "User does not exist" }, 404);
      }
      const isPasswordCorrect = await bcrypt.compare(
        result.output.password,
        checkIfUserExist[0].password
      );
      if (isPasswordCorrect) {
        // return token and user cdetails
        const token = jwt.sign(
          {
            name: checkIfUserExist[0].full_name,
            role: checkIfUserExist[0].role,
          },
          process.env.SECRET as string
        );
        const { password, account_status, ...user } = checkIfUserExist[0];
        return c.json({ token, user });
      } else {
        return c.json({ message: "Incorrect password" }, 404);
      }
    }
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function resetPassword(c: Context) {
  const email = await c.req.json();

  const result = v.safeParse(emailSchema, email, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }
  try {
    const checkIfUserExist = await getOneUserServiceByEmail(
      result.output.email
    );
    if (checkIfUserExist !== null) {
      console.log(checkIfUserExist);
      if (checkIfUserExist.length === 0) {
        return c.json({ message: "User does not exist" }, 404);
      }
      const token: string = uuidv4();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      const tokenDetails = {
        user_id: checkIfUserExist[0].id,
        token: token,
        expires_at: expirationTime,
      };
      const sendToken = await createResendToken(
        tokenDetails,
        checkIfUserExist[0].id
      );
      if (sendToken !== null) {
        // send email with token url
        // send email
        // send email
        console.log(sendToken);
        return c.json({ message: "Confirm your email" });
      }
      return c.json({ message: "Server error" }, 500);
    }
  } catch (error) {
    return c.json({ error });
  }
}

export async function setPassword(c: Context) {
  const passwordCredentaials = await c.req.json();
  const { token } = c.req.query();
  const result = v.safeParse(updatePasswordSchema, passwordCredentaials, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }
  const hashedPass = await bcrypt.hash(passwordCredentaials.password, 8);

  const getToken = await getTokenService(token);
  if (getToken !== null) {
    if (getToken.length !== 0) {
      const currentTime = new Date();
      //   check if token has expired before updating password
      if (currentTime < new Date(getToken[0].expiresAt)) {
        //update user password
        const passUpdated = await updateUserPassword(
          hashedPass,
          getToken[0].userId
        );
        return passUpdated !== null
          ? c.json({ message: "Password updated successfully" })
          : c.json({ error: "unable to update password" }, 500);
      } else {
        return c.json({ message: "Token has expired" }, 401);
      }
    } else {
      return c.json({ error: "Invalid token" }, 404);
    }
  }
  return c.json({ error: "Unable to verify token" }, 500);
}
