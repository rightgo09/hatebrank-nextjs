import styles from "@/styles/Home.module.css";

export default function Article({ hatebData }: any) {
  function diffBookmarkcountSymbol(hatebData: {
    diffBookmarkcount: number;
  }): string {
    if (hatebData.diffBookmarkcount === 0) {
      return "→";
    } else if (hatebData.diffBookmarkcount > 0) {
      return "↑";
    }
    return "↓";
  }

  return (
    <>
      <div>
        <span className={styles.ttl}>{hatebData.title}</span>
      </div>
      <div>
        <span>
          <a href={hatebData.link} target='_blank'>
            {hatebData.link}
          </a>
        </span>
      </div>
      <div>
        <span>
          <a
            className={styles.bkcnt}
            href={hatebData.commentUrl}
            target='_blank'
          >
            {hatebData.bookmarkcount} users
          </a>
        </span>
        <span className={styles.addbkcnt}>
          ({diffBookmarkcountSymbol(hatebData)}
          {hatebData.diffBookmarkcount})
        </span>
        <span
          className={`${styles.category} ${
            styles["category-" + hatebData.category]
          }`}
        >
          {hatebData.category}
        </span>
        {hatebData.bookmarkcount === hatebData.diffBookmarkcount && (
          <span className={styles.new}>New!</span>
        )}
      </div>
      <div className={styles.dsc}>{hatebData.description}</div>
    </>
  );
}
