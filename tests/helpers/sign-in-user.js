import config from 'travis/config/environment';

export default function signInUser(user) {
  const { validAuthToken: token }  = config;

  user.attrs.token = token;
  user.save();

  const localStorageUser = JSON.parse(JSON.stringify(user.attrs));

  localStorageUser.token = token;

  window.localStorage.setItem('token', token);
  window.localStorage.setItem('user', JSON.stringify(localStorageUser));
}
