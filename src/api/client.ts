// src/api/client.ts
import axios from 'axios';

// В режиме разработки запросы идут через Vite proxy
// В продакшене напрямую
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return ''; // Пустая строка, так как используем относительные пути через прокси
  }
  return 'http://rpi.directvision.ru:4001';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Логирование запросов
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${fullUrl}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export { apiClient };