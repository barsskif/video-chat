import { useState } from 'react';
import { FormControl, IconButton, Stack } from '@mui/material';
import { StyledTextField } from '../../../components/StyledComponents';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

export const RegistrationFrom = ({ formik }) => {
  const { email, name, password } = formik.values;
  const { handleChange, handleBlur } = formik;
  const [isPassword, setPassword] = useState(true);

  const onPassBtn = (
    <IconButton onClick={() => setPassword(!isPassword)}>
      {isPassword ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
    </IconButton>
  );

  return (
    <Stack direction="column" gap={2}>
      <FormControl>
        <StyledTextField
          id="name"
          name="name"
          type="text"
          value={name}
          color="primary"
          label="Имя"
          required
          variant="outlined"
          autoComplete="off"
          fontSize="20px"
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
        />
      </FormControl>
      <FormControl>
        <StyledTextField
          type="email"
          id="email"
          name="email"
          value={email}
          color="primary"
          label="Email"
          required
          autoComplete="off"
          variant="outlined"
          fontSize="20px"
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
        />
      </FormControl>
      <FormControl>
        <StyledTextField
          className="Focus-shadow"
          type={isPassword ? 'password' : 'text'}
          id="password"
          name="password"
          value={password}
          color="primary"
          label="Пароль"
          required
          variant="outlined"
          autoComplete="new-password"
          fontSize="20px"
          onChange={handleChange}
          onBlur={handleBlur}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: onPassBtn,
          }}
        />
      </FormControl>
    </Stack>
  );
};
