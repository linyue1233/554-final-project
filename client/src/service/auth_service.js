import Cookies from 'js-cookie';

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

  logout() {
    Cookies.remove('user');
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