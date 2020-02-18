import axios from 'axios';
import { navigateTo } from 'svelte-router-spa';

import { deleteTokens, getTokens, storeTokens } from './tokens';
import { store } from '../store';

/**
 * Refresh the tokens
 * @returns {Promise<void>}
 */
export default async () => {
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
    return storeTokens({ accessToken: access, refreshToken: refresh });
  } catch (error) {
    deleteTokens();
    store.setLoggedIn(false);
    return navigateTo('/login');
  }
};
