import Head from "next/head";
import useSWR from "swr";
import Article from "@/components/article";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const { data } = useSWR("/api/data", (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <title>はてブ毎時ランキング</title>
        <meta
          name='description'
          content='はてなブックマーク数を毎時でランキングしています。'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header>
        <h1 className={styles.page_title}>はてブ毎時ランキング</h1>
        <div>
          <small>{now()} のデータ</small>
        </div>
      </header>
      <main>
        {data ? (
          <ol>
            {data.map((d: any) => {
              return (
                <li className={styles.entry} key={d.link}>
                  <Article hatebData={d}></Article>
                </li>
              );
            })}
          </ol>
        ) : (
          <div>ロード中</div>
        )}
      </main>
      <footer>Created by rightgo09</footer>
    </>
  );
}

/**
 * ChatGPT generated
 * @returns string YYYY/MM/DD HH:00
 */
function now(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);

  const hour = ("0" + now.getHours()).slice(-2);
  const minute = "00";

  return `${year}/${month}/${day} ${hour}:${minute}`;
}
