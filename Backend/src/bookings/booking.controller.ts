import { TIAdminLogs, TINotification } from "./../drizzle/schema";
import { Context } from "hono";
import * as v from "valibot";
import { createBookingService, updateBookingService } from "./booking.service";
import { createAdminLogs } from "../adminActivityLogs/logs.services";
import { serveOneProperty } from "../properties/properties.services";
import { createNotificationService } from "../notification/notification.service";
import { Server } from "socket.io";

const bookingSchema = v.object({
  user_id: v.number("User ID is required and is of type number"),
  property_id: v.number("property ID is required and is of type number"),
  viewing_date: v.pipe(
    v.date("Provide viewing date"),
    v.toMinValue(new Date())
  ),
});

export async function createBooking(c: Context) {
  const adminId = c.req.query("id") ? Number(c.req.query("id")) : undefined;
  const io = c.get("io");
  const bookingDetails = await c.req.json();
  //change string data to Date object to be validated
  const viewDate = new Date(bookingDetails.viewing_date);
  bookingDetails.viewing_date = viewDate;

  const result = v.safeParse(bookingSchema, bookingDetails, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }

  try {
    const bookResult = await createBookingService(result.output);
    if (bookResult !== null) {
      if (bookResult.length !== 0) {
        //get agentId to send notification
        const getAgentId = await serveOneProperty(bookResult[0].propertyId);
        if (getAgentId !== null && getAgentId.length !== 0) {
          const notificationDetail = [
            {
              user_id: getAgentId[0].owner_id,
              message: `New booking was made`,
              entity_type: "booking",
              entity_id: bookResult[0].id,
            },
          ];
          const notificationResult = await createNotificationService(
            notificationDetail as TINotification[]
          );
          if (notificationResult !== null) {
            if (notificationResult.length !== 0) {
              io.to(`agent${getAgentId[0].owner_id}`).emit(
                "notification",
                "You have a new booking"
              );
              if (adminId === undefined) {
                return c.json({ message: "Booking created successfully" });
              }
              //if admin creates the booking, save to log
              const adminLogs = {
                admin_id: adminId,
                entity_action: "create",
                entity_type: "booking",
                entity_id: bookResult[0].id,
                description: `Admin of Id ${adminId} created property of id ${bookResult[0].id}`,
              };
              const logResult = await createAdminLogs(adminLogs as TIAdminLogs);
              if (logResult !== null) {
                if (logResult.length !== 0) {
                  return c.json({
                    message: "log for booking, created successfully",
                  });
                }
              }
              return c.json({ error: "Unable to create log for booking" }, 500);
            }
            return c.json({ message: "Unable to create notification" }, 404);
          }
          return c.json({ error: "unable to create notification" }, 500);
        }
      }
    }
    return c.json({ error: "Server error. Unable to create booking" }, 500);
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function updateBooking(c: Context) {
  const adminId = c.req.query("id") ? Number(c.req.query("id")) : undefined;
  const io = c.get("io") as Server;
  const bookingId = Number(c.req.param("id"));

  const updateDetails = await c.req.json();

  // when user change update date, agent should be notified
  //when agent confirm the booking date, user should be notified

  try {
    if (updateDetails.viewing_date !== undefined) {
      const viewing_date = new Date(updateDetails.viewing_date);

      const result = await updateBookingService(bookingId, {
        viewing_date,
      });

      if (result !== null) {
        if (result.length !== 0) {
          //get agentId to send notification
          const getAgentId = await serveOneProperty(result[0].propertyId);
          if (getAgentId !== null) {
            if (getAgentId.length !== 0) {
              const notificationContent = [
                {
                  user_id: getAgentId[0].owner_id,
                  message: `viewing date was changed`,
                  entity_type: "booking",
                  entity_id: result[0].propertyId,
                },
              ];

              const newNotification = await createNotificationService(
                notificationContent as TINotification[]
              );
              if (newNotification !== null) {
                if (newNotification.length !== 0) {
                  //send notification to agent
                  io.to(`agent${getAgentId[0].owner_id}`).emit(
                    "notification",
                    "viewing date was changed"
                  );

                  if (adminId === undefined) {
                    return c.json({
                      message: "Notification created successfully",
                    });
                  } else {
                    const adminLogs = {
                      admin_id: adminId,
                      entity_action: "update",
                      entity_type: "booking",
                      entity_id: result[0].propertyId,
                      description: `Admin of Id ${adminId} created property of id ${result[0].id}`,
                    };
                    const logResult = await createAdminLogs(
                      adminLogs as TIAdminLogs
                    );
                    if (logResult !== null) {
                      if (logResult.length !== 0) {
                        return c.json({
                          message: "log for booking, created successfully",
                        });
                      }
                    }
                    return c.json(
                      { error: "Unable to create log for booking" },
                      500
                    );
                  }
                }
              }
              return c.json({ error: "Unable to create notification" }, 500);
            }
            return c.json({ message: "The agent does not exist" }, 404);
          }
          return c.json({ error: "Unable to get agentId" }, 500);
        }
        return c.json({ message: "booking does not exist" }, 404);
      }
    }
  } catch (error) {
    return c.json({ error }, 500);
  }
}
