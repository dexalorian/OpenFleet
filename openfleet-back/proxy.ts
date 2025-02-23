import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from "cors";
const app = express();
app.use(cors({origin: ['http://localhost:3000', 'lazy-flies-shake.loca.lt', 'http://localhost:8484'], credentials: true, allowedHeaders: ['Content-Type']}));
app.use( (req, res, next) => {console.log(`Proxy request: ${req.method} ${req.url}`);
next();
})
// Proxy API requests to the backend (change port if needed )
app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8484/api", 
      changeOrigin: true}));
// Proxy everything else to Vue dev server

app.use(
    "/io",
    createProxyMiddleware({
      target: "ws://localhost:8484/",
      changeOrigin: true,
      ws: true, 
      secure: false,
      logger: console
    })
  );


app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:5173", // Your Vue client
    changeOrigin: true})
);

app.listen(3000, () => console.log("Proxy server running on port 3000"));