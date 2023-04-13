import {Dispatch, SetStateAction, useEffect} from 'react';
import {userFetch} from "store/reducers/ActionCreate";
import {useAppDispatch} from "hooks/redux";

export const useCookieHandler = (setGuestName : Dispatch<SetStateAction<string>>) => {
    const dispatch = useAppDispatch()

    const parseCookie = (cookie: string): [string, string] => {
        const [key, value] = cookie.split('=');
        return [decodeURIComponent(key), decodeURIComponent(value)];
    }

    const parseCookies = (cookies: string): { [key: string]: string } => {
        return cookies.split(';').reduce((prev, curr) => {
            const [key, value] = parseCookie(curr.trim());
            prev[key] = value;
            return prev;
        }, {});
    }

    useEffect(() => {
        const cookies = parseCookies(document.cookie);
        const userName = cookies['userName'];
        const user = cookies['user'];

        if (userName) {
            setGuestName(userName);
        }

        if (user) {
            const reconnect = async () => {
                localStorage.setItem('accessToken', user);
                await dispatch(userFetch());
            };

            reconnect();
        }
    }, [dispatch, setGuestName]);
}
