/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef } from "react";
import "./App.css";
import InfiniteScroll from "./InfiniteScroll";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const controllerRef = useRef(null);

  const hanndleInput = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const renderItem = useCallback(({ title }, key, ref) => (
    <div ref={ref} key={key}>
      {title}
    </div>
  ));

  const getData = useCallback((query, pageNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        // is use to cancel the fetch request when the user types a new query before the previous request is completed.

        const promise = await fetch(
          "https://openlibrary.org/search.json?" +
            new URLSearchParams({
              q: query,
              page: pageNumber,
            }),
          { signal: controllerRef.current.signal }
        );
        const data = await promise.json();
        console.log(data);
        resolve();
        setData((prevData) => [...prevData, ...data.docs]);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  return (
    <>
      <input type="text" value={query} onChange={hanndleInput} />
      <InfiniteScroll
        renderListItem={renderItem}
        getData={getData}
        listData={data}
        query={query}
      />
    </>
  );
}

export default App;
