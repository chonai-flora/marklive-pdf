import React from 'react';

import './App.css';
import Editor from './components/Editor';
import headerImg from './assets/header.png';

const App = () => {
  // eslint-disable-next-line
  const openVersionWebsite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target && e.target.value) {
      window.location.href = e.target.value;
    }
  };

  return (
    <div>
      <header className='header'>
        <img src={headerImg} alt='Header Image' />
      </header>

      <div className='warpper'>
        <Editor />
      </div>

      <footer className='footer'>
        <hr />
        Copyright (c) 2020 uiw<br />
        Released under the&nbsp;
        <a href='https://github.com/uiwjs/react-md-editor/blob/master/LICENSE'>
          MIT license
        </a>
      </footer>
    </div>
  );
}

export default App;