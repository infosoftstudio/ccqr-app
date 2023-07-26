import ChangePassword from './components/establishments/PersonalSettings/ChangePassword'
import Dashboard from './components/establishments/Dashboard'
import Home from './components/Home'
import Login from './components/Login'
import PersonalSettings from './components/establishments/PersonalSettings/index'
import ScannedHDF from './components/establishments/scan/ScannedHDF'
import ScannedPerson from './components/establishments/scan/ScannedPerson'
import ScannedRtpcr from './components/establishments/scan/ScannedRtpcr'
import Tours from './components/establishments/Tours/index'

export const routes = {
  '/login': {
    component: Login,
  },
  '/dashboard': {
    component: Dashboard,
  },
  '/settings': {
    component: PersonalSettings,
  },
  '/tours': {
    component: Tours,
  },
  '/change-pass': {
    component: ChangePassword,
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
