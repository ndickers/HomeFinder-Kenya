import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "./auth/auth.routes";

const app = new Hono();

app.route("/", authRoutes);
const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
