/** @jsx jsx */

import React, { useState, useEffect, useRef } from 'react';
import { jsx, css } from '@emotion/core';

import './App.css';
import occupied from './occupied.png';
import vacant from './vacant.png';

const headerStyle = css`
  font-family: 'Beth Ellen', cursive;
  font-size: 5rem;
  margin-bottom: 10rem;
`;

const statusStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const bathroomNameStyle = css`
  font-family: 'Beth Ellen', cursive;
  font-size: 3rem;
  width: 25rem;
`;

const occupiedOrVacantStyle = css`
  display: flex;
  width: 45rem;
  font-size: 5rem;
  height: 10rem;
  align-items: center;
  justify-content: center;
`;

const rotatingStyle = css`
  -webkit-transform: rotate(360deg);
  -webkit-transition-duration: 1s;
  -webkit-transition-delay: now;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
`;

const upstairsBathroomWebUrl = `http://10.59.1.132`;
const downstairsBathroomWebUrl = `http://looiotop.local`;

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const App = () => {
  const [upstairs, setUpstairs] = useState(null);
  const [downstairs, setDownstairs] = useState(null);
  const [counter, setCounter] = useState(null);

  useInterval(() => {
    setCounter(counter + 1);
  }, 2000);

  useEffect(() => {
    //poll webservers
    fetch(upstairsBathroomWebUrl)
      .then(response => {
        return response.text();
      })
      .then(response => {
        console.log('response', response);
        setUpstairs(response);
      })
      .catch(error => {
        console.log('error', error);
        setUpstairs('unknown');
      });

    fetch(downstairsBathroomWebUrl)
      .then(response => {
        return response.text();
      })
      .then(response => {
        console.log('response', response);
        setDownstairs(response);
      })
      .catch(error => {
        console.log('error', error);
        setDownstairs('unknown');
      });
  }, [counter]);

  return (
    <div className='App'>
      <div css={headerStyle}>loo.io</div>
      <div css={statusStyle}>
        <div css={bathroomNameStyle}>Upstairs</div>
        <div css={occupiedOrVacantStyle}>
          {upstairs === 'Occupied' && (
            <img src={occupied} width={400} height={100} />
          )}
          {upstairs === 'Vacant' && (
            <img src={vacant} width={400} height={100} />
          )}
          {upstairs === 'unknown' && '🤷🏻‍♀️'}
          {!upstairs && <div className='rotating'>🧐</div>}
        </div>
      </div>
      <div css={statusStyle}>
        <div css={bathroomNameStyle}>Downstairs</div>
        <div css={occupiedOrVacantStyle}>
          {downstairs === 'Occupied' && (
            <img src={occupied} width={400} height={100} />
          )}
          {downstairs === 'Vacant' && (
            <img src={vacant} width={400} height={100} />
          )}
          {downstairs === 'unknown' && '🤷🏻‍♀️'}
          {!downstairs && <div className='rotating'>🧐</div>}
        </div>
      </div>
    </div>
  );
};

export default App;
