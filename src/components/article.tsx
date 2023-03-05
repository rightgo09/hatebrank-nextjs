export default function Article({ hatebData }: any) {
  return (
    <>
      <div>
        <span className='ttl'>{hatebData.title}</span>
      </div>
      <div>
        <span className='lnk'>
          <a href={hatebData.link} target='_blank'>
            {hatebData.link}
          </a>
        </span>
      </div>
      <div>
        <span className='bkcnt'>
          <a href={hatebData.commentUrl} target='_blank'>
            {hatebData.bookmarkcount} users
          </a>
        </span>
        <span className='addbkcnt'>()</span>
        <span className='category'>{hatebData.category}</span>
        <span className='new'>New!</span>
      </div>
      <div className='dsc'>{hatebData.description}</div>
    </>
  );
}
