async function fetchBindedVehicles(role: "manager" | "driver" ) {
    const res = await fetch( import.meta.env.VITE_SRV_URL + `/${role}/vehicles` , { method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include'}) 
    const vehicles = await res.json();
    console.log(vehicles)
    return vehicles.vehicles
 }

 async function newVehicle(login) {
    const res = await fetch( import.meta.env.VITE_SRV_URL + '/manager/newvehicle' , 
        { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({ login: login }),  credentials: 'include'}) 
    const vehicle = await res.json();

    return vehicle
 }

 async function getVehicle(id) {

        // await fetch( BASE_SRV_URL + '/vehicle' )
 }
 
 async function invite2Vehicle() {
    // await fetch('/utils')
 }


 async function bindVehicle(vhcID: String): Object {
    const res = await fetch( import.meta.env.VITE_SRV_URL + `/manager/bindvehicle`, 
        { body: JSON.stringify({ vhcID }), method: 'POST', 
            headers: {"Content-Type": "application/json"},  credentials: 'include'}) 

         if (res.status !== 200) {
            const vehicle = await res.json();
            console.log('bind error', vehicle)
            return vehicle 
         }


         
 }



 export { fetchBindedVehicles, bindVehicle, newVehicle }