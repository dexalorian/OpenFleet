
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
import fs from 'fs'
import { v4 as uuid, validate } from "uuid"

import { createNewPhoto, getAllPhotos, sendActivationMail } from "./service.js";
import cookieParser from "cookie-parser";
const app = express()
mongoose.connect('mongodb://localhost:27017/').then(
    () => console.log('Mongoose connected'),
    err => console.log('Mongoose not connected')    
)

let __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true}))
app.use(express.json())

app.use(async (req, res, next) => {
    console.log( 'Income cookie: ', req.cookies)
    if (req.originalUrl === '/login') {
        next()
    } else {
        if (req.cookies.access_tkn) {
            console.log('JWT', jwt.verify(req.cookies.access_tkn, 'kawabunga'));
            req.jwt = await jwt.verify(req.cookies.access_tkn, 'kawabunga')

            console.log('Decoded income JWT: ', req.jwt)
            next();
        } else if (req.originalUrl ==='/signup') {
            next()
        } else {
            res.status(302).redirect('/login')
            console.log('trying to redirect')
            // next()
        }
    }
    // next()
      }  )

    app.post('/login', async (req, res) => {
  
          // Find user in the database by email
          console.log(req.body)
          const user = await dbUser.findOne({ email: req.body.username });
           console.log( 'user from db', user)
      
        if (!user) {
            console.log("User not exist")
            return res.status(401).send("User not exist")
        } else {
            if (!user?.activated) {
                console.log("Not activated")
                return res.status(401).send("Fail")
            }
        }
            console.log(user)
          // Compare the password using bcrypt (synchronous comparison)
          const isPasswordValid = bcrypt.compareSync(req.body.password, user.pwd);
      
          // Generate JWT token
          const tkn = jwt.sign(
            { email: user.email, firstname: user.firstname, id: user.id },
            'kawabunga',
            { expiresIn: '30d' }
          );
          console.log('Token: ', tkn);
      
          // Set the JWT token as a cookie
          res.cookie('access_tkn', tkn, {
            secure: false, // Make sure you're using HTTPS in production
            sameSite: 'lax',
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration to match JWT expiration
          });
      
          // Send the user information back in the response
          return res.json({
            email: user.email,
            firstname: user.firstname,
            id: user.id
          });
      
    
      });


app.post('/logout', async (req, res) => {
    res.cookie( 'access_tkn', null, {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 0,
        path: '/'
    }  )
    res.status(200).send('Logged out')

})

app.post('/auth', async (req, res) => {
    const user = jwt.verify(req.cookies.access_tkn, 'kawabunga')
    // console.log('Auth jwt: ', user)
    if (user.email) {
        res.json({valid: true}).send()
    } else {
        res.json({valid: false}).send()
    }
    
})

app.post('/signup', async (req, res) => {
    console.log(req.body)
    const hashed = await bcrypt.hash(req.body.password, 8);
    const mail_token = await uuid()

    dbUser.create({  
        id: uuid(),
        firstname: req.body.name,
        email: req.body.email,
        pwd: hashed,
        activated: false,
        activation_token: mail_token
    })

    sendActivationMail(req.body.email, mail_token)
    res.status(200).send('Activation code sent to '+req.body.email)

} )


app.get('/activate', async (req, res) => {
 let user = await dbUser.findOne( {activation_token: req.query.act_tkn} )
    user.activated = true
    user.save()
    console.log('Found '+ user)

})


app.get('/testmail', () =>  sendActivationMail())

app.post('/upload', fileparser.single('file'), createNewPhoto)

app.get('/photos', (req, res) => {
getAllPhotos(req, res)

 })

 app.get('/photo/*', (req, res) => {  
    console.log(req.params)
    console.log(__dirname + '/uploads/'+req.params[0])
     try {
        const file = fs.readFileSync(__dirname + '/uploads/'+req.params[0])
        console.log(__dirname + '/uploads/'+req.params[0])
        res.sendFile(__dirname + '/uploads/'+req.params[0])
        
     } catch (error) {
        res.status(404).send()
     } 
    // console.log(file)

 })

console.log(path.extname(fileURLToPath(import.meta.url))) 

app.listen(3000)