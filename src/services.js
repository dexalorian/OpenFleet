async function fetchBindedVehicles(role) {
    const res = await fetch(import.meta.env.VITE_SRV_URL + `/${role}/vehicles`, { method: 'POST', headers: { "Content-Type": "application/json" }, credentials: 'include' });
    const vehicles = await res.json();
    //  console.log('fetched vehicles ', vehicles)
    return vehicles;
}
async function newVehicle(login) {
    const res = await fetch(import.meta.env.VITE_SRV_URL + '/manager/newvehicle', { method: 'POST', headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login }), credentials: 'include' });
    const vehicle = await res.json();
    return vehicle;
}
async function getVehicle(id) {
    // await fetch( BASE_SRV_URL + '/vehicle' )
}
async function invite2Vehicle() {
    // await fetch('/utils')
}
async function bindManager(mngID) {
    const resp = await fetch(import.meta.env.VITE_SRV_URL + '/vehicle/bindmanager', { method: 'POST', credentials: 'include', body: JSON.stringify({ mngID }),
        headers: { "Content-Type": "application/json" } });
    const mng = await resp.json();
    if (resp.status === 200) {
        console.log('mng binded', mng);
        return mng;
    }
    else {
        console.log('mng bind err', mng);
        return mng;
    }
}
async function bindVehicle(vhcID) {
    const res = await fetch(import.meta.env.VITE_SRV_URL + `/manager/bindvehicle`, { body: JSON.stringify({ vhcID }), method: 'POST',
        headers: { "Content-Type": "application/json" }, credentials: 'include' });
    if (res.status !== 200) {
        const vehicle = await res.json();
        console.log('bind error', vehicle);
        return vehicle;
    }
}
function addOfflineLogout(role) {
    console.log('Offline logout triggered');
    if (document.cookie.split('logout=')[1]?.length > 0) {
        const logoutStr = 'logout=' + document.cookie.split('logout=')[1]?.split(';')[0] + ';';
        const roles = document.cookie.split('logout=')[1]?.split(';')[0].split(',');
        const filteredRoles = roles.map(e => e.trim() === 'role' ? null : e.trim());
        document.cookie = 'logout=' + filteredRoles.toString() + ';';
    }
    else {
        document.cookie = `logout=${role}; path=/; max-age=` + (1000 * 24 * 60 * 60) + ';';
    }
}
export { fetchBindedVehicles, bindVehicle, newVehicle, addOfflineLogout, bindManager };
