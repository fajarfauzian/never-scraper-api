import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { RateLimiter } from './middleware/rate-limiter';
import { config } from './config';
import { Logger } from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors());

app.use(morgan('combined'));

const rateLimiter = new RateLimiter(100, 60 * 1000);
app.use(rateLimiter.middleware());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  Logger.info(`🚀 Naver Scraper API running on port ${PORT}`);
  Logger.info(`🔗 Access the API at: http://localhost:${PORT}`);
});

export default app;