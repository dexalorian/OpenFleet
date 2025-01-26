
import express from "express";
import path from "path"
import cors from "cors"
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import multer from "multer";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { dbUser, dbMap, dbGuest } from "./schemas.js";
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
    if (req.cookies.access_tkn) {
        req.jwt = await jwt.verify(req.cookies.access_tkn, 'kawabunga')
        next()
    } else if (req.originalUrl === '/login' || req.originalUrl === '/auth' || req.originalUrl === '/signup') {
        next()
    } else {
        res.status(401).send()
    }

        }

    // next()
       )

    app.post('/login', async (req, res) => {
        console.log('Login triggered')
          const user = await dbUser.findOne({ email: req.body.username });
        
        if (!user) {
            console.log("User not exist")
            return res.status(401).send("User not exist")
        } else {
            if (!user?.activated) {
                console.log("Not activated")
                return res.status(401).send("Fail")
            }
        }
   
          // Compare the password using bcrypt (synchronous comparison)
          const isPasswordValid = bcrypt.compareSync(req.body.password, user.pwd);
      
          // Generate JWT token
          const tkn = jwt.sign(
            { email: user.email, firstname: user.firstname, id: user.id },
            'kawabunga',
            { expiresIn: '30d' }
          );
      
      
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
    console.log('logoout triggered')
    res.cookie( 'access_tkn', null, {
        secure: false,
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 0,
        path: '/'
    }  )
    res.status(200).send('Logged out')

})

app.get('/guest', (req, res) => {

    res.json({ guest_id: uuid() })

})

app.post('/auth', async (req, res) => {
     let user = req.cookies.access_tkn ? jwt.verify(req.cookies?.access_tkn, 'kawabunga') : null
    // console.log('Auth jwt: ', user)
    if (user?.email) {
        console.log('Mail exist')
        const userdb = await dbUser.findOne( {id: user.id} )
        if (!userdb.defaultMapId) {
            const newid = await uuid()
            // user.defaultMap = 'dfdfd'
            const newmap = await dbMap.create({ id: newid, author: userdb._id, admins: [userdb._id] })
            userdb.maps.push(newmap._id)
            userdb.defaultMapId = newmap._id
            userdb.save()
        }

        res.json({valid: true, defaultMap: userdb.id }).send()

    } else {

        let guestid = ''
        console.log("Mail don't exist")
        if (!req.cookies.guest_tkn) {
            console.log('No guest cookie')
            const new_guest = await uuid()
            const newmap =  await dbMap.create({ id: uuid() })
            await dbGuest.create({ id: new_guest, defaultMapId: newmap._id })
            res.cookie('guest_tkn', jwt.sign({id: new_guest}, 'kawabunga'), {expiresIn: '30d', 
                secure: false, httpOnly: false, sameSite: 'lax'})
        } else {
            console.log('guest cookie ', req.cookies.guest_tkn)
            const dectkn = jwt.verify(req.cookies.guest_tkn, 'kawabunga');
            guestid = await dbGuest.findOne({ id: dectkn.id }) 
            console.log('guest cookie', dectkn)
            if (guestid) {
                res.cookie('guest_tkn', jwt.sign({id: guestid.id}, 'kawabunga'), {expiresIn: '30d'})
            }

        }

         
        res.json({valid: false, defaultMap: guestid.defaultMapId}).send()
    }
    
})

app.post('/signup', async (req, res) => {
   
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


app.post('/newmap', async (req, res) => {
    const newid = uuid()
    const user = await dbUser.findOne({id: req.jwt?.id})
    dbMap.create({ id: newid, author: user._id, admins: [user._id] })
    // here to implement 
    console.log( 'NewMap ID: ', newid )
    res.status(200).json({id: newid})

} )

app.get('/map*', (req,res) => {
console.log(' Map share Id: ', req.query.id)
res.status(200).json({})


})

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