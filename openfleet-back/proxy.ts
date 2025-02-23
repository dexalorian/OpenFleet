import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from "cors";
const app = express();
app.use(cors({origin: ['http://localhost:3000', 'https://3074-45-9-72-39.ngrok-free.app', 'http://localhost:8484'], credentials: true, allowedHeaders: ['Content-Type']}));
app.use( (req, res, next) => {console.log(`Proxy request: ${req.method} ${req.url}`);
next();
console.log(req.headers )
})
// Proxy API requests to the backend (change port if needed )
app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8484/api", 
      changeOrigin: true,
      ws: true }));
// Proxy everything else to Vue dev server

app.use(
    "/ws",
    createProxyMiddleware({
      target: "ws://localhost:8484",
      changeOrigin: true,
      ws: true,  // Enables WebSocket proxying
    })
  );

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173", // Your Vue client
    changeOrigin: true,
    ws: true})
);

app.listen(3000, () => console.log("Proxy server running on port 3000"));