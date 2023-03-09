import Head from "next/head";
import useSWR from "swr";
import Article from "@/components/article";

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
        <h1>はてブ毎時ランキング</h1>
        <div>
          <small>YYYY/MM/DD HH:MM 更新</small>
        </div>
      </header>
      <main>
        <ol>
          {data &&
            Object.entries(data).map(([key, value]) => {
              return (
                <li className='entry' key={key}>
                  <Article hatebData={value}></Article>
                </li>
              );
            })}
        </ol>
      </main>
      <footer>Created by rightgo09</footer>
    </>
  );
}
