// local dependencies
import { localAppStorage } from './storage.ts';

class AuthService {
  static AUTH_STORAGE = 'AUTH_STORAGE';

  static signOut () { AuthService.removeToken(); }

  static removeToken () { localAppStorage.remove(AuthService.AUTH_STORAGE); }

  static getToken () { return localAppStorage.get(AuthService.AUTH_STORAGE); }

  static saveToken (data: {accessToken: string, refreshToken:string} | null) {
    return localAppStorage.set(AuthService.AUTH_STORAGE, data);
  }

  static isTokenExist () { return !!AuthService.getToken(); }
}

export default AuthService;
