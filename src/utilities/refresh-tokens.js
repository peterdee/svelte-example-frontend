import axios from 'axios';
import { navigateTo } from 'svelte-router-spa';

import { deleteTokens, getTokens, storeTokens } from './tokens';
import { store } from '../store';

// matching 'info' fields 
export const matchingInfo = [
  'INVALID_TOKEN',
  'MISSING_TOKEN',
  'TOKEN_EXPIRED',
];

/**
 * Refresh the tokens
 * @returns {Promise<void>}
 */
export const refreshTokens = async () => {
  // check the token
  const { refreshToken = '' } = getTokens();
  if (!refreshToken) {
    deleteTokens();
    store.setLoggedIn(false);
    return navigateTo('/login');
  }

  // send the request
  try {
    const response = await axios({
      data: { refreshToken },
      method: 'POST',
      url: 'https://express-mongo-node.herokuapp.com/api/v1/refresh-tokens',
    });
    const { data: { data: { role = '', tokens: { access = '', refresh = '' } = {} } = {} } = {} } = response;

    // if everything is OK
    store.setLoggedIn(true);
    store.setRole(role);
    storeTokens({ accessToken: access, refreshToken: refresh });
    return navigateTo('/');
  } catch (error) {
    deleteTokens();
    store.setLoggedIn(false);
    return navigateTo('/login');
  }
};
