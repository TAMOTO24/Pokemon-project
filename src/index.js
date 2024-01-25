import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Title from './components/title';
import Table from './components/table';
import styles from './components/assets/global.module.css';
import { DataProvider } from './components/common/dataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DataProvider>
      <Title/>
      <Table/>
    </DataProvider>
  </React.StrictMode>
);

reportWebVitals();
