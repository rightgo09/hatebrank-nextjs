import { redis } from "lib/upstash";
import { HatenaBookmark } from "@/type/HatenaBookmark.type";
import { HatenaBookmarks } from "@/type/HatenaBookmarks.type";
import { xml2json } from "xml-js";

const urls: string[] = [
  "https://b.hatena.ne.jp/hotentry.rss",
  "https://b.hatena.ne.jp/hotentry/economics.rss",
  "https://b.hatena.ne.jp/hotentry/entertainment.rss",
  "https://b.hatena.ne.jp/hotentry/fun.rss",
  "https://b.hatena.ne.jp/hotentry/game.rss",
  "https://b.hatena.ne.jp/hotentry/general.rss",
  "https://b.hatena.ne.jp/hotentry/it.rss",
  "https://b.hatena.ne.jp/hotentry/knowledge.rss",
  "https://b.hatena.ne.jp/hotentry/life.rss",
  "https://b.hatena.ne.jp/hotentry/social.rss",
];

export async function storeData(ymdh: string): Promise<string | null> {
  const hbs: HatenaBookmarks = {};

  for (const f of urls) {
    const items = await getItems(f);
    for (const item of items) {
      const hb: HatenaBookmark = convertItem(item);
      if (hb.link in hbs) {
        // なぜかブックマーク数に違いがあるときは大きい方を採用する
        if (hb.bookmarkcount > hbs[hb.link].bookmarkcount) {
          hbs[hb.link] = hb; // 入れ替え
        }
      } else {
        hbs[hb.link] = hb;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return await redis.set(ymdh, JSON.stringify(Object.values(hbs)), {
    ex: 7200, // 2 時間だけ保存できればよい
  });
}

async function getItems(url: string): Promise<any> {
  const json = await fetch(url)
    .then((res) => res.text())
    .then((data) => JSON.parse(xml2json(data)));
  return json.elements[0].elements.filter((e: any) => e.name === "item");
}

function convertItem(item: any): HatenaBookmark {
  const title = item.elements.find((e: any) => e.name === "title")?.elements[0]
    .text;
  const link = item.elements.find((e: any) => e.name === "link")?.elements[0]
    .text;
  const description = item.elements.find((e: any) => e.name === "description")
    ?.elements?.[0].text;
  const category = item.elements.find((e: any) => e.name === "dc:subject")
    ?.elements[0].text;
  const bookmarkcount = item.elements.find(
    (e: any) => e.name === "hatena:bookmarkcount"
  )?.elements[0].text;
  const imageUrl = item.elements.find((e: any) => e.name === "hatena:imageurl")
    ?.elements[0].text;
  const commentUrl = item.elements.find(
    (e: any) => e.name === "hatena:bookmarkCommentListPageUrl"
  )?.elements[0].text;

  return {
    title,
    link,
    description,
    category,
    imageUrl,
    commentUrl,
    bookmarkcount: parseInt(bookmarkcount),
  };
}
