import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "./auth/auth.routes";
import { propertiesRoutes } from "./properties/properties.routes";

const app = new Hono();

app.route("/", authRoutes);
app.route("/", propertiesRoutes);
const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
