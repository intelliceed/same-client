// outsource dependencies
import { AxiosError, type AxiosResponse } from 'axios';

// constants
import config from '@/constants/config.ts';

export const API_PATH = String(config('API_URL', '/api'));

export const API_NAMES = {
  AUTH_BEARER: 'Bearer ',
  AUTH_HEADER: 'Authorization',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

/**
 * prepare results. Solution to prepare success data
 *
 * @param {Object} response
 * @return {Object}
 */

export const prepareResponse = (response:AxiosResponse) => response.data;

/**
 * prepare error
 *
 * @param {Object} error
 * @return {Promise}
 */

export const prepareError = (error: AxiosError<{message: string, errorCode?: string}>): Promise<object> => {
  if (import.meta.env.DEBUG) {
    // debugErrors.unshift(error);
    console.warn('%c Interceptor: ', 'background: #EC1B24; color: #fff; font-size: 14px;', error);
  }
  return Promise.reject({
    ...(error?.response?.data || {}),
    errorCode: error?.response?.data?.errorCode,
    message: (error?.response?.data?.message || MESSAGE.default),
  });
};

const MESSAGE = {
  default: 'Something went wrong ...'
};
