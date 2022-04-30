import Cookies from 'js-cookie';
import axios from 'axios';

class AuthService {
  setCurrentUser(data) {
    let user = {
        _id: data._id,
        username: data.username,
        email: data.email,
        isAdmin: data.isAdmin
    }

    Cookies.set('user', JSON.stringify(user), { path: '' });
  }

  async logout() {
    Cookies.remove('user');

    console.log('logged out');

    try {
      await axios.get('/users/logout');
    }catch (e) {
      console.log(e);
    }
  }

  async checkAuth() {

    const {data} = await axios.get('/users/checkAuth').catch((error) => {
      
      if(error.response) {
        console.log(error.response.status);
        this.logout();
      }
      return false;
    });

    if(data.status == '200') {
      console.log('Authenticated');
      return true;
    }
  }

  getCurrentUser() {
    if(Cookies.get('user')) {
        return JSON.parse(Cookies.get('user'));
    }
    else{
        return null;
    }
  }
}

export default new AuthService();