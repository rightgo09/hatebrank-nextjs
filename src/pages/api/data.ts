import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "lib/upstash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ymdh = Math.floor(Date.now() / 3600000);
  const hbs = await redis.get(ymdh.toString());
  res.status(200).send(hbs);
}
