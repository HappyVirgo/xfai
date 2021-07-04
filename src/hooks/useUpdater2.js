import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentAPY, setInitData,
  setPoolList,
  setUserPoolList,
  setUserTotalInfo,
} from "../redux/actions";
import { updatePoolInfo } from "../xfai/utils";
import { isLoggedIn } from "../xfai/AuthUtil";
import { networkId } from "../config";

const useUpdater2 = (account) => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const updater = useCallback(async () => {
    if (!account || !isLoggedIn(networkId, account)) {
      return;
    }
    try {
      setLoading(true);
      console.log("update start");
      const poolRes = await updatePoolInfo(account);
      dispatch(setCurrentAPY(poolRes.apy));
      dispatch(setPoolList(poolRes.poolList));
      dispatch(setUserPoolList(poolRes.userPoolInfo));
      dispatch(setUserTotalInfo(poolRes.userTotalInfo));
      console.log("update end");
      setLoading(false);
    } catch (e) {
      dispatch(setInitData());
    }
  }, [dispatch, account]);

  return [loading, updater];
};


export default useUpdater2;
