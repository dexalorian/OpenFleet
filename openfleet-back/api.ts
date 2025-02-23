
import express from "express";
import 'dotenv/config';
import multer from "multer";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const fileparser  =  multer({ dest:  'uploads/' })
import { v4 as uuid, validate } from "uuid"

import { manager, vehicle, driver } from "./schemas.ts";

import { regVehicle, newVehicle } from "./services.ts";  

const api = express.Router({ mergeParams: true })

export default api
  
api.use( ['/manager', '/vehicle', '/driver'], async (req, res, next) => {

    let role = (() => {
 
        switch (  req.baseUrl.split('/').at(-1)) {
               
            case 'manager': 
            return 'mng'
            case 'vehicle': 
            return 'vhc'
            case 'driver':
                return 'drv'
        }
    })()

    if (req.cookies[role+'_access_tkn']?.length > 0) {
 
        req.jwt = await jwt.verify(req.cookies[role+'_access_tkn'], process.env.SCRT)

        if (req.jwt.id.length > 0) {
            next()
        } else { res.status(401).send() }

        
       
    } else if (req.url === '/login' || req.url === '/auth' || req.url === '/signup' ) {
        next()
    } else {
        console.log('debug', req.baseUrl.split('/').at(-1))
        res.status(401).send()
    }
        }

       )

async function bindVehicle(req, res) {
    try {
        console.log( req.body.vhcID )
        const mngr = await manager.findOne({id: req.jwt.id})
        const vhcl = await vehicle.findOne({ id: req.body.vhcID })
        vhcl.managers.push( {manager: mngr._id, active: false} )
        mngr.vehicles.push( vhcl._id )
        mngr.save()
        vhcl.save()
        res.status(200).json({error: ''})

    } catch (err) {
        res.status(404).json({error: 'Vehicle not found'})
        console.log('Vehicle not found', err);
        
    }
}

api.post( '/manager/bindvehicle', bindVehicle )

api.post('/vehicle/signup', regVehicle )
// api.post('/vehicle/auth', async (req, res) => {

// })

api.post('/manager/newvehicle', newVehicle )


api.post('/manager/signup', async (req ,res) => {

    let hashed =  await bcrypt.hash( req.body.pwd , 8)
    let newManager =  await manager.create( { ... req.body, pwd: hashed, id: uuid(), 
        activated: false  } )

})


api.post('/manager/login', async (req, res) => { 
    console.log('login triggered', req.body.login)
    try {
        let managerObj =  await manager.findOne({login: req.body.login})
    if  (bcrypt.compare( req.body.login, managerObj.login )) {
        let jwt_enc = jwt.sign({id: managerObj.id, role: 'mng'}, process.env.SCRT)
        managerObj.save()
        res.cookie( 'mng_access_tkn', jwt_enc, {
            secure: true, // Make sure you're using HTTPS in production
            httpOnly: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration to match JWT expiration
          } )
         res.json( { id: managerObj.id, role: 'mng'} ).status(200)
    }

    } catch { 
        console.log('login error')
        res.status(401).send() }} )


api.post('/manager/auth', async (req, res) => {
        try {
            let user = req.cookies.mng_access_tkn ? jwt.verify(req.cookies?.mng_access_tkn, process.env.SCRT) : null
            if (user?.id) {
                const managerdb = await manager.findOne( {id: user.id})
                res.json({valid: true, manager: {id: managerdb.id, role: 'mng'}}).status(200).send()
            } else { res.json({valid: false }).status(401).send() }
        } catch (e) {
            console.log(e)
            res.json({valid: false}).status(401).send()
        }
        })


api.get('/manager/logout', async (req, res) => {

    res.cookie( 'mng_access_tkn', null, {
        secure: false,
        httpOnly: true,
        maxAge: 0
    }  )
    res.status(200).send('Logged out')
})


api.post( '/manager/vehicles', async (req, res) => {
    console.log('vhl fetch trigg');
    
    const mng =  await manager.findOne({ id: req?.jwt.id }).populate({path: "vehicles", select: ["id", "login"]}).exec()

    res.json( {vehicles: mng?.vehicles} ).status(200).send()
    // manager.findOne( {  } )
} )


api.post('/driver/signup', (req ,res) => {})
api.post('/driver/login', (req, res) => {} )

api.post('/vehicle/login', async (req, res) => { 
  console.log('login triggered' )
  let jwt_enc = jwt.sign({id: vehicleObj.id, role: 'vhc'}, process.env.SCRT)
    try { 
        let vehicleObj =  await vehicle.findOne({login: req.body.login}) 
        if  (bcrypt.compare( req.body.login, vehicleObj.login )) {
            jwt_enc = jwt.sign({id: vehicleObj.id, role: 'vhc'}, process.env.SCRT)
            vehicleObj.save()
            res.cookie( 'vhc_access_tkn', jwt_enc, {
                secure: true, // Make sure you're using HTTPS in production
                httpOnly: true,
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration to match JWT expiration
              } )
             res.json( { id: vehicleObj.id, role: 'vhc' } ).status(200)
    
        } else {
            res.status(401).send()
        } 
    
} catch {
        e => console.log(e);
        res.status(401).send()
        
    }

 } )

api.post('/vehicle/auth', async (req, res) => {
    console.log('auth')
     let user = req.cookies.vhc_access_tkn ? jwt.verify(req.cookies?.vhc_access_tkn, process.env.SCRT) : null

    if (user?.id) {
        res.status(200).json({valid: true, vehicle: {id: user.id, role: 'vhc'}})
    } else { res.json({valid: false }) } })
    

api.get('/vehicle/managers', async (req, res) => {
    const vhc = await vehicle.findOne({id: req.jwt.id});
 
    const mngrs = await vhc?.managers
    res.status(200).json( { mngrs} )
})

api.get('/vehicle/owners', async (req, res) => {
    const vhcID = req.jwt.id;
    const mngrs = vehicle.findOne({id: req.jwt.id}).then( e => e.owners );
    res.status(200).json( { owns } )
})


