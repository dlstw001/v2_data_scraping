import { EnqueueStrategy} from 'crawlee';
import { convert } from 'html-to-text'
import keywordsList from "../helper/keywordsList.js";

export default async function requestHandler({
  request,
  page,
  enqueueLinks,
  log,
}) {
  const { url } = request;
  log.info(`Processing ${url}...`);
  await page.evaluate(() => {
    window.scrollTo(0, window.document.body.scrollHeight);
  });
  const rawData = await page.content();
  const content = convert(rawData);
  const filter = new RegExp("5G", "g");

  await enqueueLinks({
    strategy: EnqueueStrategy.SameDomain,
  });
};
