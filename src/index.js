import React from 'react';
import ReactDOM from 'react-dom';
//引入reducer
import {Provider} from 'react-redux';
import {store} from './reducer';
import App from './App';
import 'antd/dist/antd.less';


const render = () => ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	,document.getElementById('root')
);

store.subscribe(()=>{
	render
});

render();
