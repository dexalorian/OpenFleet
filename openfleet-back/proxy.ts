import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware"
import cors from "cors";
const app = express();
app.use(cors({origin: ['http://localhost:3000', 'https://45.9.72.39', 'http://localhost:5173','http://localhost:8484',  'https://transtaxi.app'], credentials: true, allowedHeaders: ['Content-Type']}));
app.use( (req, res, next) => {console.log(new Date().toISOString().split('T')[1] + ` Proxy request: ${req.method} ${req.url}`);
next();
})
// Proxy API requests to the backend (change port if needed )


// app.use((req, res, next) => {
//   // console.log('REQUEST', req)
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8484/api", 
      changeOrigin: true}));
// Proxy everything else to Vue dev server

app.use(
    "/io",
    createProxyMiddleware({
      target: "http://localhost:8484",
      ws: true,
      changeOrigin: true, 
      logger: console,
    })
  );

  app.use(
    '/vite_hmr',  // Make sure this path matches the one Vite is using
    createProxyMiddleware({
      target: 'http://localhost:5929',  // Proxy WebSocket to Vite dev server
      ws: true,
      changeOrigin: true,
      logger: console,
      
    })
  );



// Proxy main frontend (localhost:3000 → localhost:5173)[]
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost',
    changeOrigin: true,
    secure: false,
    // ws: true
    // logger: console
  })
);

app.listen(3000, () => console.log("Proxy server running on port 3000"))