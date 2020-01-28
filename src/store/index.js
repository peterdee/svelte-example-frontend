import { writable } from 'svelte/store';

// create initial state
const initialState = {
  auth: {
    loggedIn: false,
    role: 'user',
  },
};

/**
 * Create application store
 * @returns {object}
 */
function createStore() {
  const { subscribe, update } = writable(initialState);

  // return exposed methods
  return {
    /**
     * Set user auth status
     * @param loggedIn {boolean} - user auth status
     * @returns {object} - new store state object
     */
    setLoggedIn: (loggedIn = false) => update((state) => ({
      ...state,
      auth: {
        ...state.auth,
        loggedIn,
      },
    })),
    /**
     * Set user role
     * @param role {string} - user role
     * @returns {object} - new store state object
     */
    setRole: (role = '') => update((state) => ({
      ...state,
      auth: {
        ...state.auth,
        role,
      },
    })),
    subscribe,
  };
}

export const store = createStore();
