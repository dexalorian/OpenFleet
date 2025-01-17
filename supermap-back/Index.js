
import express from "express";
import path from "path"

import cors from "cors"
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import multer from "multer";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { dbUser } from "./schemas.js";
const fileparser  =  multer({ dest:  'uploads/'  })

import { createNewPhoto, getAllPhotos } from "./service.js";
import { log } from "console";
import cookieParser from "cookie-parser";
const app = express()
mongoose.connect('mongodb://host.docker.internal:27017/').then(
    () => console.log('Mongoose connected'),
    err => console.log('Mongoose not connected')    
)

let __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cookieParser())
app.use(cors({  origin: 'http://localhost:5173',
    credentials: true}))
app.use(express.json())


app.use( (req, res, next) => {console.log('Received cookie: ', req.cookies.access_token); next()} )
console.log(path.dirname(import.meta.url))

app.get('/', (req, res) =>  {console.log('kek'); res.cookie('token', 'token_value', {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
}); res.send('kek')} 
)


app.post('/login', (req, res) => {
   const hashed = bcrypt.hashSync(req.body.password, 8)
   console.log(hashed)
   // Find user in database
    // dbUser.findOne(req.cookies[])
   const tkn = jwt.sign({username: 'demo@demo.com' }, 'kawabunga', {expiresIn: '30d'})
   console.log( 'Token: ', tkn )
res.cookie('access_token', tkn , {
    secure: true,
    sameSite: 'lax',
    httpOnly: true

} )

res.status(200).json({ message: 'HTTP-only cookie set!' });

})

app.post('/upload', fileparser.single('file'), createNewPhoto)

app.get('/photos', (req, res) => {
getAllPhotos(req, res)

//  fs.readdir(__dirname + '/uploads/', (err, e) =>   res.status(200).json(e))
 })

 app.get('/photo/*', (req, res) => {  

     try {
        const file = fs.readFileSync(__dirname + '/uploads/'+req.params[0])

        res.sendFile(__dirname + '/uploads/'+req.params[0])
        
     } catch (error) {
        res.status(404).send()
     } 
    
    
    // console.log(file)

 })

console.log(path.extname(fileURLToPath(import.meta.url))) 

app.listen(3000)