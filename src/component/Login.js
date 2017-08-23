import React,{Component} from 'react';
import { Form, Icon, Input, Button, Checkbox, message} from 'antd';
import LinkMap from '../routermap/LinkMap';
import {withRouter} from 'react-router-dom';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';
//fetch
import {postData} from '../http/http';

import {adminLogin} from '../fetchurl';

const FormItem = Form.Item;

const styles = {
	title:{
		textAlign:'center',
		padding:'20px 0'
	},
	loginform:{
		maxWidth:"300px",
		position:'relative',
		top:'50%',
		left:'50%',
		transform: 'translate(-50%, 50%)'
	},
	loginformforgot:{
		float: 'right'
	},
	loginformbutton:{
		width: '100%'
	}
}

class NormalLoginForm extends Component{
	
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = adminLogin;
	}
	
	handleSubmit = (e) => {
	    e.preventDefault();
	    
	    const { history } = this.props;
	    
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	    
	        postData(this.url, values)
	        		.then((data)=>{
	        			if(data.code === 100){
	    					message.error(`${data.info}`);
	    					return;
	    				}
	    				if(data.code === 200){
	    					message.success(`恭喜您${data.data.username},您已经登陆成功!`);
	    					history.push({
	    						pathname: '/list/arcticle',
	    						query:{
	    							info:data.data
	    						}
	    					});
	    					return;
	    				}
	        		})
	        		.catch((err)=>{
	        			message.warning(`注册失败,请您稍后重试!`);
	        		})
	      }
	    });
	  }
	
	render(){
		const { getFieldDecorator } = this.props.form;
		return(
				<div>
				      	 <Form onSubmit={this.handleSubmit} style={styles.loginform}>
				      	 	<h2 style={styles.title}><i>欢迎回来</i></h2>
					        <FormItem>
					          {getFieldDecorator('username', {
					            rules: [{ required: true, message: '请输入用户名!' }],
					          })(
					            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
					          )}
					        </FormItem>
					        <FormItem>
					          {getFieldDecorator('password', {
					            rules: [{ required: true, message: '请输入密码!' }],
					          })(
					            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
					          )}
					        </FormItem>
					        <FormItem>
					          {getFieldDecorator('remember', {
					            valuePropName: 'checked',
					            initialValue: true,
					          })(
					            <Checkbox>记住我</Checkbox>
					          )}
					          <a style={styles.loginformforgot} href="">忘记密码</a>
					          <Button type="primary" htmlType="submit" style={styles.loginformbutton}>
					           现在就登陆
					          </Button>
					          <LinkMap to="/register" >现在注册!</LinkMap>
					        </FormItem>
					     </Form>
				</div>
		)
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default withRouter(WrappedNormalLoginForm);