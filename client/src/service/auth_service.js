//import Cookies from 'js-cookie';
import axios from 'axios';

class AuthService {
  setCurrentUser(data) {
    let user = {
        _id: data._id,
        username: data.username,
        email: data.email,
        isAdmin: data.isAdmin
    }

    localStorage.setItem("user", JSON.stringify(user));
  }

  async logout() {
    localStorage.removeItem("user");

    try {
      await axios.get('/users/logout');
    }catch (e) {
      console.log(e);
    }
  }

  async checkAuth() {

    try{
      const {data} = await axios.get('/users/checkAuth');

      if(data && data.status == '200') {
        console.log('Authenticated');
        return true;
      }
    } catch(error) {

      if(error.response){
        console.log(error.response.status);
        this.logout();
      }
    }

    
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();