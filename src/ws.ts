let roleBkp;
let ws: WebSocket;


function StartWS(role: 'mng' | 'vhc' | 'drv'): WebSocket {

    roleBkp = role
    ws = new WebSocket(import.meta.env.VITE_SRV_WS , [role] )
    
    console.log('ws started', role);
    ws.onmessage = (e) => { console.log('ws income mess: ', e) }
    ws.onclose = (e) => {  console.log('trying to reconnect'); setTimeout(() =>  StartWS( roleBkp ) , 3000 ) }  
}

export { StartWS, ws }


