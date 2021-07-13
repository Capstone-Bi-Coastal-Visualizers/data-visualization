import axios from "axios";
import history from "../history";

const TOKEN = "token";

/**
 * ACTION TYPES
 */
const SET_AUTH = "SET_AUTH";
const TOGGLE_MODAL = "TOGGLE_MODAL";
const MODAL_CONTENT = "MODAL_CONTENT";

/**
 * ACTION CREATORS
 */
const setAuth = (auth) => ({ type: SET_AUTH, auth });

export const toggleModal = () => ({
  type: TOGGLE_MODAL,
});

export const modalContent = (displayName) => ({
  type: MODAL_CONTENT,
  displayName,
});

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  const token = window.localStorage.getItem(TOKEN);
  if (token) {
    const res = await axios.get("/auth/me", {
      headers: {
        authorization: token,
      },
    });
    return dispatch(setAuth(res.data));
  }
};

export const authenticate = (email, password, method) => async (dispatch) => {
  try {
    const res = await axios.post(`/auth/${method}`, { email, password });
    window.localStorage.setItem(TOKEN, res.data.token);
    dispatch(me());
  } catch (authError) {
    return dispatch(setAuth({ error: authError }));
  }
};

export const authenticateSignup =
  (email, password, firstName, lastName, method) => async (dispatch) => {
    try {
      const res = await axios.post(`/auth/${method}`, {
        email,
        password,
        firstName,
        lastName,
      });
      window.localStorage.setItem(TOKEN, res.data.token);
      dispatch(me());
    } catch (authError) {
      return dispatch(setAuth({ error: authError }));
    }
  };

export const logout = () => {
  window.localStorage.removeItem(TOKEN);
  history.push("/");
  return {
    type: SET_AUTH,
    auth: {},
  };
};

const intialState = {
  showModal: false,
  displayName: "",
  user: {},
};
/**
 * REDUCER
 */
export default function (state = intialState, action) {
  switch (action.type) {
    case SET_AUTH:
      return { ...state, user: action.auth };
    case TOGGLE_MODAL:
      return { ...state, showModal: !state.showModal };
    case MODAL_CONTENT:
      return { ...state, displayName: action.displayName };
    default:
      return state;
  }
}
