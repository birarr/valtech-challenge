import { fetchNews } from '../../services/requests'
import { useQuery } from 'react-query'
import { useEffect, useMemo, useState } from 'react'
import { NewsProps } from './index.types'
import { Categories, Article } from '../../utils/Types'
import * as styles from './index.styles'
import { ClipLoader } from 'react-spinners'

export const News: React.FC<NewsProps> = ({ category, search }) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(7)
  const [news, setNews] = useState<Article[]>([])
  const [subject, setSubject] = useState('Top story')
  const [featuredNewsTitle, setFeaturedNewsTitle] = useState('Breaking')
  var options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const {
    data: newsData,
    status: newsStatus,
    refetch,
  } = useQuery(['news', subject, page], () =>
    fetchNews(subject, page, pageSize)
  )

  useEffect(() => {
    if (category) {
      setPage(1)
      setNews([])
    }
    setSubject(category!)
  }, [category])

  useEffect(() => {
    if (search !== '') {
      setPage(1)
      setNews([])
      setSubject(search!)
    }
  }, [search])

  const sortedNews = newsData?.articles?.sort((a: Article, b: Article) => {
    const date1 = new Date(b?.publishedAt!)
    const date2 = new Date(a?.publishedAt!)
    return date1.getTime()! - date2.getTime()!
  })

  useEffect(() => {
    if (sortedNews?.length > 0 && page) {
      setNews([...news, ...sortedNews])
      return
    }
  }, [sortedNews, page])

  const firstNewsTitle = useMemo(() => {
    if (featuredNewsTitle === 'Breaking' && category === 'Top story') {
      return featuredNewsTitle
    } else {
      setFeaturedNewsTitle(category!)
      return `LATEST ${featuredNewsTitle}`
    }
  }, [category, featuredNewsTitle])

  return (
    <>
      <div className={styles.container}>
        {newsStatus === 'error' && <div>Error fetching data</div>}
        <div className="w-11/12 flex justify-center">
          {news?.map((item: Article, index: number) => {
            if (index === 0) {
              return (
                <div className={styles.featuredNews} key={index}>
                  <div className={styles.newsType}>
                    {`${firstNewsTitle.toUpperCase()} NEWS`}
                  </div>
                  <div>
                    <div className={styles.featuredNewsImageContainer}>
                      <img
                        src={item?.urlToImage}
                        className={styles.featuredNewsImage}
                      />
                      <div className="flex justify-center">
                        <div className={styles.overlaySource}>
                          {item?.source?.name}
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className={styles.overlayTitle}>{item?.title}</div>
                      </div>
                      <div className={styles.featuredContentContainer}>
                        <div className={styles.featuredContent}>
                          {item?.content}
                        </div>
                      </div>
                      <div className={styles.featuredNewsButtonContainer}>
                        <a
                          className={styles.feturedNewsButton}
                          href={item?.url!}
                          target="_blank"
                        >
                          Read the news
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
        <div className={styles.regularNewsContainer}>
          {news?.map((item: Article, index: number) => {
            if (index !== 0) {
              return (
                <div
                  key={index}
                  className="first:col-span-2 last:col-span-2 mt-2"
                >
                  <div className={styles.regularNewsOverview}>
                    <div className={styles.regularNews}>
                      <div className={styles.regularNewsImageContainer}>
                        <img
                          src={item?.urlToImage}
                          alt="news"
                          className={styles.regularNewsImage}
                        />
                      </div>
                      <div className="flex justify-center">
                        <div className={styles.overlayTitle}>{item?.title}</div>
                      </div>
                      <div className={styles.regularNewzButtonContainer}>
                        <a
                          className={styles.regularNewsLink}
                          href={item?.url!}
                          target="_blank"
                        >
                          Read the news
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
      <div className={styles.loadMoreButtonContainer}>
        {newsStatus === 'loading' && <ClipLoader />}
        <div>
          <button
            className={styles.loadMoreButton}
            onClick={() => setPage((prevState) => prevState + 1)}
          >
            Load more
          </button>
        </div>
      </div>
    </>
  )
}
