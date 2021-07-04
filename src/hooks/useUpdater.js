import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentAPY, setError, setInitData,
  setPoolList,
  setUserPoolList,
  setUserTotalInfo,
} from "../redux/actions";
import { updatePoolInfo } from "../xfai/utils";
import { isLoggedIn } from "../xfai/AuthUtil";
import { networkId } from "../config";

const useUpdater = (account) => {
  const dispatch = useDispatch();
  const updater = useCallback(async () => {
    if (!account || !isLoggedIn(networkId, account)) {
      return;
    }
    try {
      console.log("update start");
      const poolRes = await updatePoolInfo(account);
      dispatch(setCurrentAPY(poolRes.apy));
      dispatch(setPoolList(poolRes.poolList));
      dispatch(setUserPoolList(poolRes.userPoolInfo));
      dispatch(setUserTotalInfo(poolRes.userTotalInfo));
      console.log("update end");
    } catch (e) {
      // dispatch(setError());
      dispatch(setInitData());
    }
  }, [dispatch, account]);

  return updater;
};


export default useUpdater;
