import { redis } from "lib/upstash";
import type { NextApiRequest, NextApiResponse } from "next";
import { xml2json } from "xml-js";
import { HatenaBookmark } from "@/type/HatenaBookmark.type";
import { HatenaBookmarks } from "@/type/HatenaBookmarks.type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ymdh = Math.floor(Date.now() / 3600000).toString(); // 1 時間ごとに 1 変わる数字
  // すでに取得している場合は、これ以上取得しない
  if (await redis.get(ymdh)) {
    return res.status(200).json({ already: 1 });
  }

  const json = await fetch("https://b.hatena.ne.jp/hotentry.rss")
    .then((res) => res.text())
    .then((data) => {
      return JSON.parse(xml2json(data));
    });
  const items = json.elements[0].elements.filter((e: any) => e.name === "item");

  const hbs: HatenaBookmarks = {};
  for (const item of items) {
    const title = item.elements.find((e: any) => e.name === "title")
      ?.elements[0].text;
    const link = item.elements.find((e: any) => e.name === "link")?.elements[0]
      .text;
    const description = item.elements.find((e: any) => e.name === "description")
      ?.elements?.[0].text;
    const category = item.elements.find((e: any) => e.name === "dc:subject")
      ?.elements[0].text;
    const bookmarkcount = item.elements.find(
      (e: any) => e.name === "hatena:bookmarkcount"
    )?.elements[0].text;
    const imageUrl = item.elements.find(
      (e: any) => e.name === "hatena:imageurl"
    )?.elements[0].text;
    const commentUrl = item.elements.find(
      (e: any) => e.name === "hatena:bookmarkCommentListPageUrl"
    )?.elements[0].text;

    const hb: HatenaBookmark = {
      title,
      link,
      description,
      category,
      imageUrl,
      commentUrl,
      bookmarkcount: parseInt(bookmarkcount),
    };
    hbs[hb.link] = hb;
  }

  const redisResult = await redis.set(ymdh, JSON.stringify(hbs), {
    ex: 7200, // 2 時間だけ保存できればよい
  });
  res.status(200).json({ redisResult });
}
