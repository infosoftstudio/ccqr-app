import Login from './components/Login'
import Dashboard from './components/establishments/Dashboard'
import Home from './components/Home'
import ScannedHDF from './components/establishments/scan/ScannedHDF'
import PersonalSettings from './components/establishments/PersonalSettings/index'
import ChangePassword from './components/establishments/PersonalSettings/ChangePassword'
import ScannedPerson from './components/establishments/scan/ScannedPerson'
import ScannedRtpcr from './components/establishments/scan/ScannedRtpcr'

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
