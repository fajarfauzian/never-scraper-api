import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  proxy: {
    host: process.env.PROXY_HOST || '',
    port: parseInt(process.env.PROXY_PORT || '9999'),
    username: process.env.PROXY_USERNAME || '',
    password: process.env.PROXY_PASSWORD || ''
  },
  scraping: {
    maxConcurrentRequests: parseInt(process.env.MAX_CONCURRENT_REQUESTS || '5'),
    delayMin: parseInt(process.env.REQUEST_DELAY_MIN || '1000'),
    delayMax: parseInt(process.env.REQUEST_DELAY_MAX || '3000'),
    maxRetries: 3,
    timeout: 30000
  }
};