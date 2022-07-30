import { EnqueueStrategy} from 'crawlee';
import { raw } from "express";
import { convert } from "html-to-text";
import { parseDomain, fromUrl } from "parse-domain";
/* import keywordsList from "../helper/keywordsList.js"; */

export default async function requestHandler({
  request,
  page,
  enqueueLinks,
  log,
}) {
  let keywordsMatch = [];
  let backlinksMatch = { web: 0, estore: 0 };

  const { url } = request;
  log.info(`Processing ${url}...`);

  await page.evaluate(() => {
    window.scrollTo(0, window.document.body.scrollHeight);
  });
  let pageContent = convert(await page.content());

  //Check Keywords
  await keywordsList
    .map((item) => {
      const keyword = new RegExp(item.name, "g");
      let count = pageContent.match(keyword);
      if (count) {
        keywordsMatch.push({
          keyword: item.name,
          type: item.type,
          count: count.length,
        });
      }
    })
    .then(() => {
      //Submit keywords result to server
    });

  //Check Backlinks
  await page
    .$$eval("a", (links) => links.map((a) => a.href))
    .then((result) =>
      result
        .filter((item) => parseDomain(fromUrl(item)).domain == "peplink")
        .map((item) => {
          const { subDomains } = parseDomain(fromUrl(item));
          subDomains == "www"
            ? backlinksMatch.web++
            : subDomains == "estore"
            ? backlinksMatch.estore++
            : null;
        }),
    )
    .then(() => {
      //Sunmite backlinks result to server
    });

  await enqueueLinks({
    strategy: EnqueueStrategy.SameDomain,
  });
};
