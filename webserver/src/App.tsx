import React from 'react';

import {Helmet} from 'react-helmet';
import Routes from './routes';

import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/themes/md-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './App.css';
import env from 'react-dotenv';

const TITLE = `${env.APP_NAME}`;

function App() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <Routes />
    </>
  );
}

export default App;
