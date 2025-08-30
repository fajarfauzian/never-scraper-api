import { HttpsProxyAgent } from 'https-proxy-agent';
import { config } from '../config';
import { ProxyConfig } from '../types';

export class ProxyManager {
  private proxyConfigs: ProxyConfig[] = [];
  private currentProxyIndex = 0;

  constructor() {
    // Add main proxy
    if (config.proxy.host) {
      this.proxyConfigs.push({
        host: config.proxy.host,
        port: config.proxy.port,
        auth: {
          username: config.proxy.username,
          password: config.proxy.password
        }
      });
    }

    // Add backup free proxies (you can expand this list)
    this.addFreeProxies();
  }

  private addFreeProxies() {
    // Add some free Korean proxies as backup
    const freeProxies = [
      { host: 'proxy.example1.com', port: 8080 },
      { host: 'proxy.example2.com', port: 3128 }
    ];

    freeProxies.forEach(proxy => {
      this.proxyConfigs.push({
        host: proxy.host,
        port: proxy.port,
        auth: { username: '', password: '' }
      });
    });
  }

  getNextProxy(): HttpsProxyAgent<string> | null {
    if (this.proxyConfigs.length === 0) return null;

    const proxy = this.proxyConfigs[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyConfigs.length;

    const proxyUrl = proxy.auth.username
      ? `http://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`
      : `http://${proxy.host}:${proxy.port}`;

    return new HttpsProxyAgent(proxyUrl);
  }

  rotateProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyConfigs.length;
  }
}