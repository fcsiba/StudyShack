
import { AsyncStorage } from 'react-native';
import { networkUtils } from '../utils';

class AppStateManager {

  static shared = new AppStateManager();

  user = {
    id: '11',
    access_token: '',
    email: '',
    fcm_token: '',
    image: 'https://i.pinimg.com/originals/00/f3/ba/00f3baed741806ab1cc74e094b30824b.jpg',
    latlong: '',
    name: 'Sample User',
    phone: '',
    username: '',
  };

  setUser(user){
    this.user.id = user.id;
    this.user.access_token = user.access_token || '';
    this.user.country = user.country || '';
    this.user.email = user.email || '';
    this.user.fcm_token = user.fcm_token || '';
    this.user.image = user.image;
    this.user.latlong = user.latlong || '';
    this.user.name = user.name || '';
    this.user.phone = user.phone || '';
    this.user.username = user.username || '';
  }

}
let appStateManager = AppStateManager.shared;
export  { appStateManager }
