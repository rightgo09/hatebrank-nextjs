import { redis } from "lib/upstash";
import { NextResponse } from "next/server";
import { xml2js } from "xml-js";

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
  const xml = await fetch("https://b.hatena.ne.jp/hotentry.rss")
    .then((res) => res.text())
    .then((data) => {
      return xml2js(data, { compact: true });
    });

  const hbs: HatenaBookmarks = {};
  for (const item of xml["rdf:RDF"].item) {
    const hb: HatenaBookmark = {
      title: item.title._text,
      link: item.link._text,
      description: item.description._text,
      bookmarkcount: parseInt(item["hatena:bookmarkcount"]._text),
      imageUrl: item["hatena:imageurl"]._text,
      commentUrl: item["hatena:bookmarkCommentListPageUrl"]._text,
      category: Array.isArray(item["dc:subject"])
        ? item["dc:subject"][0]._text
        : item["dc:subject"]._text,
    };
    hbs[hb.link] = hb;
  }

  const ymdh = Math.floor(Date.now() / 3600000); // 1 時間ごとに 1 変わる数字
  const res = await redis.set(ymdh.toString(), JSON.stringify(hbs));
  return new NextResponse(JSON.stringify(res), {
    status: 200,
  });
}
