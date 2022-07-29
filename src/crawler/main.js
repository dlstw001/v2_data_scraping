import { PuppeteerCrawler, RequestQueue, RequestList } from "crawlee";
import requestHandler from "./config.js";
import http from "../helper/http.js";

export default async function TestCrawler(req) {
  const requestQueue = await RequestQueue.open();
  let sources;
  let keywordsList = [];
  if (!req) {
    try {
      const res = await http.get(`/oauth/getUrlList`);
      sources = res.data.map((item) => item.website);
    } catch (err) {
      console.log("Get Urls Error");
    }
  } else {
    await requestQueue.addRequests([{ url: reqUrl }]);
  }

  const requestList = await RequestList.open("start_urls", sources);

  const crawler = new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
        // Other Puppeteer options
      },
    },
    requestList,
    requestQueue,
    requestHandler,
  });

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log("Crawler finished.");
}
