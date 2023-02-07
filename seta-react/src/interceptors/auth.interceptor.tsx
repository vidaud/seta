import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
// import { environment } from "../environments/environment";
// import authentificationService from "../services/authentification.service";
// import restService from "../services/rest.service";

// interface RefreshToken {
//     status: number;
//     data: {
//         hashToken: string;
//     };
// }

// export abstract class HTTPBaseService {
//     protected instance: AxiosInstance;
//     protected token: string;
//     protected readonly baseURL: string;
//     protected endpoint = `corpus`;
//     public API = `${environment.api_target_path}${this.endpoint}`
//     public regexService: RegExp = environment._regex;

//     public constructor(baseURL: string, token: string) {
//         this.baseURL = this.API;
//         this.instance = axios.create({
//             baseURL,
//         });
//         this.token = token;

//         this.initializeRequestInterceptor();
//         this.initializeResponseInterceptor();
//     }

//     private initializeRequestInterceptor = () => {
//         this.instance.interceptors.request.use(this.handleRequest);
//     };

//     private initializeResponseInterceptor = () => {
//         this.instance.interceptors.response.use(response => {
//             if (response.headers && response.headers.authorization) {
//                 const responseToken = (response.headers.authorization as string).split(' ')[1];
//                 this.token = responseToken;

//                 localStorage.setItem('hashToken', this.token);
//             }
//             return response;
//         }, this.handleError);
//     }

//     private handleRequest = (config: AxiosRequestConfig | any) => {
//         config.headers['Authorization'] = `Bearer ${this.token}`;
//         return config;
//     };

//     private handleError = async (error: AxiosError) => {
//         const originalRequest: any = error.config;
//         if (error.response?.status === 401) {
//             const refreshToken = await this.refreshToken();
//             if (refreshToken.status === 200) {
//                 this.token = refreshToken.data.hashToken;
//                 localStorage.setItem('hashToken', this.token);
//                 return this.instance(originalRequest);
//             }
//         }
//     }

//     private async refreshToken(): Promise<RefreshToken> {
//         const csrf_token = restService.getCookie('csrf_refresh_token');
//         return axios.get(this.API + '/refresh', {headers:{"X-CSRF-TOKEN": csrf_token}})
//         .then((response: any) => {
//         console.log(response);
//         //window.document.location.reload();
//         return response;
//         })
//         .catch((error) => {
//         if (error.response) {
//             console.log(error.response);
//             if(error.response.status === 401){
//             //redirect to logout
//             authentificationService.setaLocalLogout();
//             }
//         }
//         }) as any;
//     }
// }