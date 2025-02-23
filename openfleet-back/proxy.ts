import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from "cors";
const app = express();
app.use(cors({origin: "*", allowedHeaders: ['Content-Type']}));
app.use( (req, res, next) => {console.log(`Proxy request: ${req.method} ${req.url}`);
next();})
// Proxy API requests to the backend (change port if needed )
app.use(
    "/manager",
    createProxyMiddleware({
      target: "http://localhost:8484", 
      changeOrigin: true,
      ws: true}));
// Proxy everything else to Vue dev server

app.use(
    "/ws",
    createProxyMiddleware({
      target: "http://localhost:8484",
      changeOrigin: true,
      ws: true,  // Enables WebSocket proxying
      logLevel: "debug",
    })
  );

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5174", // Your Vue client
    changeOrigin: true,
    ws: true})
);

app.listen(3000, () => console.log("Proxy server running on port 3000"));