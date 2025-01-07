
import express from "express";
import path from "path"
import fs from "fs"

import cors from "cors"
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import multer from "multer";
const fileparser  =  multer({ dest:  'uploads/'  })

import { createNewPhoto, getAllPhotos } from "./service.js";
const app = express()
mongoose.connect('mongodb://host.docker.internal:27017/').then(
    () => console.log('Mongoose connected'),
    err => console.log('Mongoose not connected')    
)

let __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cors())
app.use(express.json())
console.log(path.dirname(import.meta.url))

app.get('/', (req, res) =>  {console.log('kek'); res.cookie('token', 'token_value', {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
}); res.send('kek')} 
)

app.post('/upload', fileparser.single('file'), createNewPhoto)

app.get('/photos', (req, res) => {
 console.log('photos request')
getAllPhotos(req, res)

//  fs.readdir(__dirname + '/uploads/', (err, e) =>   res.status(200).json(e))
 })

 app.get('/photo/*', (req, res) => {  

    const file = fs.readFileSync(__dirname + '/uploads/'+req.params[0])
    res.sendFile(__dirname + '/uploads/'+req.params[0])
    // console.log(file)

 })

console.log(path.extname(fileURLToPath(import.meta.url))) 

app.listen(3000)