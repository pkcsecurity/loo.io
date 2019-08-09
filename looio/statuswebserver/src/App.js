/** @jsx jsx */

import { useState, useEffect, useRef } from 'react';
import { jsx, css } from '@emotion/core';
import Favicon from 'react-favicon';

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

const favicons = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAACBFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsK6l4AAAAq3RSTlMA84/7z/z+BgENuPoQB832DvTZAxLl+PHJAmzmOBH5pR4bxtqInIyHPf06yOThlgWA4HZ4NzF7bkNHbU/X0Ot5UPLYx8ElaxoWv1FSoRxkJAjcsxexVMRKQqffNpHei7k8b5M1sFgfJ0uYc1Mw4nAMlYIvozME0kFGKpsyaUAh7H5arSif1YaFXxWdSePwnuoKZ9PbrJIgVWiZ6MtdpK4mukju1IHtYDtmqXoaSc6YAAACR0lEQVRIx7XV9XPbMBQHcAXsxEkahiZpAw0X163MvDK3Y2ZmZmZmZvz+k5Pjuy3LdZH8w96dbcmnz9mS3rMJWSiKGosdjoqWIsIdY+3Ihj7KK4ra0dYqSV090Bs4SSPaLPK11IkAJylGq9IYRi8n0UBSGnZ0qyc+7hfrUhojKOMkLegpzU4/hgHeRdbDOWy3j8Rg5V1kEtUrW2ldyr/9hkCvRlM2YCD/LepMGvwOW99ytijx4q8QljHJOuxw/+lJceiZpAODud0aUTCySBW25XZ3o5L5lDAW53YPQcsk2+E0nj13nrYmH86SCV0owiSuPThzCXfuE/KAJuVNnOTYl0UIkwq8Jq4Y5p7qhH4OEskIM+PoI8/wyPUYHVz5ZcZnSSO+e4XnY16IPJl5C5jyJzCPl5NPcBunOUgCH/GhnKZK54xNbICJLVz3oMUs+YRuSxIX3TqzhUma4Bz0CpG3SN5wiPVkCFuYpBrXyBuEdaHoVUwTshcrWMIfxCkiz+Su24c6QraKPlZtrsdKmrlDwPXLysz1aGYQLdbSczojV+QJJRmqCwtjLUrk64UrDuux7J16eAoXzCZU5g9Yg1UFyRJszL+1Gg0FyQYsEJ0FibTZnA/MJgtHmgHkJy3gUYxzf/0o+YGvtNDSasg8Xewv6FdDpvGdvMeoGjIHr3vChuMqiBF4QXepdh8/oUem/IgVSVUER2sO64SDasgU/dRqsV8NaUaoKYAEHwniWxoekpLzZRcfictjU8R/IFi1k/eHHPd4Uv8s+V+MMtjOXhuqbAAAAABJRU5ErkJggg==',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAABs1BMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFrUzHAAAAkHRSTlMADQ4RyQcG8/78z/m4AvIc8eDGawzH2lJRAfQD5+jDFUWoeifiZFoKbptKbapP10vQBFAQ2Cv2G/2HjWx7l80XtdkgKqHAN7o+5dI7PWruQ+33kB8uqUheBZjCectw3BSAOCH4htN2vop+xSVd5DbftMgkzoXbJjV3GiyfTAtf3mZnjsTBQnigYpUZgikTWelVWZeWAAAB9klEQVRIx7XUZXcTQRQG4DfJatJG2zSN1Wmpu9BShyru7u7uUNzh/cnsbgqccODsnQ/cD7uzs/OcmbkjwN9Cb9Oy2VsdOsQR66UX4RGp0HvZ3RUI9A8ybAhJG7sH3HdohuNCorGrVMiwWkhMBkqFIKPqJC4eWH+pUMOkkHRwMORNP82UNMlhzmSCwZo0J6VJxki4tJSTj+TLb4xXm2YyZeC/xd75azbXw24+NOsvUr/alyJa7yd2jFq7myp/fuWG9jG+x4dUsLG8opObfchO1pVXPGbCh2znVHlFjrbvwDb8UUP6kG2sAIrJ9QQUiwIS2mXHcJz1v3vwJWjgEVxigwrZz3RtzI7UKZDKZq5gmscUCM5yo3Mcz6mQK5ZZ1ZfnKQWCy7yKi05XCqSFF9DkdKVAgpZ1GofZokCcRidxwLsoFUjiYKtpfVIiPH9imIuYIldWGRERyz3CA1j0jvKYiLxMRHkDWOPy0tKYISLAc3YCm/hOeC255BUngJvMKJAFPgXucU6BvOYDIMutCuQJ77pzudMnJ9dp38ezF3woJ85jSy3eWsO3VYh7Pc27UIEUQvj6nR8UyBv3Nv7Ggi4nc5HRVWBZlOgIDeg8g8/Mf5nNc0hAjrKxaoIactPuRl6QzKXH2/PtQOBjIf6+VZTlHs3U2v/59wdL/64FvF/dgQAAAABJRU5ErkJggg=='
];

const upstairsBathroomWebUrl = `http://looiotop.local`;
const downstairsBathroomWebUrl = `http://looiobottom.local`;

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
  }, 1500);

  useEffect(() => {
    //poll webservers
    fetch(upstairsBathroomWebUrl)
      .then(response => {
        return response.text();
      })
      .then(response => {
        //console.log('response', response);
        setUpstairs(response);
      })
      .catch(error => {
        //console.log('error', error);
        setUpstairs('unknown');
      });

    fetch(downstairsBathroomWebUrl)
      .then(response => {
        return response.text();
      })
      .then(response => {
        //console.log('response', response);
        setDownstairs(response);
      })
      .catch(error => {
        //console.log('error', error);
        setDownstairs('unknown');
      });
  }, [counter]);

  return (
    <div className='App'>
      <Favicon url={favicons[counter % 2]} />
      <div css={headerStyle}>
        loo.io
        <div class='boyPee' />
        <div class='girlPee' />
      </div>
      <div css={statusStyle}>
        <div css={bathroomNameStyle}>Upstairs</div>
        <div css={occupiedOrVacantStyle}>
          {upstairs === 'Occupied' && (
            <img src={occupied} width={400} height={100} alt='occupied' />
          )}
          {upstairs === 'Vacant' && (
            <img src={vacant} width={400} height={100} alt='vacant' />
          )}
          {upstairs === 'unknown' && (
            <span role='img' aria-label='shrug'>
              🤷🏻‍♀️
            </span>
          )}
          {!upstairs && (
            <div className='rotating'>
              <span role='img' aria-label='polling'>
                🧐
              </span>
            </div>
          )}
        </div>
      </div>
      <div css={statusStyle}>
        <div css={bathroomNameStyle}>Downstairs</div>
        <div css={occupiedOrVacantStyle}>
          {downstairs === 'Occupied' && (
            <img src={occupied} width={400} height={100} alt='occupied' />
          )}
          {downstairs === 'Vacant' && (
            <img src={vacant} width={400} height={100} alt='vacant' />
          )}
          {downstairs === 'unknown' && (
            <span role='img' aria-label='shrug'>
              🤷🏻‍♀️
            </span>
          )}
          {!downstairs && (
            <div className='rotating'>
              <span role='img' aria-label='polling'>
                🧐
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
