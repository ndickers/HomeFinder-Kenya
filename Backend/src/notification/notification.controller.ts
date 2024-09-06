import { Context } from "hono";
import { getUserNotificationService } from "./notification.service";

export async function getUserNotification(c: Context) {
  const userId = Number(c.req.param("id"));
  try {
    const result = await getUserNotificationService(userId);
    if (result !== null) {
      if (result.length !== 0) {
        return c.json({ result });
      }
      return c.json({ message: "You have no notification" }, 404);
    } else {
      return c.json(
        { error: "Server error, unable to get notifications" },
        500
      );
    }
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function updateNotificationToRead(c: Context) {
  const id = Number(c.req.param("id"));
  try {
  } catch (error) {
    return c.json(
      { error: "Server error, unable to update notification read status" },
      500
    );
  }
}
