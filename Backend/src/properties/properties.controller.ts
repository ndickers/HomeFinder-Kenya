import { Context } from "hono";
import * as v from "valibot";
import {
  serveAgentProperties,
  serveAllProperties,
  createPropertyService,
  updatePropertyService,
  deletePropertyService,
} from "./properties.services";
import { propertySchema } from "./validationpropertySchema";
import { TIAdminLogs, TINotification, TIProperties } from "../drizzle/schema";
import { createAdminLogs } from "../adminActivityLogs/logs.services";
import { createNotificationService } from "../notification/notification.service";
import type { Server as TSocketServer } from "socket.io";

import { Server, Socket } from "socket.io";
import { serveUsersOfSpecificLocation } from "../users/users.services";

export function propertyNotificationHandler(io: Server, socket: Socket) {
  // Listen for property-related notifications
  socket.on("new-property-notification", (data) => {
    // Emit the notification to all connected clients
    io.emit("new-property-notification", data);
  });
}

export async function getAllProperties(c: Context) {
  try {
    const result = await serveAllProperties();
    if (result === null) {
      return c.json({ error: "server error. Unable to get properties" }, 500);
    }
    return result.length === 0
      ? c.json({ error: "No property found " }, 404)
      : c.json({ result });
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function getAgentProperties(c: Context) {
  const id = Number(c.req.param("id"));

  try {
    const result = await serveAgentProperties(id);
    if (result === null) {
      return c.json({ error: "server error. Unable to get properties" }, 500);
    }
    return result.length === 0
      ? c.json({ error: "No property found " }, 404)
      : c.json({ result });
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function createNewProperty(c: Context) {
  const io = c.get("io") as TSocketServer;
  const propertyDetails = await c.req.json();
  const adminId = c.req.query("id") ? Number(c.req.query("id")) : undefined;

  const result = v.safeParse(propertySchema, propertyDetails, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }
  try {
    if (adminId === undefined) {
      const propertyResult = await createPropertyService(result.output);
      if (propertyResult !== null) {
        if (propertyResult.length !== 0) {
          //get users with location match
          const userIds = await serveUsersOfSpecificLocation(
            propertyResult[0].location
          );
          const notificationArray = userIds?.map((user) => ({
            message: `New ${propertyResult[0].propertyName} property was added around ${propertyResult[0].location} your location`,
            user_id: user.id,
            entity_type: "property",
            entity_id: propertyResult[0].id,
          }));

          //add notification send to all users in the db
          const result = await createNotificationService(
            notificationArray as TINotification[]
          );
          if (result !== null) {
            if (result.length !== 0) {
              //new property notification
              io.to(propertyResult[0].location).emit(
                "notification",
                `New property was added around your location: ${propertyResult[0].location}`
              );
              return c.json({ message: "Property added successful" });
            }
          } else {
            return c.json(
              { error: "Server error, unable to create notification" },
              500
            );
          }
        }
      } else {
        return c.json(
          { error: "Server error, unable to create property" },
          500
        );
      }
    } else {
      const propertyResult = await createPropertyService(result.output);
      if (propertyResult !== null) {
        const adminLogs = {
          admin_id: adminId,
          entity_action: "create",
          entity_type: "property",
          entity_id: propertyResult[0].id,
          description: `Admin of Id ${adminId} created property of id ${propertyResult[0].id}`,
        };
        const logResult = await createAdminLogs(adminLogs as TIAdminLogs);
        if (logResult !== null) {
          return logResult.length !== 0
            ? c.json({ message: "user created successfully" })
            : c.json({ error: "Unable to create user" }, 404);
        } else {
          return c.json({ error: "Server error, Unable to add log" }, 500);
        }
      }
    }
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function updateProperty(c: Context) {
  const id = Number(c.req.param("id"));
  const adminId = c.req.query("id") ? Number(c.req.query("id")) : undefined;
  const updateDetails = await c.req.json();
  try {
    if (adminId === undefined) {
      const result = await updatePropertyService(id, updateDetails);
      if (result === null) {
        return c.json({ error: "Server error" }, 500);
      }
      return result.length !== 0
        ? c.json({ message: "Property updated successfully" })
        : c.json({ error: "Cannot update non existing property" }, 404);
    } else {
      const result = await updatePropertyService(id, updateDetails);
      if (result !== null) {
        const adminLogs = {
          admin_id: adminId,
          entity_action: "update",
          entity_type: "property",
          entity_id: result[0].id,
          description: `Admin of Id ${adminId} updated property of id ${result[0].id}`,
        };
        const logResult = await createAdminLogs(adminLogs as TIAdminLogs);
        if (logResult !== null) {
          return logResult.length !== 0
            ? c.json({ message: "Property updated successfully" })
            : c.json({ error: "cannot update not existing property" }, 404);
        }
      } else {
        return c.json("Unable to update property", 500);
      }
    }
  } catch (error) {
    return c.json({ error: "Server error" }, 500);
  }
}

export async function removeProperty(c: Context) {
  const adminId = c.req.query("id") ? Number(c.req.query("id")) : undefined;
  const id = Number(c.req.param("id"));
  try {
    const result = await deletePropertyService(id);
    if (result === null) {
      return c.json({ error: "Server error, unable to delete property" }, 500);
    }
    if (adminId !== undefined) {
      const adminLogs = {
        admin_id: adminId,
        entity_action: "delete",
        entity_type: "property",
        entity_id: result[0].id,
        description: `Admin of Id ${adminId} deleted property of id ${result[0].id}`,
      };
      const logResult = await createAdminLogs(adminLogs as TIAdminLogs);
      if (logResult !== null) {
        return result.length !== 0
          ? c.json({ message: "Property deleted successfully" })
          : c.json({ error: "Cannot delete non existing property" }, 404);
      } else {
        return c.json({ message: "Unable to delete property" }, 500);
      }
    }
    return result.length !== 0
      ? c.json({ message: "Property deleted successfully" })
      : c.json({ error: "Cannot delete non existing property" }, 404);
  } catch (error) {
    return c.json({ error }, 500);
  }
}
