import { environment } from '../environments/environment';

const TOKEN_KEY = environment.token_key;
const REFRESHTOKEN_KEY = environment.refreshtoken_key;

export class TokenStorageService {
  public API = `${environment.baseUrl}`;

  constructor() { }
  signOut(): void {
    window.localStorage.clear();
  }
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESHTOKEN_KEY);
    window.localStorage.setItem(REFRESHTOKEN_KEY, token);
  }
  public getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESHTOKEN_KEY);
  }
}
