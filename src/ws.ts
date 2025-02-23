let roleBkp;
let ws: WebSocket;


function StartWS(role: 'mng' | 'vhc' | 'drv'): WebSocket {
    let wsUrl =  'wss://'+window.location.origin.split('://')[1] +'/io' 
    console.log('WS URLS', wsUrl)
    roleBkp = role
    ws = new WebSocket(wsUrl, [role] )
    
    console.log('ws started', role);
    ws.onmessage = (e) => { console.log('ws income mess: ', e) }
    ws.onclose = (e) => {  console.log('trying to reconnect'); setTimeout(() =>  StartWS( roleBkp ) , 3000 ) }  
}

export { StartWS, ws }


