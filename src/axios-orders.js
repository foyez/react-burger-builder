import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-693b2.firebaseio.com/'
});

export default instance;