export class FingerprintManager {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15'
  ];

  private acceptLanguages = [
    'ko-KR,ko;q=0.9,en;q=0.8',
    'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
    'ko,en-US;q=0.7,en;q=0.3'
  ];

  getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  getRandomAcceptLanguage(): string {
    return this.acceptLanguages[Math.floor(Math.random() * this.acceptLanguages.length)];
  }

  generateHeaders(): Record<string, string> {
    return {
      'User-Agent': this.getRandomUserAgent(),
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': this.getRandomAcceptLanguage(),
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://search.shopping.naver.com/',
      'Origin': 'https://search.shopping.naver.com',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }
}