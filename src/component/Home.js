import React,{Component} from 'react';
import { Menu, Icon } from 'antd';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

//redux
import {connect} from 'react-redux';

//action
import {setTitle, initList} from '../action';

//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {getData} from '../http/http';

import ArcticleDetail from './ArcticleDetail';
import ArcticleUpdate from './ArcticleUpdate';

import {adminList} from '../fetchurl';

import { message } from 'antd';

//主体组件
//文章列表
import ArcticleTable from './ArcticleTable';
import ArcticleAdd from './ArcticleAdd';
import ArcticleSearch from './ArcticleSearch';
import ArcticleTag from './ArcticleTag';
import TagArcticle from './TagArcticle';
import ArcticleUsers from './ArcticleUsers';

const styles = {
	menu:{
		width:'20%',
		height:'100%',
		display:'inline-block',
		verticalAlign: 'top',
		border: '0px solid transparent'
	},
	rest:{
		width:'80%',
		height:'100%',
		display:'inline-block',
		verticalAlign: 'top'
	},
	link:{
		display:'inline-block'
	},
	container:{
		width:'100%',
		height:'100%'
	}
}

class Home extends Component{
	  constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = `${adminList}?item=5&page=0`;
	  }
	  //获取初始数据
	  componentWillMount(){
	  	const {SetFetchList, SetCount} = this.props;
		getData(this.url)
			.then((data)=>{
				if(data.code === 200){
					SetCount(data.count);
					SetFetchList(data.data);
				}else{
					message.error(`${data.info}`);
				}
				
			})
			.catch((err)=>{
				console.log(err)
			})
	  }
	  state = {
	    mode: 'inline'
	  }
	  handleClick =(e)=> {
		let key = e.key;
		//将选择的key，dispatch
		this.props.setTitle(key);
	  }
	  render(){
	  	//获取provider返回的theme
	  	const {themeUse} = this.props;
	  	
	  	return(
	  	<Router >
	  		<div style={styles.container}>
		        <Menu
		          style={styles.menu}
		          defaultSelectedKeys={['1']}
		          defaultOpenKeys={['sub1']}
		          mode={this.state.mode}
		          theme={themeUse}
		          onClick={this.handleClick}
		        >
		          <Menu.Item key="文章列表">
		            <Icon type="bars" />
		            <Link style={styles.link} to='/list/arcticle' >文章列表</Link>
		          </Menu.Item>
		          <Menu.Item key="文章新增">
		            <Icon type="calendar" />
		            <Link style={styles.link} to='/list/add' >文章新增</Link>
		          </Menu.Item>
		          <Menu.Item key="文章标签">
		            <Icon type="book" />
		            <Link style={styles.link} to='/list/tags' >文章标签</Link>
		          </Menu.Item>
		          <Menu.Item key="文章搜索">
		            <Icon type="hdd" />
		            <Link style={styles.link} to='/list/search' >文章搜索</Link>
		          </Menu.Item>
		          <Menu.Item key="注册列表">
		            <Icon type="user" />
		            <Link style={styles.link} to='/list/registerlist' >注册列表</Link>
		          </Menu.Item>
		        </Menu>
		        <div style={styles.rest}>
		        		<Switch>
	        				<Route path='/list/arcticle' component={ArcticleTable} />
	        				<Route path='/list/add' component={ArcticleAdd} />
	        				<Route path='/list/tags' component={ArcticleTag} />
	        				<Route path='/list/search' component={ArcticleSearch} />
	        				<Route path='/list/registerlist' component={ArcticleUsers} />
	        				<Route path='/list/detail/:id' component={ArcticleDetail} />
	        				<Route path='/list/update/:id' component={ArcticleUpdate} />
	        				<Route path='/list/taging/:tag' component={TagArcticle} />
	        			</Switch>
		        </div>
		    		</div>
		    < /Router>
	  	)
	  }
}

//接受provider传入的state，
const mapStateToProps = (state) => {
	return {
		themeUse: state.themeUse
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setTitle:(title)=>{
			dispatch(setTitle(title))
		},
		SetFetchList:(items) => {
			dispatch(initList(items))
		},
		SetCount:(count) =>{
			dispatch({type:'SET_COUNT', count: count})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);