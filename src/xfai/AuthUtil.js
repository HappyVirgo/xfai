import { getLocalData, LS_KEY_AUTH, setLocalData } from "./utils";
import _ from 'lodash';

/**
 * Login action.
 * Actually save the networkId, Account, ConnectType on local storage.
 *
 * @param netId
 * @param account
 * @param connectType
 */
export function doLogin(netId, account, connectType) {
  setLocalData(LS_KEY_AUTH, {
    [netId]: {
      [connectType || 'metamask']: {
        [account]: new Date().getTime()
      }
    }
  });
}
export function doLogout(netId, account, connectType) {
  setLocalData(LS_KEY_AUTH, {
    [netId]: {
      [connectType || 'metamask']: {
        [account]: null
      }
    }
  });
}

export function isLoggedIn(netId, account, connectType) {
  const lsData = getLocalData(LS_KEY_AUTH);
  if (_.get(lsData, `[${netId}][${connectType || 'metamask'}][${account}]`)) return true;
  else return false;
}