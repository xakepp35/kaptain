import React from 'react';
import './App.css';
import {NavLink, Switch, Route} from 'react-router-dom';

import PodsTable from './PodsTable'

const App = () => (
	<div className="App">
		<header className="App-header">
			<a
				className="App-link"
				href="https://github.com/xakepp35/kaptain"
				target="_blank"
				rel="noopener noreferrer"
			>
				<img src="/logo.png" className="App-logo" alt="kaptain" />
				github
			</a>
			<NavLink
				className="App-link"
				to="/pods"
				rel="noopener noreferrer"
			>
				Pods
			</NavLink>
			<NavLink
				className="App-link"
				to="/nodes"
				rel="noopener noreferrer"
			>
				Nodes
			</NavLink>
		</header>
		<main className="App-main">
			<Switch>
				<Route exact path='/' component={PodsTable}/>
				<Route path='/pods' component={PodsTable}/>
			</Switch>
		</main>
	</div>
);

export default App;
