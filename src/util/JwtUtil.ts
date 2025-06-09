import axios from 'axios';
import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

const jaxios = axios.create();

const beforeReq = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const accessToken = localStorage.getItem('token');
  if (!config.headers) config.headers = new axios.AxiosHeaders();
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};

const beforeRes = (res: AxiosResponse): AxiosResponse => {
  return res;
};

const requestFail = (error: AxiosError): Promise<never> => {
  console.error('요청 실패:', error);
  return Promise.reject(error);
};

const responseFail = (error: AxiosError): Promise<never> => {
  console.error('응답 실패:', error);
  return Promise.reject(error);
};

jaxios.interceptors.request.use(beforeReq, requestFail);
jaxios.interceptors.response.use(beforeRes, responseFail);

export default jaxios;
