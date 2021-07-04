import {
    SET_ADDRESS,
    SET_NETWORKID,
    SET_CONNECT_TYPE,
    SET_ERROR,
    SET_POOL_LIST,
    SET_CURRENT_APY,
    SET_TOTAL_USER_INFO,
    SET_USER_POOL_LIST,
    SET_START_BLOCK,
    SET_CURRENT_APR,
    SET_INIT_DATA,
  SET_LOGGED_IN,
} from '../actions';

const INIT_STATE = {
    error: '',
    address: null,
    networkId: null,
    connectType: '',
    poolList: [],
    userTotalInfo: {},
    userPoolList: null,
    currentAPY: null,
    currentAPR: null,
    startBlock: 0,
    loggedIn: null,
};

const authReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_ADDRESS:
            return { ...state, address: action.payload.address };
        case SET_NETWORKID:
            return { ...state, networkId: action.payload.networkId };
        case SET_CONNECT_TYPE:
            return { ...state, connectType: action.payload.connectType };
        case SET_ERROR:
            return { ...state, error: action.payload.error };
        case SET_POOL_LIST:
            return { ...state, poolList: action.payload.data };
        case SET_CURRENT_APY:
            return { ...state, currentAPY: action.payload.data };
        case SET_CURRENT_APR:
            return { ...state, currentAPR: action.payload.data };
        case SET_USER_POOL_LIST:
            return { ...state, userPoolList: action.payload.data };
        case SET_TOTAL_USER_INFO:
            return { ...state, userTotalInfo: action.payload.data };
        case SET_START_BLOCK:
            return { ...state, startBlock: action.payload.data };
        case SET_LOGGED_IN:
            return { ...state, loggedIn: action.payload };
        case SET_INIT_DATA:
            return {
                ...state,
                poolList: [],
                userTotalInfo: {},
                userPoolList: null,
                currentAPY: null,
                currentAPR: null,
            };
        default: return { ...state };
    }
}

export default authReducer;