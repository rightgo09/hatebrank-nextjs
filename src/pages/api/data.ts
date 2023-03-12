import type { NextApiRequest, NextApiResponse } from "next";
import { redis } from "lib/upstash";
import { storeData } from "lib/hatena";
import { HatenaBookmark } from "@/type/HatenaBookmark.type";
import { HatenaBookmarks } from "@/type/HatenaBookmarks.type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const ymdh = Math.floor(Date.now() / 3600000);
  const [curData, prevData]: [HatenaBookmarks, HatenaBookmarks] =
    await Promise.all([
      getData(ymdh.toString()) as unknown as HatenaBookmarks,
      redis.get((ymdh - 1).toString()) as unknown as HatenaBookmarks,
    ]);

  let hbs: HatenaBookmark[] = [];
  if (prevData) {
    Object.keys(curData).forEach((link: string) => {
      if (link in prevData) {
        hbs.push({
          ...curData[link],
          diffBookmarkcount:
            curData[link].bookmarkcount - prevData[link].bookmarkcount,
        });
      } else {
        hbs.push({
          ...curData[link],
          diffBookmarkcount: curData[link].bookmarkcount,
        });
      }
    });
  } else {
    hbs = Object.values(curData).map((hb: HatenaBookmark) => {
      return {
        ...hb,
        diffBookmarkcount: hb.bookmarkcount,
      };
    });
  }

  const sortedHbs = hbs.sort(
    (a: HatenaBookmark, b: HatenaBookmark) =>
      (b.diffBookmarkcount || 0) - (a.diffBookmarkcount || 0)
  );

  res.status(200).send(sortedHbs.slice(0, 50));
}

async function getData(ymdh: string) {
  let hbs = await redis.get(ymdh);
  if (!hbs) {
    console.log("storeData", ymdh);
    hbs = await storeData(ymdh);
  }
  return hbs;
}
