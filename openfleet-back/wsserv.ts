
import  WebSocket, { WebSocketServer } from "ws";

import jwt from "jsonwebtoken"
import { manager, vehicle } from "./schemas.ts";

let wsRooms = new Map();
let wsActiveSockets = new Map();

 async function subscribe( id ) {

    let mng = await manager.findOne({ id: id }).select('vehicles').populate('vehicles', 'id -_id')
    
    if (mng.vehicles.length > 0) {
        mng.vehicles?.forEach( e => { 
            if (wsRooms.has(e.id)) {
                wsRooms.get(e.id)?.subscribers?.includes(id) ? null : wsRooms.get(e.id).subscribers?.push(id) 

        } else {
             wsRooms.set( e.id,  {subscribers: [id] }  )
        }
         }
        )      
    }
    
}

export function startSignalingServ(srv) {

    const wss: WebSocketServer = new WebSocketServer({noServer: true})

    srv.on("upgrade", (request, socket, head) => {
        console.log("Received upgrade request:", request.url);
        if (request.url === "/io") {
            console.log('trying to connect to /io')
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
          });
        } else {
        //     console.log('ws Socket destroyed');
          socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
          socket.destroy();
        }
      });
    
    wss.on('connection', (socket, req) => { 
            //if that an vehicle - 1) find vID in wsRooms 2) Get of wsRooms vID all subscribers 3) search all subscribers in wsActiveSockets 4) get sockets of those connections 5) call .send on each obtained socket
            console.log('WS headers',  req.headers.cookie)
            // console.log('WS headers',  req.headers.cookie?.split(`${req.headers['sec-websocket-protocol']}_access_tkn=`)[1].split('; ')[0])

                const accessTkn = req.headers.cookie?.split(`${req.headers['sec-websocket-protocol']}_access_tkn=`)[1].split('; ')[0]
        
        if (accessTkn?.length > 0 ) {
            const user = jwt.verify( accessTkn, process.env.SCRT)
            switch (user.role) {
                case 'vhc':
                    socket.onmessage = ( e ) => {
                
                        wsRooms.get(user.id)?.subscribers?.forEach( 
                            (s) => wsActiveSockets.get(s)?.forEach( 
                                x => {
                                    
                                    x.send(e.data)
                                } 
                               
                            )
                        )
                    }
                    wsActiveSockets.has(user.id) ? wsActiveSockets.get(user.id).push(socket) : 
                        wsActiveSockets.set(user.id, [socket])
                    wsRooms.has(user.id) ?  null : wsRooms.set(user.id, [])
                     //vehicle-room creation
                    // console.log('Rooms: ', wsRooms)
                    break;
                case 'mng':
                    socket.onmessage = async ( msg ) => {

                        console.log('msg ', msg )
       
                        let json =  JSON.parse(msg.data)
  
                        if (json.type === 'broadcast') {
                            const allVhc =  await manager.findOne({ id: user.id }).select('vehicles').populate('vehicles', 'id');
                            // console.log('active sockets: ', wsActiveSockets)
                            allVhc?.vehicles.forEach( e => wsActiveSockets.get(e.id)?.forEach( x => x.send('keeek'))  )
                            // allVhc?.vehicles.forEach( e =>  console.log('socket bucket ',  wsActiveSockets.get(e.id)?.at(0).socket.readyState)  )
                        } else if (json.type === 'direct') {

                            wsActiveSockets.get(json.id).forEach( e => e.send ( JSON.stringify({ sender: user.id , content: json.text })  ) )
                        }
                  
                    }
                    console.log('mngr id ',user.id, user.role)
                    const newConnection = {role: user.role, socket: socket}
                    wsActiveSockets.has(user.id) ? wsActiveSockets.get(user.id).push( socket) : 
                        wsActiveSockets.set(user.id, [socket])
                    subscribe(user.id)
                    break;
                case 'super':
                    console.log('drv')
                    break;

                    // get all binded vehicles
            } 
        
        } else {
            socket.close()
        }
        
        // console.log('ws req', decodedTkn)
        
    
        }
     )


}

// wsserv.on('connection', (conn: WebSocket) => {
//     let in_id;
    
//     conn.onmessage = e => { 
        
//         let msg = JSON.parse(e.data)
//         if (msg.type === 'handshake' & msg.type === 'vahicle') {

//         }
//         console.log('mess id: ', msg.id);

//         // console.log('received ws: ', e)
//         wscons.push({ id: msg.id , ws: conn })
//         console.log('all cons: ', wscons.length);
        
//       } ;
//     conn.on("close", e => {console.log("Connection closed");
//         wscons.forEach( e => {console.log(e.id); 
//             if (e.ws.readyState === WebSocket.CLOSED) {
//                 console.log( ' closed: ', e.id )
//             }
//         })

//     })

//     console.log('All ws: ',  wscons)

// })


// connction
//auth check
// message received
// subscribers queue
//role check