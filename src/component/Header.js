import React,{Component} from 'react';
import {withRouter} from 'react-router-dom';
//redux改变主题颜色
import {connect} from 'react-redux';
//action
import {setTheme} from '../action';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';

//fetch
import {getData} from '../http/http';

import {adminLogout} from '../fetchurl';

import { Avatar, Button, Modal, Switch } from 'antd';

const styles = {
	header:{
		width:'100%',
		height:'100px',
		backgroundColor:'#108ee9',
		position:'relative',
		top:'0',
		left:'0'
	},
	avatar:{
		position:'absolute',
		top:'50%',
		left:'30px',
		transform: 'translateY(-50%)'
	},
	title:{
		position:'absolute',
		top:'50%',
		left:'90px',
		transform: 'translateY(-50%)',
		color:'#fff',
		fontSize:'14px'
	},
	btn:{
		position:'absolute',
		top:'50%',
		right:'30px',
		transform: 'translateY(-50%)',
		color:'#fff',
		fontSize:'14px'
	},
	h1:{
		position:'absolute',
		top:'47.5%',
		left:'50%',
		transform: 'translate(-45%, -50%)',
		color:'#fff'
	}
}

class Header extends Component{
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = adminLogout;
		//获取dispatch,通过connect-redux传入
		this.dispatch = props.dispatch;
		//模态框显示隐藏
		this.state = { 
			visible: false,
			theme: false
		}
		
	}
	singOut =()=>{
		const {history} = this.props;
		let that = this;
		getData(this.url)
			.then((data) => {
				if(data.code === 200){
					that.setState({
				      visible: false,
				    });
				    history.push('/');
				}
			})
			.catch((err) => {
				console.log(err)
			})
	  }
	 showModal = () => {
	    this.setState({
	      visible: true,
	    });
	  }
	 hideModal = () => {
	    this.setState({
	      visible: false,
	    });
	  }
	 //改变主体颜色
	 changeTheme = () => {
	 	!this.state.theme ?
	 	(this.props.SetTheme('dark'), this.setState({theme: true})) :
	 	(this.props.SetTheme('light'), this.setState({theme: false}));
	 }
	 
	render(){
		
		const {user, titleUse} = this.props;
		
		return(
			<div style={styles.header}>
				<div>
					<Avatar style={styles.avatar} size="large" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
				</div>
				<div style={styles.title}>
					<span>欢迎您 {user.username} | {user.email}</span>
				</div>
				<div style={styles.btn}>
					<Switch 
          				onChange={this.changeTheme}
						checkedChildren="暗"
          				unCheckedChildren="亮"
					/>
					<span className="ant-divider" style={{ margin: '0 1em' }} />
					<Button onClick={this.showModal}>退出登陆</Button>
				</div>
				<h1 style={styles.h1}><b dangerouslySetInnerHTML={{__html:titleUse}} /></h1>
				<Modal
		          title={user.username}
		          visible={this.state.visible}
		          onOk={this.singOut}
		          onCancel={this.hideModal}
		          okText="确认"
		          cancelText="取消"
		        >
		          您是否确定退出登陆!
		        </Modal>
			</div>
		)
	}
}

const RouterHeader = withRouter(Header);

const mapStateToProps = (state) => {
	return{
		titleUse: state.titleUse,
		user: state.currentUser
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		SetTheme:(theme) => {
			dispatch(setTheme(theme))
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RouterHeader);
