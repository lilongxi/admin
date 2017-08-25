import React,{Component} from 'react';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';
//fetch
import {postData} from '../http/http';
//antd

//redux
import {connect} from 'react-redux';

//url
import {adminPost} from '../fetchurl';

import { Input,Form,Button,message} from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;

const styles = {
	container:{
		width:'85%',
		height:'auto',
		margin:'10px auto'
	},
	input:{
		width:'100%',
		margin:'10px auto',
		verticalAlign:'middle'
	},
	inline:{
		width:'50%',
		display:'inline-block'
	},
	inputcon:{
		width:'100%'
	},
	tag:{
		width:'95%',
		margin:'10px auto',
		verticalAlign:'middle'
	},
	i:{
		verticalAlign:'middle'
	},
	is:{
		opacity:"0"
	}
}

class ArcticleAdd extends Component{
	constructor(){
		super();
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const {history, setTitle, setCount, addItem} = this.props;
	    this.props.form.validateFields((err, values) => {
	    		if(!err){
	    			postData(adminPost, values)
	    				.then((data)=>{
	    					console.log(data)
	    					if(data.code === 200){
	    						addItem(data.data);
	    						setCount(data.count);
	    						message.success('添加成功,3秒后跳转到详情页！');
	    						setTimeout(() => {
	    							history.push(`/list/detail/${data.data._id}`);
	    							//更换标题
	    							setTitle(data.data.title);
	    						},3000);
	    						
	    					}else if(data.code === 300 ){
	    						history.push('/');
	    					}else if(data.code === 400){
	    						message.warning(`对不起,您${data.info}`);
	    					}else{
	    						message.error(`${data.info}`);
	    					}
	    				})
	    				.catch((err)=>{
	    					console.log(err)
	    				})
	    			
	    		}
	    })
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const {user} = this.props;
		return(
			<div>
				{
					(user.role && user.role < 50) ?
					(<div>对不起,您的权限不够暂时不能访问此页面!!!</div>) :
					(
					<div style={styles.container}>
						<Form onSubmit={this.handleSubmit}>
							<div style={styles.inline}>
								<FormItem>
						          {getFieldDecorator('title', {
								       rules: [{ required: true, message: '不能为空!' }],
								    })(
						          	<div style={styles.inputcon}>
						          		<i style={styles.i}>文章标题 : </i>
						           		<Input style={styles.tag} placeholder="文章标题"/>
						           	</div>
						          )}
						        </FormItem>
						        <FormItem>
						          {getFieldDecorator('distract',{
								       rules: [{ required: true, message: '不能为空!' }],
								    })(
						          	<div style={styles.inputcon}>
						          		<i style={styles.i}>文章描述 : </i>
						           		<Input style={styles.tag}  placeholder="文章描述"/>
						           	</div>
						          )}
						        </FormItem>
						        <FormItem>
						          {getFieldDecorator('image',{
								       rules: [{ required: false, message: '不能为空!' }],
								    })(
						          	<div style={styles.inputcon}>
						          		<i style={styles.i}>背景图片 : </i>
						           		<Input style={styles.tag} placeholder="背景图片"/>
						           	</div>
						          )}
						        </FormItem>
						    </div>
						    <div style={styles.inline}>
						        <FormItem>
						          {getFieldDecorator('tag_01',{
								       rules: [{ required: false, message: '不能为空!' }],
								    })(
						          	<div style={styles.inputcon}>
						          		<i style={styles.i}>文章标签 : </i>
						           		<Input  style={styles.tag} placeholder="文章标签" />
						           	</div>
						          )}
						        </FormItem>
						        <FormItem>
						          {getFieldDecorator('tag_02',{
								       rules: [{ required: false ,message: '不能为空!'}],
								    })(
								    	<div style={styles.inputcon}>
								    		<i style={styles.is}>文章标签 : </i>
						           		<Input  style={styles.tag} placeholder="文章标签" />
						           	</div>
						          )}
						        </FormItem>
						        <FormItem>
						          {getFieldDecorator('tag_03',{
								       rules: [{ required: false,message: '不能为空!' }],
								    })(
								    	<div style={styles.inputcon}>
								    		<i style={styles.is}>文章标签 : </i>
						           		<Input  style={styles.tag} placeholder="文章标签" />
						           	</div>
						          )}
						        </FormItem>
						    </div>
					        <FormItem>
					          {getFieldDecorator('content',{
							       rules: [{ required: true, message: '不能为空!' }],
							    })(
					          	<div>
					          		<i style={styles.i}>文章正文 : </i>
					           		<TextArea style={styles.input} rows={15} placeholder="文章正文(支持markdown语法！)" />
					           	</div>
					          )}
					        </FormItem>
					        <Button type="primary" htmlType="submit">
				           		保存
				          	</Button>
						</Form>
					</div>
					)
				}
			</div>
		)
	}
}

const arcticleAdd = Form.create()(ArcticleAdd);
const routerAdd = withRouter(arcticleAdd);

const mapStateToProps = (state) => {
	return {
		user: state.currentUser
	}
}

const mapDispatchToProps =  (dispatch) => {
	return {
		setTitle:(title) => {
			dispatch({type:'SET_TITLE', title: title});
		},
		setCount:(count) => {
			dispatch({type:'SET_COUNT', count: count});				
		},
		addItem:(item) => {
			dispatch({type:'ADD_ITEM', item: item});
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(routerAdd);