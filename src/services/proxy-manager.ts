// src/services/proxy-manager.ts - Fixed version

import { HttpsProxyAgent } from 'https-proxy-agent';
import { config } from '../config';
import { ProxyConfig } from '../types';

export class ProxyManager {
  private proxyConfigs: ProxyConfig[] = [];
  private currentProxyIndex = 0;

  constructor() {
    // Only add main proxy if configured
    if (config.proxy.host && config.proxy.host.trim() !== '') {
      this.proxyConfigs.push({
        host: config.proxy.host,
        port: config.proxy.port,
        auth: {
          username: config.proxy.username,
          password: config.proxy.password
        }
      });
    }

    // Don't add fake proxies - comment out for now
    // this.addFreeProxies();
  }

  private addFreeProxies() {
    // Comment out fake proxies that don't exist
    // const freeProxies = [
    //   { host: 'proxy.example1.com', port: 8080 },
    //   { host: 'proxy.example2.com', port: 3128 }
    // ];

    // freeProxies.forEach(proxy => {
    //   this.proxyConfigs.push({
    //     host: proxy.host,
    //     port: proxy.port,
    //     auth: { username: '', password: '' }
    //   });
    // });
  }

  getNextProxy(): HttpsProxyAgent<string> | null {
    if (this.proxyConfigs.length === 0) {
      console.log('No proxy configured, using direct connection');
      return null;
    }

    const proxy = this.proxyConfigs[this.currentProxyIndex];
    this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyConfigs.length;

    const proxyUrl = proxy.auth.username
      ? `http://${proxy.auth.username}:${proxy.auth.password}@${proxy.host}:${proxy.port}`
      : `http://${proxy.host}:${proxy.port}`;

    console.log(`Using proxy: ${proxy.host}:${proxy.port}`);
    return new HttpsProxyAgent(proxyUrl);
  }

  rotateProxy() {
    if (this.proxyConfigs.length > 0) {
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyConfigs.length;
    }
  }

  getProxyCount(): number {
    return this.proxyConfigs.length;
  }
}