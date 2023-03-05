import type { NextApiResponse } from "next";
import { redis } from "lib/upstash";

export const config = {
  runtime: "edge",
};

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

export default async function handler(res: NextApiResponse<HatenaBookmarks>) {
  const ymdh = Math.floor(Date.now() / 3600000);
  const hbs = await redis.get(ymdh.toString());
  res.status(200).json(JSON.parse(hbs as string) || "{}");
}
