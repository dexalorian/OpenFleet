import VehicleIndex from './VehicleApp/Index.vue';
import AppHeader from './components/AppHeader.vue';
import DriverPage from './DriverApp/Index.vue';
import SignUp from './VehicleApp/SignUp.vue';
import Login from './VehicleApp/Login.vue';
import Trade from './TradePage.vue';
import VehicleMain from './VehicleApp/Main.vue';
import VehicleEnter from './VehicleApp/Enter.vue';
import ManagerPage from './ManagerApp/ManagerPage.vue';
import ManagerMain from './ManagerApp/ManagerMain.vue';
import ManagerEnter from './ManagerApp/ManagerEnter.vue';
export const routes = [
    {
        path: '/manager',
        name: 'ManagerPage',
        component: ManagerPage,
        children: [
            { path: 'enter',
                name: 'manager-enter',
                component: ManagerEnter
            },
            { path: 'main',
                name: 'manager-main',
                component: ManagerMain
            }
        ]
    },
    {
        path: '/vehicleapp',
        name: 'VehicleApp',
        components: {
            default: VehicleIndex,
        },
        children: [
            {
                path: 'enter',
                name: 'vehicle-enter',
                component: VehicleEnter
            },
        ]
    },
    {
        path: '/driverapp',
        name: 'DriverApp',
        components: {
            default: DriverPage
        }
    },
    {
        path: '/trade',
        name: '',
        component: Trade
    }
];
