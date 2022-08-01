import TestCrawler from "./src/crawler/main.js";
import "dotenv/config";
import http from "./src/helper/http.js";
/* let process = false;

async function Main() {
  process = true;
  await new Promise((resolve, reject) =>
    resolve(TestCrawler()),
  );
  process = false;
}

TestCrawler();

setInterval(function () {
  if (!process) {
    Main();
  } else {
    console.log("Waiting...");
  }
}, 60000); */

/* const reqBody = {
  domain: "smartone.com",
  url: "https://www.smartone.com/",
  keywords: [
    {
      keyword: "wifi",
      type: "vertical",
      count: 5,
    },
  ],
};
const res = await http.post("/oauth/insertKeyword", reqBody);
console.log(res.data); */

TestCrawler("https://www.smartone.com/tc/home/");