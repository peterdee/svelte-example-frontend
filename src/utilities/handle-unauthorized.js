import axios from 'axios';

import { deleteTokens, getTokens, storeTokens } from './tokens';

export default async (error = '') => {
  if (error === 'ACCESS_DENIED' || error === 'MISSING_TOKEN') {
    // log out
    return 'Access denied!';
  }

  if (error === 'TOKEN_EXPIRED' || error === 'INVALID_TOKEN') {
    try {
      const { accessToken = '', refreshToken = '' } = getTokens();
      const response = await axios({
        data: { refreshToken },
        headers: {
          'X-ACCESS-TOKEN': accessToken,
        },
        method: 'POST',
        url: 'https://express-mongo-node.herokuapp.com/api/v1/refresh-tokens',
      });
      const { data: { data: { role = '', tokens: { access = '', refresh = '' } } = {} } = {} } = response;

      // make sure that everything's in place
      if (!(access && refresh && role)) {
        return formError = 'Access denied!';
      }

      // store tokens
      storeTokens({ accessToken: access, refreshToken: refresh });

      // save data in the application store
      store.setLoggedIn(true);
      store.setRole(role);

      // redirect to the index
    } catch (error) {
      
    }
  }
};
