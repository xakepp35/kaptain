import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";

import store from "./store/index";
import App from './components/App';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

require("typeface-jetbrains-mono");

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
  document.getElementById('root')
);
