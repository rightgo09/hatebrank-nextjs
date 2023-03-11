import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "lib/upstash";
import { storeData } from "lib/hatena";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ymdh = Math.floor(Date.now() / 3600000).toString();
  let hbs = await redis.get(ymdh);
  if (!hbs) {
    console.log("storeData", ymdh);
    hbs = await storeData(ymdh);
  }
  res.status(200).send(hbs);
}
