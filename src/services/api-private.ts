// outsource dependencies
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// local dependencies
import PUB from './api-public.ts';
import AuthService from './auth.ts';
import { prepareError, prepareResponse, API_PATH, API_NAMES } from './api-helpers.ts';

type Session = { [key: string]: string | null } & { [key: (typeof API_NAMES)[keyof typeof API_NAMES]]: string | null }

/******************************************************************
 *           STORAGE
 ******************************************************************/
/**
 * update session in storage to provide ability restore session from ("local" || "cookie") storage
 *
 * @param {Object} [session=null]
 */
const updateStoredSession = (session: Session | null) => {
  return (!session ? AuthService.removeToken() : AuthService.saveToken({
    accessToken: session[API_NAMES.ACCESS_TOKEN] || '',
    refreshToken: session[API_NAMES.REFRESH_TOKEN] || ''
  }));
};

export const getAccessToken = () => AuthService.getToken()?.[API_NAMES.ACCESS_TOKEN] || null;

const getRefreshToken = () => AuthService.getToken()?.[API_NAMES.REFRESH_TOKEN] || null;

const getAuthHeader = () => API_NAMES.AUTH_BEARER + getAccessToken();

/******************************************************************
 *           API(PRIVATE) requester instance
 ******************************************************************/
/**
 * axios instance prepared for app with authorization
 * contain logic for working with authorization and 401 interceptor
 */

const API = axios.create({
  paramsSerializer: {
    indexes: false, // empty brackets like `arrayOfUserIds[]`
  },
  baseURL: API_PATH,
  withCredentials: false,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
});

API.interceptors.response.use(
  prepareResponse,
  error => error.request.status === 401 && !/logout/.test(String(error.config.url))
    ? handleRefreshSession(error)
    : prepareError(error)
);

/**
 * local variables to correctness refreshing session process
 */

type StuckRequest = {
  error: AxiosError;
  resolve: (value: unknown) => void;
  config: InternalAxiosRequestConfig | undefined;
  reject: (reason?: { errorCode: string; message: string }) => void;
}

let isRefreshing = false;
let stuckRequests:Array<StuckRequest> = [];

/**
 * store all requests with 401 refresh session and try send request again
 *
 * @param {Object} error
 * @return {Promise}
 */

const handleRefreshSession = async (error:AxiosError) => {
  const config = error.config;
  let configWasTryingToRestore = false;

  const stuckRequest = new Promise((resolve, reject) => {
    stuckRequests.push({ config, error, resolve, reject });
  });

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const response:Session = await PUB({
        method: 'POST',
        url: 'auth/refresh',
        headers: { [API_NAMES.AUTH_HEADER]: getAuthHeader() },
        data: { [API_NAMES.REFRESH_TOKEN]: getRefreshToken() },
      });
      setupSession({ ...response, [API_NAMES.REFRESH_TOKEN]: getRefreshToken() });
      // NOTE resend all
      stuckRequests.map(({ config, resolve, reject }) => {
        if (!config) { return null; }
        // NOTE setup new authentication header in old request config
        config.headers[API_NAMES.AUTH_HEADER] = getAuthHeader();
        API(config).then(resolve).catch(reject);
        // NOTE "array-callback-return"
        return null;
      });
      // NOTE start new stuck
      stuckRequests = [];
      isRefreshing = false;
    } catch (e) {
      // NOTE reject all
      stuckRequests.map(({ error, reject }) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message = ((error?.response?.data?.message) || 'Something went wrong ...');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reject({ errorCode: error?.response?.data?.errorCode, message });
      });
      // NOTE provide ability to handle this situation
      onAuthFailApplicationAction(error);
      // NOTE start new stuck
      stuckRequests = [];
      isRefreshing = false;
    }
  }

  // NOTE determine first trying to restore session
  if (!configWasTryingToRestore) {
    configWasTryingToRestore = true;
    return stuckRequest;
  }
  return prepareError(error as AxiosError<{message: string, errorCode?: string}>);
};

/**
 * provide correct way to restore session
 */

export const restoreSessionFromStore = () => Boolean(AuthService.isTokenExist()
  ? (API.defaults.headers.common[API_NAMES.AUTH_HEADER] = getAuthHeader())
  : (API.defaults.headers.common[API_NAMES.AUTH_HEADER] = false));

/**
 * provide correct way to setup authorization session
 *
 * @param {AxiosResponse<any>} session - null to kill session within instanceAPI
 */
export const setupSession = (session: Session | null) => {
  updateStoredSession(session);
  restoreSessionFromStore();
};
/**
 * "event" to provide correct way to handle authorization fail during requests
 *
 */
export let onAuthFailApplicationAction = (error: AxiosError) => console.warn('authorization is fail. Expected to override this action', error);
export const onAuthFail = (fn: (error: AxiosError) => void) => onAuthFailApplicationAction = fn;
/******************************************************************
 *           format of ERRORS
 ******************************************************************/
/**
 * try to find explanation of error in specification
 *
 * @param {String[]|String} errors
 * @param {String} [defMessage=null]
 */

// NOTE named export only after all prepare thing
export const instanceAPI = API;
export default API;
