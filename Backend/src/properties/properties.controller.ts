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
import { TIProperties } from "../drizzle/schema";

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
  const propertyDetails = await c.req.json();

  const result = v.safeParse(propertySchema, propertyDetails, {
    abortEarly: true,
  });
  if (!result.success) {
    return c.json({ message: result.issues[0].message }, 404);
  }
  try {
    const propertyResult = await createPropertyService(result.output);
    if (propertyResult === null) {
      return c.json({ error: "Server error, unable to create property" }, 500);
    }
    return propertyResult.length !== 0
      ? c.json({ message: "Property created successfully" })
      : c.json({ error: "Unable to create new property" }, 404);
  } catch (error) {
    return c.json({ error }, 500);
  }
}

export async function updateProperty(c: Context) {
  const id = Number(c.req.param("id"));
  const updateDetails = await c.req.json();
  try {
    const result = await updatePropertyService(id, updateDetails);
    if (result === null) {
      return c.json({ error: "Server error" }, 500);
    }
    return result.length !== 0
      ? c.json({ message: "Property updated successfully" })
      : c.json({ error: "Cannot update non existing property" }, 404);
  } catch (error) {
    return c.json({ error: "Server error" }, 500);
  }
}

export async function removeProperty(c: Context) {
  const id = Number(c.req.param("id"));
  try {
    const result = await deletePropertyService(id);
    if (result === null) {
      return c.json({ error: "Server error, unable to delete property" }, 500);
    }
    return result.length !== 0
      ? c.json({ message: "Property deleted successfully" })
      : c.json({ error: "Cannot delete non existing property" }, 404);
  } catch (error) {
    return c.json({ error }, 500);
  }
}
