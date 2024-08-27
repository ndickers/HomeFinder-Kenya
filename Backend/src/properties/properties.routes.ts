import { Hono } from "hono";
import {
  getAgentProperties,
  getAllProperties,
  createNewProperty,
  updateProperty,
  removeProperty,
} from "./properties.controller";

export const propertiesRoutes = new Hono();

propertiesRoutes.get("/properties", getAllProperties);

propertiesRoutes.get("/properties/:id", getAgentProperties);

propertiesRoutes.post("/properties", createNewProperty);

propertiesRoutes.put("/properties/:id", updateProperty);

propertiesRoutes.delete("/properties/:id", removeProperty);
