import Login from './components/Login'
import Dashboard from './components/stablishments/Dashboard'
import Home from './components/Home'
import ScannedHDF from './components/stablishments/scan/ScannedHDF'
import ScannedPerson from './components/stablishments/scan/ScannedPerson'
import ScannedRtpcr from './components/stablishments/scan/ScannedRtpcr'

export const routes = {
  '/login': {
    component: Login,
  },
  '/dashboard': {
    component: Dashboard,
  },
  '/home': {
    component: Home,
  },
  '/scannedHDF': {
    component: ScannedHDF,
  },
  '/scannedPerson': {
    component: ScannedPerson,
  },
  '/scannedRtpcr': {
    component: ScannedRtpcr,
  },
}