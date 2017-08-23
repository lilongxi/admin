import React,{Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';


//组件引入
import List from '../component/List';
import Login from '../component/Login';
import Register from '../component/Register';
import NotFound from '../component/404';

//增加页面路由控制
class RouterMap extends Component{
	render(){
		return(
			<Router>
				<div>
					<Route exact path='/' component={Login} />
					<Route path='/register' component={Register} />
					<Route path='/list' component={List} />
					<Route path='/404' component={NotFound} />
					{/*<Redirect from='*' to='/404' />*/}
				</div>
			</Router>
		)
	}
}

export default RouterMap;