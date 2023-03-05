import { redis } from "lib/upstash";
import { NextResponse } from "next/server";
import { xml2json } from "xml-js";

type HatenaBookmark = {
  title: string;
  link: string;
  description: string;
  bookmarkcount: number;
  imageUrl: string;
  commentUrl: string;
  category: string;
};

type HatenaBookmarks = {
  [link: string]: HatenaBookmark;
};

export const config = {
  runtime: "edge",
};

export default async function handler() {
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
      ?.elements[0].text;
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

  const ymdh = Math.floor(Date.now() / 3600000); // 1 時間ごとに 1 変わる数字
  const res = await redis.set(ymdh.toString(), JSON.stringify(hbs));
  return new NextResponse(JSON.stringify(res), {
    status: 200,
  });
}
