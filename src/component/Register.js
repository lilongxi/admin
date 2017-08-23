import React,{Component} from 'react';
import LinkMap from '../routermap/LinkMap';
import {withRouter} from 'react-router-dom';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';
//fetch
import {postData} from '../http/http';
import {adminRegister} from '../fetchurl';
//antd
import { Form, Input, Icon, Button, message } from 'antd';
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
		transform: 'translate(-50%, 10%)'
	},
	loginformforgot:{
		float: 'right'
	},
	loginformbutton:{
		width: '100%'
	}
}

class NormalRegisterForm extends Component{
	constructor(props){
		super(props);
		this.url = adminRegister;
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	state = {
	    confirmDirty: false
	  };
	  handleSubmit = (e) => {
	    e.preventDefault();
	    
	    const { history } = this.props;
	    
	    this.props.form.validateFieldsAndScroll((err, values) => {
	      if (!err) {
	    		postData(this.url, values)
	    			.then((data) => {
	    				if(data.code === 100){
	    					message.error(`${data.info}`);
	    					return;
	    				}
	    				if(data.code === 200){
	    					message.success(`恭喜您${data.data.username},您已经注册成功,3秒后页面将自动跳转到管理页面!`);
	    					setTimeout(()=>{
	    						history.push('/list/arcticle');
	    					}, 3000);
	    					return;
	    				}
	    				
	    			})
	    			.catch((err) => {
	    				message.warning(`注册失败,请您稍后重试!`);
	    			})
	      }
	    });
	  }
	  handleConfirmBlur = (e) => {
	    const value = e.target.value;
	    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	  }
	  checkPassword = (rule, value, callback) => {
	    const form = this.props.form;
	    if (value && value !== form.getFieldValue('password')) {
	      callback('请确认您的密码输入保持一致！');
	    } else {
	      callback();
	    }
	  }
	  checkConfirm = (rule, value, callback) => {
	    const form = this.props.form;
	    if (value && this.state.confirmDirty) {
	      form.validateFields(['confirm'], { force: true });
	    }
	    callback();
	  }

	render(){
    		const { getFieldDecorator } = this.props.form;
	
	    return (
	      <Form onSubmit={this.handleSubmit} style={styles.loginform}>
	      		<h2 style={styles.title}><i>欢迎来到注册页面</i></h2>
		      	<FormItem
		         label="用户姓名"
		          hasFeedback
		        >
		          {getFieldDecorator('username', {
		            rules: [{ required: true, message: '请输入用户姓名!', whitespace: true }],
		          })(
		            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
		          )}
		        </FormItem>
		         <FormItem
		          label="邮&#12288;&#12288;箱"
		          hasFeedback
		        >
		          {getFieldDecorator('email', {
		            rules: [{
		              type: 'email', message: '请输入合法邮箱!',
		            }, {
		              required: true, message: '请填写邮箱信息!',
		            }],
		          })(
		            <Input  placeholder="邮箱" prefix={<Icon type="edit" style={{ fontSize: 13 }} />} />
		          )}
		        </FormItem>
		        <FormItem
		          label="密&#12288;&#12288;码"
		          hasFeedback
		        >
		          {getFieldDecorator('password', {
		            rules: [{
		              required: true, message: '请输入密码!',
		            }, {
		              validator: this.checkConfirm,
		            }],
		          })(
		            <Input type="password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="密码" />
		          )}
		        </FormItem>
		        <FormItem
		          label="确认密码"
		          hasFeedback
		        >
		          {getFieldDecorator('confirm', {
		            rules: [{
		              required: true, message: '请确认密码!',
		            }, {
		              validator: this.checkPassword,
		            }],
		          })(
		            <Input type="password" onBlur={this.handleConfirmBlur} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="确认密码" />
		          )}
		        </FormItem>
		        <Button type="primary" htmlType="submit" style={styles.loginformbutton}>
	           		现在就注册
	         	</Button>
	         	<LinkMap to="/">已有账号!</LinkMap>
		      </Form>
		    );
	}
}

const WrappedNormalRegisterForm = Form.create()(NormalRegisterForm);

export default withRouter(WrappedNormalRegisterForm);