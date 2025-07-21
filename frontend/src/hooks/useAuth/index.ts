import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMe } from "../../store/slices/authSlice";

const useAuth = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(fetchMe());
    }
  }, [user, dispatch]);

  return user;
};

export default useAuth;
