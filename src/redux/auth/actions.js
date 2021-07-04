import {
  SET_ADDRESS,
  SET_NETWORKID,
  SET_CONNECT_TYPE,
  SET_ERROR,
  SET_POOL_LIST,
  SET_CURRENT_APY,
  SET_TOTAL_USER_INFO,
  SET_USER_POOL_LIST,
  SET_START_BLOCK, SET_CURRENT_APR, SET_INIT_DATA, SET_LOGGED_IN,
} from '../actions';

export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: { address }
});

export const setNetworkId = (networkId) => ({
  type: SET_NETWORKID,
  payload: { networkId }
});

export const setConnectType = (connectType) => ({
  type: SET_CONNECT_TYPE,
  payload: { connectType }
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: { error }
});

export const setPoolList = (data) => ({
  type: SET_POOL_LIST,
  payload: { data }
});

export const setCurrentAPY = (data) => ({
  type: SET_CURRENT_APY,
  payload: { data }
});

export const setCurrentAPR = (data) => ({
  type: SET_CURRENT_APR,
  payload: { data }
});

export const setUserPoolList = (data) => ({
  type: SET_USER_POOL_LIST,
  payload: { data }
});

export const setUserTotalInfo = (data) => ({
  type: SET_TOTAL_USER_INFO,
  payload: { data }
});

export const setStartBlock = (data) => ({
  type: SET_START_BLOCK,
  payload: { data }
});

export const setInitData = () => ({
  type: SET_INIT_DATA,
  payload: null
});

export const setLoggedIn = (status) => ({
  type: SET_LOGGED_IN,
  payload: status
});
