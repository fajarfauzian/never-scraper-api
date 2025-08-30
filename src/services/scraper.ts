import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ProxyManager } from './proxy-manager';
import { FingerprintManager } from './fingerprint';
import { NaverApiResponse, ScrapingOptions } from '../types';
import { randomDelay } from '../utils/delay';
import { Logger } from '../utils/logger';
import { config } from '../config';

export class NaverScraper {
  private proxyManager: ProxyManager;
  private fingerprintManager: FingerprintManager;
  private requestQueue: Promise<any>[] = [];

  constructor() {
    this.proxyManager = new ProxyManager();
    this.fingerprintManager = new FingerprintManager();
  }

 private createAxiosInstance(options: ScrapingOptions = {}): AxiosInstance {
  const headers = this.fingerprintManager.generateHeaders();
  
  if (options.userAgent) {
    headers['User-Agent'] = options.userAgent;
  }

  const axiosConfig: any = {
    timeout: options.timeout || config.scraping.timeout,
    headers,
    validateStatus: () => true 
  };

  if (options.useProxy !== false) {
    const agent = this.proxyManager.getNextProxy();
    if (agent) {
      axiosConfig.httpsAgent = agent;
      axiosConfig.httpAgent = agent;
      Logger.info('Using proxy for request');
    } else {
      Logger.info('No proxy available, using direct connection');
    }
  } else {
    Logger.info('Proxy disabled for this request');
  }

  return axios.create(axiosConfig);
}

  private async makeRequest(url: string, options: ScrapingOptions = {}): Promise<AxiosResponse> {
    const maxRetries = options.maxRetries || config.scraping.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await randomDelay();

        const axiosInstance = this.createAxiosInstance(options);
        Logger.info(`Attempt ${attempt}/${maxRetries} for URL: ${url.substring(0, 100)}...`);

        const response = await axiosInstance.get(url);

        if (response.status === 200 && response.data) {
          Logger.info(`Successfully scraped data from Naver API`);
          return response;
        }

        if (response.status === 429 || response.status === 403) {
          Logger.warn(`Rate limited or blocked (${response.status}), rotating proxy...`);
          this.proxyManager.rotateProxy();
          await randomDelay(5000, 10000);
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      } catch (error) {
        lastError = error as Error;
        Logger.error(`Attempt ${attempt}/${maxRetries} failed:`, (error as Error).message);

        if (attempt < maxRetries) {
          this.proxyManager.rotateProxy();
          await randomDelay(2000, 5000);
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  private parseNaverResponse(data: any): NaverApiResponse {
    try {
      const products = [];
      
      let productList = [];
      
      if (data.shoppingResult && data.shoppingResult.products) {
        productList = data.shoppingResult.products;
      } else if (data.products) {
        productList = data.products;
      } else if (data.items) {
        productList = data.items;
      } else if (Array.isArray(data)) {
        productList = data;
      }

      for (const item of productList) {
        if (item && typeof item === 'object') {
          products.push({
            id: item.id || item.productId || '',
            title: item.productTitle || item.title || item.name || '',
            price: this.parsePrice(item.price || item.lowestPrice || item.originalPrice || '0'),
            imageUrl: item.imageUrl || item.productImageUrl || item.thumbnail || '',
            shopName: item.mallName || item.shopName || item.seller || '',
            rating: parseFloat(item.reviewScore || item.rating || '0'),
            reviewCount: parseInt(item.reviewCount || item.reviews || '0'),
            url: item.productUrl || item.url || item.link || ''
          });
        }
      }

      return {
        products,
        totalCount: data.totalCount || data.total || products.length,
        hasMore: data.hasMore || data.hasNext || false,
        cursor: data.cursor || data.nextCursor
      };
    } catch (error) {
      Logger.error('Error parsing Naver response:', error);
      return {
        products: [],
        totalCount: 0,
        hasMore: false
      };
    }
  }

  private parsePrice(priceString: string | number): number {
    if (typeof priceString === 'number') return priceString;
    
    const cleanPrice = priceString.toString().replace(/[^0-9]/g, '');
    return parseInt(cleanPrice || '0');
  }

  async scrapeNaverApi(apiUrl: string, options: ScrapingOptions = {}): Promise<NaverApiResponse> {
    try {
      while (this.requestQueue.length >= config.scraping.maxConcurrentRequests) {
        await Promise.race(this.requestQueue);
      }

      const requestPromise = this.makeRequest(apiUrl, options);
      this.requestQueue.push(requestPromise);

      requestPromise.finally(() => {
        const index = this.requestQueue.indexOf(requestPromise);
        if (index > -1) {
          this.requestQueue.splice(index, 1);
        }
      });

      const response = await requestPromise;
      return this.parseNaverResponse(response.data);

    } catch (error) {
      Logger.error('Scraping failed:', error);
      throw new Error(`Failed to scrape Naver API: ${(error as Error).message}`);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const testUrl = 'https://search.shopping.naver.com/ns/v1/search/paged-composite-cards?cursor=1&pageSize=10&query=iphone';
      const response = await this.makeRequest(testUrl, { maxRetries: 1, useProxy: false });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  getStats() {
    return {
      activeRequests: this.requestQueue.length,
      maxConcurrent: config.scraping.maxConcurrentRequests,
      proxyCount: this.proxyManager['proxyConfigs'].length
    };
  }
}