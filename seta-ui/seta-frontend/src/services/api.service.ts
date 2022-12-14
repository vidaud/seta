import axios from 'axios';
import { environment } from '../environments/environment';

const authService = axios.create({
  baseURL: environment.baseUrl,
  withCredentials: true,
  xsrfCookieName: 'csrf_access_token'
});
export { authService };