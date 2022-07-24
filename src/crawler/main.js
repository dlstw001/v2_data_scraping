import {PuppeteerCrawler , RequestQueue} from 'crawlee';
import requestHandler from './config.js';


export default async function TestCrawler (reqUrl) {
    const requestQueue = await RequestQueue.open();
    await requestQueue.addRequests([{url : reqUrl}]);

    const crawler = new PuppeteerCrawler({
        launchContext: {
            launchOptions: {
                headless: true,
                // Other Puppeteer options
            },
        },
        requestQueue,
        requestHandler,
        maxRequestsPerCrawl: 10,
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    console.log('Crawler finished.');
}