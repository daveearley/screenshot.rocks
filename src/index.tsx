import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Global} from "@emotion/core";
import {styles} from "./styles";
import {Layout} from "./components/layout";

ReactDOM.render(
  <React.StrictMode>
      <Global styles={styles()}/>
      <Layout/>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
