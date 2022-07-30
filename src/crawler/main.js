import { PuppeteerCrawler, RequestQueue, RequestList } from "crawlee";
import requestHandler from "./config.js";
/* import http from "../helper/http.js"; */

export default async function TestCrawler(reqUrl) {
  const requestQueue = await RequestQueue.open();
  let requestList;
  let sources;
  let keywordsList = [];
  if (!reqUrl) {
    /* try {
      const res = await http.get(`/oauth/getUrlList`);
      sources = res.data.map((item) => item.website);
    } catch (err) {
      console.log("Get Urls Error");
    } */
    requestList = await RequestList.open("start_urls", sources);
  } else {
    await requestQueue.addRequests([{ url: reqUrl }]);
  }

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
