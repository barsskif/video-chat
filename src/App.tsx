import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { isMobile, isEdgeChromium, isIE, isFirefox, isLegacyEdge } from 'react-device-detect';

import { useAppDispatch } from 'hooks/redux';
import { DifferentStatesSlice } from 'store/reducers/DifferentStatesSlice';

import { privateRouters, routers } from './routers/routers';
import { PrivateRoute } from './routers/privateRoute/PrivateRoute';

import { NotFound } from 'pages/NotFound/NotFound';

import { DoNotSupportDevice } from 'components/DoNotSupportDevice/DoNotSupportDevice';
import { RootBackground, StyledCircularProgress } from 'components/StyledComponents';

import { StyledEngineProvider } from '@mui/material';
import { AppThemeProvider } from './themes/AppThemeProvider';

import './index.css';

export const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { reducerSetTheme } = DifferentStatesSlice.actions;

  const patch = pathname.split('/');

  useEffect(() => {
    const isBotEnter = () => {
      const paramsString = document.location.search;
      const searchParams = new URLSearchParams(paramsString);

      if (searchParams.get('private_code')) {
        console.log('test');
        localStorage.setItem('guestName', 'dggb499cnndkKKD');
        localStorage.setItem('bot', 'true');
        // dispatch(loginGuest('record-bot'));
      }
    };

    isBotEnter();
  }, []);

  useEffect(() => {
    if (patch[1] === 'room' || patch[1] === 'webinar-room') dispatch(reducerSetTheme('meeting'));
    else dispatch(reducerSetTheme('main'));
  }, [pathname]);




  if (isMobile && (isEdgeChromium || isIE || isFirefox || isLegacyEdge)) return <DoNotSupportDevice />;
  if (isFirefox) return <DoNotSupportDevice />; //TODO: убрать когда решим вопрос с нормальным захватам изображения

  if (patch[1] === 'guest' && patch[2] === localStorage.getItem('private_code')) {
  }

  return (
    <StyledEngineProvider injectFirst>
      <AppThemeProvider>
        <RootBackground>
          <Suspense fallback={<StyledCircularProgress color="primary" />}>
            <Routes>
              <Route element={<PrivateRoute />}>
                {privateRouters.map(({ path, Element }) => (
                  <Route key={path} path={path} element={<Element />} />
                ))}
              </Route>
              {routers.map(({ path, Element, ...props }) => (
                <Route key={path} path={path} element={<Element {...props} />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </RootBackground>
      </AppThemeProvider>
    </StyledEngineProvider>
  );
};
