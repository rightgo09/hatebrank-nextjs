import styles from "@/styles/Home.module.css";

export default function Article({ hatebData }: any) {
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
        <span className='addbkcnt'>()</span>
        <span
          className={`${styles.category} ${
            styles["category-" + hatebData.category]
          }`}
        >
          {hatebData.category}
        </span>
        <span className={styles.new}>New!</span>
      </div>
      <div className={styles.dsc}>{hatebData.description}</div>
    </>
  );
}
