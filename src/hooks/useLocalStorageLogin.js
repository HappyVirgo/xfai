import { useState } from "react";
import { doLogin, isLoggedIn } from "../xfai/AuthUtil";

export const useLocalStorageLogin = (currentNetworkId, account) => {
  const setLoggedIn = () => {
    doLogin(currentNetworkId, account);
  }
  const loggedIn = isLoggedIn(currentNetworkId, account);

  return [loggedIn, setLoggedIn];
}