import React,{Component} from 'react';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';

//fetch
import {getData} from '../http/http';

import {message} from 'antd';

import {connect} from 'react-redux';

import {require} from '../fetchurl';

//引入头部组件
import Header from './Header';
import Home from './Home';

class List extends Component{
	
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = require;
		this.dispatch = props.dispatch;
	}
	
	componentDidMount(){
		const {history} = this.props;
		getData(this.url)
			.then((data)=>{
				if(data.code === 300){
					history.push('/');
					this.dispatch({type:'CURRENT_USER', user: []})
				}else if(data.code === 200 ){
					this.dispatch({type:'CURRENT_USER', user: data.user})
				}
			})
	}
	
	render(){
		return(
				<div>
					<Header />
					<Home />
				</div>
		)
	}
}

const routerList = withRouter(List);

export default connect()(routerList);