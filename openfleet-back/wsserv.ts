
import  WebSocket, { WebSocketServer } from "ws";

import jwt from "jsonwebtoken"
import { manager, vehicle } from "./schemas.ts";
let wsRooms = new Map();
let wsActiveSockets = new Map();
let telemetry = new Map();

 async function subscribe( id ) {
    let mng:any = await manager.findOne({ id: id }).select('vehicles').populate('vehicles', 'id -_id')
    if (mng.vehicles.length > 0) {
        mng.vehicles?.forEach( e => { 
            if (wsRooms.has(e.id)) {
                wsRooms.get(e.id)?.includes(id) ? null : wsRooms.get(e.id).push(id) 
        } else {
             wsRooms.set( e.id,   [id]   )
        }
         }
        )      
    }

    return () => {
        console.log('Unsubscribed')
        mng.vehicles?.forEach( e => { 
            if (wsRooms.has(e.id)) {
                let filtered = wsRooms.get(e.id).filter( e => { e !== id } )
                wsRooms.get(e.id)?.includes(id) ?  wsRooms.set( e.id, filtered ) : null }
         })
    }
}

export function startSignalingServ(srv) {

    const wss: WebSocketServer = new WebSocketServer({ noServer: true })
    console.log('Sign serv started')

    srv.on('upgrade', (req, socket, head) => {
        console.log('upgrade req', req.url)
        if (req.url === '/io') {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
          });
        } 

          if (req.url === '/') {
                console.log('Update on', req.url)
                socket.destroy()
          } 
      });

    
    wss.on('connection', async (socket, req) => { 
    //         //if that an vehicle - 1) find vID in wsRooms 2) Get of wsRooms vID all subscribers 3) search all subscribers in wsActiveSockets 4) get sockets of those connections 5) call .send on each obtained socket
    //         // console.log('WS headers',  req.headers.cookie?.split(`${req.headers['sec-websocket-protocol']}_access_tkn=`)[1].split('; ')[0])
        try{
            const accessTkn: any = req.headers.cookie?.split(`${req.headers['sec-websocket-protocol']}_access_tkn=`)[1].split('; ')[0]
            console.log('WS headers',req.url,  accessTkn )

            if (accessTkn?.length > 0 ) {
                const user: any = jwt.verify( accessTkn, process.env.SCRT as string)
                switch (user.role) {
                    case 'vhc':
                        socket.onmessage = async ( e: any ) => {
                            console.log('vhc msg', e.data)
                            console.log(wsActiveSockets.keys())
                            let json = JSON.parse(e.data)
                            json.vhcID = user.id;
                            if (json.type === 'telemetry') {
                                console.log('telemetry trig', json.data)
                                telemetry.set(user.id, json.data)
                            }

                            if (json.type === 'sdp_offer' ) {
                                console.log('sdp_offer', json.data)
                            }

                            if (json.type === 'sdp_answer' ) {

                            }
                        // Seand to all vehicle subscribers
                            wsRooms.get(user.id)?.forEach( 
                                (s) => wsActiveSockets.get(s)?.forEach( 
                                    x => { 
                                            x.send(JSON.stringify(json))
                                    } )
                            )
                        }
                        socket.on('error', () => {console.log('WS kek discon')})
                        socket.onclose = async (e) => {
                            wsRooms.get(user.id)?.forEach( 
                                (s) => wsActiveSockets.get(s)?.forEach( 
                                    x => {
                                        let json: any = {type: "status", status: 0 }
                                        json.vhcID = user.id
                                        x.send(JSON.stringify(json))
                                    } )
                            )
                            const vhc: any =  await vehicle.findOne( { $and: [{ id: user.id }, { id: { $exists: true}} ]} )
                            let vhc_tel = telemetry.get(user.id)
                            console.log('last cords', vhc_tel)
                            vhc.lat = vhc_tel.lat 
                            vhc.lng = vhc_tel.lng
                            vhc.save()
            
                            wsActiveSockets.delete(user.id)
                            
                        }
                        wsActiveSockets.has(user.id) ? wsActiveSockets.get(user.id).push(socket) : 
                            wsActiveSockets.set(user.id, [socket])
                        wsRooms.has(user.id) ?  wsRooms.get(user.id).forEach( e => wsActiveSockets.get(e).forEach( 
                            k => k.send(JSON.stringify({ type: "status", vhcID: user.id,  status: 1 })) ) ) : wsRooms.set(user.id, [])
                        telemetry.has(user.id) ? null : telemetry.set(user.id, { lat: 0, lng: 0, speed: 0, direction: 0 })
                        
                        console.log('Rooms: ', wsRooms)
                        break;
                    case 'mng':
                        let mng_unsub = await subscribe(user.id)
                        socket.onmessage = async ( msg: any ) => {
                            console.log('msg ', msg.data.type )

                            if (msg.data.type === 'broadcast') {
                                const allVhc =  await manager.findOne({ id: user.id }).select('vehicles').populate('vehicles', 'id');
                                // console.log('active sockets: ', wsActiveSockets)
                                allVhc?.vehicles.forEach( e => wsActiveSockets.get(e.id)?.forEach( x => x.send(msg.data.text)) )
                            } else if (msg.data.type === 'direct') {
    
                                wsActiveSockets.get(msg.data.id).forEach( e => e.send ( JSON.stringify({ sender: user.id , content: msg.data.text })  ) )
                            }
                    //   
                        }
                        socket.onclose = async () => {
                            wsActiveSockets.delete(user.id)
                            console.log(wsActiveSockets.keys())
                            mng_unsub()
                        }

                        console.log('mngr id ',user.id, user.role)
                        const newConnection = {role: user.role, socket: socket}
                        wsActiveSockets.has(user.id) ? wsActiveSockets.get(user.id).push( socket) : 
                            wsActiveSockets.set(user.id, [socket])
                        
                        break;
                    case 'drv':
                        console.log('drv')
                        break;
    
    //                     // get all binded vehicles
                } 
            
            } else {
                // socket.close()
            }
        } catch {

        }
        
        // console.log('ws req', decodedTkn)
    
        }
     )
}
