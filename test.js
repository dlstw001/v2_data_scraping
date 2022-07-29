import TestCrawler from "./src/crawler/main.js";
import "dotenv/config";
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

TestCrawler();
