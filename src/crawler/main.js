import { PuppeteerCrawler, RequestQueue, RequestList } from "crawlee";
import requestHandler from "./config.js";
import http from "../helper/http.js";

export default async function TestCrawler(reqUrl) {
  let startUrls = [];
  if (!reqUrl) {
    try {
      const res = await http.get("/oauth/getUrlList");
      startUrls = await res.data.map((item) => item.website);
    } catch (err) {
      console.log("Get Urls Error");
    }
  } else {
    await requestQueue.addRequests([{ url: reqUrl }]);
  }

  const requestList = await RequestList.open("start", startUrls);
  const requestQueue = await RequestQueue.open();

  const crawler = new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
        args: ["--disable-features=LookalikeUrlNavigationSuggestionsUI"],
      },
    },
    maxConcurrency: 5,
    requestList,
    requestQueue,
    requestHandler,
  });

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log("Crawler finished.");
}
