import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Main from './components/main';
import styles from './components/assets/global.module.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <Main/>
  </React.StrictMode>
);

reportWebVitals();
