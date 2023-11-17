import axios from 'axios';

const fetcher = axios.create({
  baseURL: 'https://www.v2ex.com/api/v2/',
  timeout: 30000,
});

fetcher.interceptors.response.use(
  response => {
    const { success, message, result } = response.data;
    if (success) {
      return result;
    }
    return message;
  },
  function (error) {
    return Promise.reject(error.response.data.message);
  }
);

export default fetcher;
