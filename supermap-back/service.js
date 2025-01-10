

import fs from "fs"
import { v4 as uuid } from "uuid"
import path from "path"
import { fileURLToPath } from "url";
import { dbPhoto } from "./schemas.js";

let __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createNewPhoto(req, res) {
    console.log(req.body)
    console.log( 'Writing to db' )
    const newfilename = uuid() +  path.extname(req.file.originalname)
    fs.renameSync(__dirname + '/uploads/' +req.file.filename, 
        __dirname + '/uploads/'  + newfilename  ); 

        console.log( JSON.parse(req.body.params)  )
        const { lat, lng } = JSON.parse(req.body.coords)
        dbPhoto.create({id: uuid(), lat, lng , filename: newfilename, ... JSON.parse(req.body.params)})
        
   res.status(200).send()
}


export async function getAllPhotos(req, res) {
    dbPhoto.find().then(e => res.json(e))
    // res.json( await dbPhoto.find())
}