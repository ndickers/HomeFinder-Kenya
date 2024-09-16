import { TIAdminLogs } from "./../drizzle/schema";
import { Context } from "hono";
import {
  createPropertyPhotoService,
  servePropertyPhotos,
} from "./photos.service";
import { createAdminLogs } from "../adminActivityLogs/logs.services";

export async function getPropertyPhotos(c: Context) {
  const propertyId = Number(c.req.param("id"));
  try {
    const result = await servePropertyPhotos(propertyId);
    if (result !== null) {
      if (result.length !== 0) {
        return c.json({ result });
      }
      return c.json({ message: "property photos not found" }, 404);
    }
    return c.json({ error: "Server error, unable to get photos" }, 500);
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function createPropertyPhotos(c: Context) {
  const adminId = c.req.query("id") ? Number(c.req.query("id")) : undefined;
  const photoDetails = await c.req.json();
  try {
    const result = await createPropertyPhotoService(photoDetails);

    if (result !== null) {
      if (result.length !== 0) {
        if (adminId === undefined) {
          return c.json({ message: "Photo added successfully" });
        }
        const adminLogs = {
          admin_id: adminId,
          entity_action: "create",
          entity_type: "property photo",
          entity_id: result[0].id,
          description: `Admin of Id ${adminId} deleted property of id ${result[0].id}`,
        };

        const logResult = await createAdminLogs(adminLogs as TIAdminLogs);
        if (logResult !== null) {
          return result.length !== 0
            ? c.json({ message: "Photo added successfully" })
            : c.json({ error: "Cannot create non existing property" }, 404);
        } else {
          return c.json({ message: "Unable to delete property" }, 500);
        }
      }
      return c.json({ message: "Unable to add photo" }, 404);
    }
  } catch (error) {
    return c.json({ error }, 500);
  }
}
