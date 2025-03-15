import fs from "fs"
import { v4 as uuid } from "uuid"
import path from "path"
import { fileURLToPath } from "url";
// import { dbUser } from "./schemas.js";
import nodemailer from 'nodemailer'
import { AccessToken } from 'livekit-server-sdk'

let __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createNewPhoto(req, res) {
    const newfilename = uuid() +  path.extname(req.file.originalname)
    fs.renameSync(__dirname + '/uploads/' +req.file.filename, 
        __dirname + '/uploads/'  + newfilename  ); 
        let user = await dbUser.findOne( {id: req.jwt.id }  )
        const { lat, lng } = JSON.parse(req.body.coords)
        const newPhoto = await dbPhoto.create({id: uuid(), lat, lng, 
          uploadedBy: user._id,
          filename: newfilename, ... JSON.parse(req.body.params)})
        user.photos.push( newPhoto._id  )
        user.save()
   res.status(200).send()
}

export function sendActivationMail(adress, token) {
const mail = nodemailer.createTransport(
  {service: 'mailersend',
    host: 'smtp.mailersend.net',
    port: 587,
    auth: {
        user: 'MS_It5ww6@trial-pr9084zqd9j4w63d.mlsender.net',
        pass: 'ZwjlhoKrXtlRRZiF'
    }}
)

mail.sendMail({from: 'MS_It5ww6@trial-pr9084zqd9j4w63d.mlsender.net', 
  to: adress, subject: 'Activate Supermap', 
  text: 'http://localhost:3000/activate?act_tkn='+token}, e => { console.log(e)})
}



export async function regVehicle(req, res) {
    let hashed =  await bcrypt.hash( req.body.pwd , 8)
    let newVehicle =  await vehicle.create( { ... req.body, pwd: hashed, id: uuid(), 
        activated: false,  } )

    res.json({})
}

export async function newVehicle(req, res) {
    const pwd_gen = randomString(12)
    let hashed =  await bcrypt.hash( pwd_gen , 8)
    const role = req.jwt?.role
    let author;
    if (role === 'mng') {
        author = await manager.findOne({id: req.jwt.id})
        
        let newVehicle =  await vehicle.create({login: req.body.login, pwd: 'temporary', id: uuid(), 
            activated: false, managers: [ author?._id ], owners: [ author?._id] } )
        author.vehicles.push( newVehicle._id)
        author?.save()

        res.json({ id: newVehicle.id, pwd: pwd_gen }).send()
    } else if (role === 'driver') {
        author = await driver.findOne({id: req.jwt.id})
        let newVehicle =  await vehicle.create({pwd: 'temporary', id: uuid(), 
            activated: false, drivers: [ author?._id ], owners: [ author?._id] } )
        author?.vehicles.push( newVehicle?._id)
  
        res.json({ id: newVehicle.id, pwd: pwd_gen }).send()
    }
}
