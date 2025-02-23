import Map from './MapPage.vue'
import VehicleIndex  from './VehicleApp/Index.vue'
import AppHeader from './components/AppHeader.vue'
import DriverPage from './DriverApp/Index.vue'
import SignUp from './VehicleApp/SignUp.vue'
import Login from './VehicleApp/Login.vue'
import Trade from './TradePage.vue'
import VehicleMain from './VehicleApp/Main.vue'
import VehicleEnter from './VehicleApp/Enter.vue'
import ManagerPage from './ManagerApp/ManagerPage.vue'
import ManagerMain from './ManagerApp/ManagerMain.vue'
import ManagerEnter from './ManagerApp/ManagerEnter.vue'

export const routes = [
  {
    path: '/manager',
    name: 'ManagerPage',
    component: ManagerPage,
    children: [ 
       {path: 'enter',
        name: 'manager-enter',
        component: ManagerEnter
       },
       {path: 'main',
        name: 'manager-main',
        component: ManagerMain
       }
    ] 
  },
  {
    path: '/',
    name: 'App',
    components: {
      default: Map
      // header: AppHeader
    }
  },
  {
    path: '/login',
    name: 'LoginModal',
    components: {
      default: Map,
      header: AppHeader
    }
  },
  {
    path: '/signup',
    name: 'SignUpModal',
    components: {
      default: Map,
      header: AppHeader
    }
  },
  {
    path: '/logout',
    name: 'LogoutModal',
    components: {
      default: Map,
      header: AppHeader
    }
  },
  {
    path: '/vehicleapp',
    name: 'VehicleApp',
    components: {
      default: VehicleIndex,
    }, 
    children: [{
      path: 'main',
      name: 'vehicle-main',
      component: VehicleMain },
      {
        path: 'enter',
        name: 'vehicle-enter',
        component: VehicleEnter
      }
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
]