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
          <small>YYYY/MM/DD HH:MM 更新</small>
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
