import { useEffect, useState } from 'react';
import { enumLocalStorage, IJwtTokenData } from 'types/share';
import { useAppDispatch } from 'hooks/redux';
import { userFetch } from 'store/reducers/ActionCreate';
import jwt_decode from 'jwt-decode';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(enumLocalStorage.ACCESS_TOKEN);
    try {
      if (!token) return setIsAuth(false);

      const decodedToken = jwt_decode(token) as IJwtTokenData;

      if (decodedToken.exp && new Date() <= new Date(decodedToken.exp)) return setIsAuth(false);

      dispatch(userFetch()).then(() => setIsAuth(true));
    } catch (e) {
      setIsAuth(false);
    }
  }, []);

  return { isAuth };
};
