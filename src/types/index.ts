export interface NaverProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  shopName: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}

export interface NaverApiResponse {
  products: NaverProduct[];
  totalCount: number;
  hasMore: boolean;
  cursor?: string;
}

export interface ScrapingOptions {
  useProxy?: boolean;
  maxRetries?: number;
  timeout?: number;
  userAgent?: string;
}

export interface ProxyConfig {
  host: string;
  port: number;
  auth: {
    username: string;
    password: string;
  };
}