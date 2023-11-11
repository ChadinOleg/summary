import { useEffect, useState } from 'react';

import { copy, linkIcon, loader, tick } from '../assets';

import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });

  const [articles, setArticles] = useState([]);

  const [copies, setCopy] = useState('');
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));

    if (articlesFromLocalStorage) {
      setArticles(articlesFromLocalStorage);
    }
  }, []);
  console.log(articles);

  const handleCopy = url => {
    setCopy(url);
    navigator.clipboard.writeText(url);
    setTimeout(() => setCopy(''), 2000);
  };

  console.log(copies);
  const handleSubmit = async e => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = {
        ...article,
        summary: data.summary,
      };

      const updatedArticles = [...articles, newArticle];

      setArticles(updatedArticles);
      setArticle(newArticle);

      localStorage.setItem('articles', JSON.stringify(updatedArticles));
    }
  };
  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search*/}

      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt='linkIcon'
            className='absolute left-0 my-2 ml-3 w-5'
          />
          <input
            type='url'
            placeholder='Enter a URL'
            value={article.url}
            onChange={e => setArticle({ ...article, url: e.target.value })}
            required
            className='url_input peer'
          />

          <button
            type='submit'
            className='submit_btn  peer-focus:border-gray-700  peer-focus:text-gray-700'
          >
            <p>↵</p>
          </button>
        </form>

        {/* Browser URL History */}

        <div className='flex flex-col gap-1 max-h-40 overflow-y-auto'>
          {articles.map((item, index) => (
            <div
              className='link_card'
              key={`link- ${index}`}
              onClick={() => setArticle(item)}
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                  src={copies == item.url ? tick : copy}
                  alt='copy_icon'
                  className='w-[40%] h-[40%]'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Display Results */}

      <div className='my-10m max-w-full  justify-center items-center flex mt-10'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain  ' />
        ) : error ? (
          <p className='font-inter  font-bold text-center text-black'>
            Well that wasn't suppose happen <br />
            <span className=' font-satoshi font-normal text-gray-700 '>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 mt-4 mb-3 pl-1'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>

              <div className='summary_box mb-10'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
