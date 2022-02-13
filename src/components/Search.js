import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [term, setTerm] = useState('flowers');
  const [results, setResults] = useState([]);
  const requestDelay = 1000;

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
            className="ui button">
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">{result.title}</div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  useEffect(() => {
    const search = async () => {
      const data = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          origin: '*',
          format: 'json',
          srsearch: term,
        },
      });

      setResults(data.data.query.search);
    };

    if (term && !results.length) {
      search();
    } else {
      const timeoutId = setTimeout(() => {
        if (term) {
          search();
        }
      }, requestDelay);

      // this is the cleanup function feature of the useEffect hook. NICE.
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [term]);

  return (
    <div>
      <div className="ui form">
        <div className="field"></div>
        <label>Enter Search Term</label>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="input"
        />
      </div>
      <div className="ui celled list">{renderedResults}</div>
    </div>
  );
};

export default Search;
