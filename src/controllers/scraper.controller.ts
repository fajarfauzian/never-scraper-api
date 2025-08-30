import { Request, Response } from 'express';
import { NaverScraper } from '../services/scraper';
import { Logger } from '../utils/logger';

export class ScraperController {
  private scraper: NaverScraper;

  constructor() {
    this.scraper = new NaverScraper();
  }

  async scrapeNaver(req: Request, res: Response) {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({
          error: 'URL parameter is required',
          example: '/naver?url=https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?...'
        });
      }

      // Validate URL
      if (!url.includes('search.shopping.naver.com/ns/v1/search/paged-composite-cards')) {
        return res.status(400).json({
          error: 'Invalid Naver API URL format'
        });
      }

      Logger.info(`Scraping request for: ${url}`);
      const startTime = Date.now();

      const result = await this.scraper.scrapeNaverApi(url, {
        useProxy: true,
        maxRetries: 3
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      Logger.info(`Scraping completed in ${latency}ms`);

      res.json({
        success: true,
        data: result,
        meta: {
          latency: `${latency}ms`,
          timestamp: new Date().toISOString(),
          url
        }
      });

    } catch (error) {
      Logger.error('Scraping error:', error);
      res.status(500).json({
        error: 'Scraping failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async healthCheck(req: Request, res: Response) {
    try {
      const isHealthy = await this.scraper.healthCheck();
      
      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}