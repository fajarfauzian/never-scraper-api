import { Router } from 'express';
import { ScraperController } from '../controllers/scraper.controller';

const router = Router();
const scraperController = new ScraperController();

router.get('/naver', scraperController.scrapeNaver.bind(scraperController));

router.get('/health', scraperController.healthCheck.bind(scraperController));

router.get('/', (req, res) => {
  res.json({
    name: 'Naver Scraper API',
    version: '1.0.0',
    endpoints: {
      scrape: 'GET /naver?url=<naver-api-url>',
      health: 'GET /health'
    },
    example: '/naver?url=https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1&pageSize=50&query=iphone'
  });
});

export default router;