
import express from "express";
import path from "path"
import cors from "cors"
import 'dotenv/config';
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import multer from "multer";
const fileparser  =  multer({ dest:  'uploads/' })
import { v4 as uuid, validate } from "uuid"
import cookieParser from "cookie-parser";
import { startSignalingServ } from "./wsserv.ts";
import { randomString } from "./utils.ts";
import http from "http"
import api from './api.ts'

const app = express()



mongoose.connect('mongodb://localhost:27017/').then(
    () => console.log('Mongoose connected'),
    err => console.log('Mongoose not connected')    
)

let __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:8484', 'http://localhost:5173','https://45.9.72.39' , 'https://openfleet.serveo.net'], credentials: true}))
app.use(express.json());
app.use('/api', api )
  
  // Логирование тела запроса после применения express.json()
  app.use((req, res, next) => {
    
    console.log('Request body after JSON parsing:', req.baseUrl);
    next();
  });

  let srv = http.createServer(app)


srv.listen(8484, () => console.log("WebSocket server running on port 8484"));

startSignalingServ(srv);
