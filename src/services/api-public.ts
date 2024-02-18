// outsource dependencies
import axios from 'axios';

// services
import { API_PATH, prepareError, prepareResponse } from './api-helpers.ts';

/******************************************************************
 *           PUBLIC  requester instance
 ******************************************************************/
/**
 * axios instance prepared for app
 */
const PUB = axios.create({
  paramsSerializer: {
    indexes: false, // empty brackets like `arrayOfUserIds[]`
  },
  baseURL: API_PATH,
  withCredentials: false,
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }
});

/**
 * setup interceptors
 */
PUB.interceptors.response.use(prepareResponse, prepareError);

// NOTE named export only after all prepare thing
export const instancePUB = PUB;
export default PUB;
