import { EnqueueStrategy, sleep } from "crawlee";
import { convert } from "html-to-text";
import { parseDomain, fromUrl } from "parse-domain";
import keywordsList from "../helper/keywordsList.js";
import http from "../helper/http.js";

export default async function requestHandler({
  request,
  page,
  enqueueLinks,
  log,
}) {
  const { url } = request;
  const { domain, topLevelDomains } = parseDomain(fromUrl(url));
  const pageDomain = (domain + "." + topLevelDomains).toString();
  let keywordsMatch = [];

  let backlinksMatch = {
    url: url,
    web: 0,
    estore: 0,
  };

  log.info(`Processing ${url}...`);

  await sleep(1500);
  await page.evaluate(() => {
    window.scrollTo(0, window.document.body.scrollHeight);
  });
  await sleep(1500);
  let pageContent = convert(await page.content());

  //Check Keywords
  await keywordsList.map((item) => {
    const keyword = new RegExp(item.name, "g");
    let count = pageContent.match(keyword);
    if (count) {
      keywordsMatch.push({
        keyword: item.name,
        type: item.type,
        count: count.length,
      });
    }
  });

  //Send Data to Server
  if (keywordsMatch.length > 0) {
    const reqBody = {
      domain: pageDomain,
      url: url,
      keywords: keywordsMatch,
    };
    await http.post("/oauth/insertKeyword", reqBody);
  }

  //Check Backlinks
  let linkResults = await page.$$eval("a", (links) => links.map((a) => a.href));
  linkResults
    .filter((item) => parseDomain(fromUrl(item)).domain == "peplink")
    .map((item) => {
      const { subDomains } = parseDomain(fromUrl(item));
      subDomains == "www"
        ? backlinksMatch.web++
        : subDomains == "estore"
        ? backlinksMatch.estore++
        : null;
    });

  if (backlinksMatch.estore > 0 || backlinksMatch.web > 0) {
    const reqBody = {
      domain: pageDomain,
      url: backlinksMatch.url,
      estoreCount: backlinksMatch.estore,
      webCount: backlinksMatch.web,
    };
    await http.post("/oauth/insertBacklink", reqBody);
  }

  await enqueueLinks({
    strategy: EnqueueStrategy.SameDomain,
  });
}
