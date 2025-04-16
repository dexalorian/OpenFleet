
import express from "express";
import 'dotenv/config';
import multer from "multer";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const fileparser  =  multer({ dest:  'uploads/' })
import { v4 as uuid, validate } from "uuid"

import { manager, vehicle, driver } from "./schemas.js";
import { regVehicle, newVehicle } from "./services.js";  
import { AccessToken } from "livekit-server-sdk";
import { runInNewContext } from "vm";

const api = express.Router({ mergeParams: true })



export default api

// api.use(express.json());

// api.use( (req, res, next) => {
//     console.log('ccokies', req.cookies)
//     if (req.cookies?.logout?.length > 0) {
//         console.log('logout triggered')
//         const roles = req.cookies?.logout.split(',')

//         roles?.forEach( (e) => {
//             if (e.trim() === role) {
//                 res.cookie( role+'_access_tkn', null, {
//                     secure: false,
//                     httpOnly: true,
//                     maxAge: 0
//                 }  )
//             }
//         } )

//         res.cookie( 'logout', null )
//     }
//     next()
// } )
  
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

    if (req.cookies?.logout?.length > 0) {
        console.log('logout triggered')
        const roles = req.cookies?.logout.split(',')

        roles?.forEach( (e) => {
            if (e.trim() === role) {
                res.cookie( role+'_access_tkn', null, {
                    secure: false,
                    httpOnly: true,
                    maxAge: 0
                }  )
            }
        } )
        res.cookie( 'logout', null, {
            maxAge: -1 // Set cookie expiration to match JWT expiration
          }).send()
          return
    }

    

    if (req.cookies[role+'_access_tkn']?.length > 0) {
 
        req.jwt = await jwt.verify(req.cookies[role+'_access_tkn'], process.env.SCRT )

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


async function unbindVehicle(req, res) {
    try {
        console.log("Unbind vhc", req.body.vhcID)
        const mngr = await manager.findOne({id: req.jwt.id})
        const vhcl = await vehicle.findOne({ id: req.body.vhcID })
        const vhcIdx =  mngr.vehicles.findIndex( e => e.id = req.body.vhcID );
        mngr?.vehicles.splice( vhcIdx,  1)
        const mngIdx =  vhcl?.managers.findIndex( e => e.id === req.jwt.id)
        vhcl?.managers.splice(mngIdx, 1)
        

        mngr.save()
        vhcl.save()
        res.status(200).json({error: ''})

    } catch (err) {
        res.status(404).json({error: 'Vehicle not unbinded'})
        console.log('Vehicle not unbinded', err);
        
    }
}



api.post('/vehicle/bindmanager', async (req, res) => {

    try {
        const vhcl = await vehicle.findOne({ id: req.jwt.id })
        console.log("mngrID", req.body.mngID)
        const mngr = await manager.findOne({ id: req.body.mngID })
        vhcl.managers.push( {manager: mngr._id, active: false} )
        mngr.vehicles.push( vhcl._id )
        mngr.save()
        vhcl.save()
        res.status(200).json({error: ''})

    } catch (err) {

        res.status(404).json({error: 'Manager not found'})
        console.log('Manager not found', err);
    }

})

api.get('/vehicle/mediatoken', async (req, res) => {
    try {       
            const tkn = new AccessToken( 'kekcheburek', 'kekcheburek_kekcheburek_kekcheburek', { identity: req.jwt.id } )
            tkn.addGrant( { canSubscribe: false, canPublish: true, roomJoin: true, room: 'general_room', roomCreate: true })
            tkn.toJwt().then( e => console.log('tkn', e))
       
       res.status(200).json({ token: await tkn.toJwt() }).send()
        
    } catch (e) {
        res.status(503)
        console.error(e)
    }


})

api.get('/manager/mediatoken',  async (req, res) => {

    // const mng =  await manager.findOne({ id: req?.jwt.id }).populate({ path: 'vehicles', select: 'id login lat lng -_id' }).select('vehicles -_id')
    // res.status(200).json( mng.vehicles ).send()
    try {
            let tkn = new AccessToken( 'kekcheburek', 
                'kekcheburek_kekcheburek_kekcheburek', { identity: req.jwt.id } )
            tkn.addGrant({canSubscribe: true, canPublish: false, roomJoin: true, roomCreate: true, room: 'general_room'})
                tkn.toJwt().then( e => console.log('tkn', e));
        res.status(200).json({ token: await tkn.toJwt() });

    } catch (e) {
        res.status(503)
        console.error(e)
    }
})


api.post( '/manager/bindvehicle', bindVehicle )
api.post( '/manager/unbindvehicle', unbindVehicle )
api.post('/vehicle/signup', regVehicle )
api.post('/manager/newvehicle', newVehicle )

api.post('/manager/signup', async (req ,res) => {
    
    try {
        let hashed =  await bcrypt.hash( req.body.pwd , 8);
        let newManager =  await manager.create( { ... req.body, pwd: hashed, id: uuid(), 
            activated: false  } );
        res.status(200).send('Account created');

    } catch (e) {
        res.status(400).send('Something went wronf during account creation')
    }
})




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
    const mng =  await manager.findOne({ id: req?.jwt.id }).populate({ path: 'vehicles', select: 'id login lat lng -_id' }).select('vehicles -_id')
    res.status(200).json( mng.vehicles ).send()
} )


api.post('/driver/signup', (req ,res) => {})
api.post('/driver/login', (req, res) => {} )

api.post('/vehicle/login', async (req, res) => { 
    console.log('login ', req.body.login )
    try { 
        const vehicleObj =  await vehicle.findOne({
            $and: [{login: req.body.login}, {login: { $exists: true }}]
          })

        if  (await bcrypt.compare( req.body.pwd, vehicleObj.pwd )) {
           
            const jwt_enc = jwt.sign({id: vehicleObj.id, role: 'vhc'}, process.env.SCRT)

            res.cookie( 'vhc_access_tkn', jwt_enc, {
                secure: false, // Make sure you're using HTTPS in production
                httpOnly: true,
                // sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration to match JWT expiration
              } )
            //  res.json( { id: vehicleObj.id, role: 'vhc' } ).status(200)
             res.json({valid: true, vehicle: {id: vehicleObj?.id, role: 'vhc'}}).status(200).send()
    
        } else {
            res.status(401).send()
        } 
    
} catch {
        e => console.log(e);
        res.status(401).send()
    }
 } )

 api.post('/manager/login', async (req, res) => { 
    console.log('login ', req.body.login )
    try { 
        const managerObj =  await manager.findOne({
            $and: [{login: req.body.login}, {login: { $exists: true }}]
          })

        if  (await bcrypt.compare( req.body.pwd, vehicleObj.pwd )) {
           
            const jwt_enc = jwt.sign({id: managerObj.id, role: 'mng'}, process.env.SCRT)

            res.cookie( 'mng_access_tkn', jwt_enc, {
                secure: false, // Make sure you're using HTTPS in production
                httpOnly: true,
                // sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration to match JWT expiration
              } )
            //  res.json( { id: vehicleObj.id, role: 'vhc' } ).status(200)
             res.json({valid: true, manager: {id: managerObj?.id, role: 'mng'}}).status(200).send()
    
        } else {
            res.status(401).send()
        } 
    
} catch {
        e => console.log(e);
        res.status(401).send()
    }
 } )

//  api.post('/manager/login', async (req, res) => { 
//     console.log('login triggered', req.body.login)
//     try {
//         let managerObj =  await manager.findOne({login: req.body.login})
//         console.log('manager found', managerObj.id)
//     if  (await bcrypt.compare( req.body.login, managerObj.login )) {
//         let jwt_enc = jwt.sign({id: managerObj.id, role: 'mng'}, process.env.SCRT)
//         res.cookie( 'mng_access_tkn', jwt_enc, {
//             secure: false, // Make sure you're using HTTPS in production
//             httpOnly: true,
//             // sameSite: 'none',
//             maxAge: 30 * 24 * 60 * 60 * 1000 // Set cookie expiration to match JWT expiration
//           } )
//          res.json( { id: managerObj.id, role: 'mng'} ).status(200).send()
//     }

//     } catch { 
//         console.log('login error')
//         res.status(401).send() }} )



 api.get('/vehicle/logout', async (req, res) => {

    res.cookie( 'vhc_access_tkn', null, {
        secure: false,
        httpOnly: true,
        maxAge: 0
    }  )
    res.status(200).send('Logged out')
})


api.post('/vehicle/auth', async (req, res) => {

     let user = req.cookies.vhc_access_tkn ? jwt.verify(req.cookies?.vhc_access_tkn, process.env.SCRT) : null

    if (user?.id) {
        res.status(200).json({valid: true, vehicle: {id: user.id, role: 'vhc'}})
    } else { res.json({valid: false }) } })
    

api.get('/vehicle/managers', async (req, res) => {
    const vhc = await vehicle.findOne({id: req.jwt.id}).populate({path: "managers.manager"})
    const mngrs = await vhc?.managers
    console.log('managers', mngrs)
    res.status(200).json({ mngrs} )
})

api.get('/vehicle/owners', async (req, res) => {
    const vhcID = req.jwt.id;
    const owns = vehicle.findOne({id: req.jwt.id}).then( (e) => e.owners );
    res.status(200).json( { owns } )
})

api.get('/vehicle/getgeo', async (req, res) => {
       const veh =  await vehicle.findOne( { $and: [{ id: req.jwt.id }, { lat: { $exists: true}  } ] } )
            res.status(200).json({ lat: veh?.lat, lng: veh?.lng })
            console.log('coords ', veh?.lat, veh?.lng)

      } ) 

api.post('/vehicle/setgeo', async (req, res) => {
    console.log('Before close set geo')
        const veh = await vehicle.findOne( { id: req.jwt.id } )
        veh.lat = req.body.lat;
        veh.lng = req.body.lng;
        veh.save();
        res.status(200).send()

     } )       




