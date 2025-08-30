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

// Security middleware
app.use(helmet());
app.use(cors());

// Logging
app.use(morgan('combined'));

// Rate limiting
const rateLimiter = new RateLimiter(100, 60 * 1000); // 100 requests per minute
app.use(rateLimiter.middleware());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  Logger.info(`🚀 Naver Scraper API running on port ${PORT}`);
  Logger.info(`🔗 Access the API at: http://localhost:${PORT}`);
});

export default app;