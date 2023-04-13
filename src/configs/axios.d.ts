
declare module 'axios' {
  interface AxiosRequestConfig {
    disableSendToken?: boolean;
    formData?: boolean
  }

  interface AxiosError {
    description?: string;
  }
}