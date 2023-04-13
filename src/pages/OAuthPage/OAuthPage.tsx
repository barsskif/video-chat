import React, { useEffect } from 'react';

import { Grid } from '@mui/material';

import { useLocation, useNavigate } from 'react-router-dom';

import { Loader } from 'components/Loader/Loader';
import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { oAuth } from 'store/reducers/ActionCreate';

type oAuthType = 'google' | 'yandex';

export const OAuthPage = (props?: unknown) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user, isLoading, error } = useAppSelector((state) => state.SingInReducer);

    useEffect(() => {
        if (!props || (typeof props === 'object' && !('oAuthType' in props))) return navigate('/');
        const oAuthType = props['oAuthType'] as oAuthType;

        if (oAuthType === 'google' || oAuthType === 'yandex') dispatch(oAuth(location.search, oAuthType)).then();
        else navigate('/');
    }, []);

    useEffect(() => {
        if (user) {
            navigate('/rooms');
        }
    }, [user]);

    return (
        <StyledGridWrapper>
            {isLoading && <Loader/>}
            {error && <h1>Oppps что то пошло не так!</h1>}
        </StyledGridWrapper>
    );
};

export const StyledGridWrapper = styled(Grid)(() => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
}));
