import { config } from '../config';

export const randomDelay = (min?: number, max?: number): Promise<void> => {
  const minDelay = min || config.scraping.delayMin;
  const maxDelay = max || config.scraping.delayMax;
  const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};