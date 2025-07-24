let roleBkp;
let ws: WebSocket;


function StartWS(role: 'mng' | 'vhc' | 'drv'): WebSocket {
    let wsUrl = import.meta.env.VITE_SRV_WS
    
    console.log('WS URLS', wsUrl)
    roleBkp = role
    ws = new WebSocket(wsUrl, [role] )
    
    console.log('ws started', role);
    ws.onclose = (e) => { console.log('trying to reconnect'); setTimeout(() => 
        StartWS( roleBkp ) , 3000 ) }  
    ws.onerror = (e) => console.log('ws error', e)
}

export { StartWS, ws }


