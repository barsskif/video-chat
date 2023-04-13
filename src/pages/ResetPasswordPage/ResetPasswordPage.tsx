import { FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useFormik } from 'formik';
import { putNewPasswordByEmail } from 'store/reducers/ActionCreate';
import { validationSchema } from './components/validationSchema';

import { Button, FormControl, Grid, IconButton, Typography, Box } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import styled from '@emotion/styled';
import { StyledTextField } from 'components/StyledComponents';

import { ReactComponent as ResetSvg } from '../../images/reset_password.svg';

interface IParseCode {
  Code: string;
  DateForgot: string;
  UserEmail: string;
  Valid: boolean;
}

export const ResetPasswordPage: FC = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const [isPassword, setIsPassword] = useState(true);
  const [isConfirmPassword, setIsConfirmPassword] = useState(true);
  const [data, setData] = useState<null | IParseCode>(null);

  useEffect(() => {
    const pareseCodeParams = async () => {
      try {
        const codeDecode: string | null = code && (await atob(code));
        const parseCode: IParseCode = codeDecode && JSON.parse(codeDecode);
        if (parseCode.Valid) {
          return setData(parseCode);
        }
        return navigate('/');
      } catch (error) {
        console.log('Error', error);
        return navigate('/');
      }
    };

    pareseCodeParams();
  }, []);

  const hendleNewPassword = () => {
    if (data && formik) {
      return putNewPasswordByEmail(data.UserEmail, formik.values.password, data.Code);
    }
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const data = await hendleNewPassword();

      resetForm();

      if (data?.data.statusCode === 200) {
        navigate('/');
      }
    },
  });

  const hendleIsShowPassword = (
    <IconButton onClick={() => setIsPassword((prev) => !prev)}>
      {isPassword ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
    </IconButton>
  );

  const hendleIsShowConfirmPassword = (
    <IconButton onClick={() => setIsConfirmPassword((prev) => !prev)}>
      {isConfirmPassword ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
    </IconButton>
  );

  return (
    <StyleWrapper container direction="row" justifyContent="center" alignItems="center">
      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ width: '30%' }}>
        <Box
          component="form"
          minWidth={{ xs: '469px', sm: '469px' }}
          sx={{ display: 'contents' }}
          onSubmit={formik.handleSubmit}
        >
          <Typography variant="h2" marginBottom={'50px'}>
            Востановления пароля
          </Typography>
          <FormControl sx={{ width: '100%' }}>
            <StyledTextField
              className="Focus-shadow"
              sx={{ marginBottom: '20px' }}
              type={isPassword ? 'password' : 'text'}
              id="password"
              name="password"
              value={formik.values.password}
              color="primary"
              label="Пароль"
              required
              variant="outlined"
              autoComplete="off"
              fontSize="16px"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: hendleIsShowPassword,
              }}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <StyledTextField
              className="Focus-shadow"
              sx={{ marginBottom: '20px', width: '100%' }}
              type={isConfirmPassword ? 'password' : 'text'}
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              color="primary"
              label="подтвердите пароль"
              required
              variant="outlined"
              autoComplete="off"
              fontSize="16px"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                endAdornment: hendleIsShowConfirmPassword,
              }}
            />
          </FormControl>
          <Grid container direction="row" justifyContent="flex-start" alignItems="center">
            <Button type="submit" variant="contained" sx={{ minHeight: '52px', fontSize: '14px' }}>
              ВОССТАНОВИТЬ
            </Button>
          </Grid>
        </Box>
      </Grid>
      <Grid sx={{ marginLeft: '30px' }}>
        <ResetSvg />
      </Grid>
    </StyleWrapper>
  );
};

const StyleWrapper = styled(Grid)(() => ({
  paddingTop: '10%',
}));
