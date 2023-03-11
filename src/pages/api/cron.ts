import { redis } from "lib/upstash";
import type { NextApiRequest, NextApiResponse } from "next";
import { storeData } from "lib/hatena";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ymdh = Math.floor(Date.now() / 3600000).toString(); // 1 時間ごとに 1 変わる数字
  // すでに取得している場合は、これ以上取得しない
  if (await redis.get(ymdh)) {
    return res.status(200).json({ already: 1 });
  }

  await storeData(ymdh);

  res.status(200).json({ redisResult: "OK" });
}
