import  WebSocket, { WebSocketServer } from "ws";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { manager, vehicle } from "./schemas.ts";
import { subscribe } from "diagnostics_channel";

let rooms = [];

class Subscriber {
    id = ''
    role = ''

    constructor(id, role) {
        this.id = id
        this.role = role
    }
}


let wscons = []; // connections array
let wsSubscribers  = new Map(); // general subscribers pool 
let wsRooms = new Map();


function initManagersSubscriptions( id ) {

    let mngr =  manager.findOne({ id: id })
    mngr.vehicles.forEach( e => { 
        if (wsRooms.has(e)) {
        wsRooms.get(e).subscribers.push(mngr.id)
    } else {
        wsRooms.set( e,  {subscribers: mngr.id  }  )
    }

     }
    ) 

}



export function startSignalingServ() {

    

    const wss: WebSocketServer = new WebSocketServer({ port: process.env.WSPORT })
    wss.on('connection', (s, req) => { 
        const accessTkn = req.headers.cookie?.split('access_tkn=')[1].split('; ')[0]

        let decTkn;
        try {
            decTkn = jwt.verify( accessTkn, process.env.SCRT)
            } catch(e) { 

                console.log('access_token invalid')
            } 

        console.log(wscons.size)

        switch (decTkn.role) {
            case 'vehicle':
                wsRooms.set(decTkn.id, { vID: decTkn.id }) //room creation
            case 'manager':
                     initManagersSubscriptions(decTkn.id)
            case 'supervisor':
                    
                // get all binded vehicles
        } 
        
        // console.log('ws req', decodedTkn)
        
    
        } )
        


    



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