import React,{Component} from 'react';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {withRouter} from 'react-router-dom';
//fetch
import {postData, getData} from '../http/http';

import {adminDetail, adminUpdate} from '../fetchurl';
//antd
//redux
import {connect} from 'react-redux';

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
		width:'85%',
		margin:'10px auto',
		verticalAlign:'middle'
	},
	tag:{
		width:'29%',
		margin:'10px 5px',
		verticalAlign:'middle'
	},
	i:{
		verticalAlign:'middle'
	},
	is:{
		opacity:"0"
	},
	_id:{
		display:'none'
	}
}

class ArcticleUpdate extends Component{
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = adminUpdate;
	}
	componentWillMount(){
		let id = this.props.match.params.id;
		let fetch = `${adminDetail}?id=${id}`;
		getData(fetch)
			.then((data) =>{
				if(data.code === 200){
					this.props.setDetail(data.data);
					this.props.setTitle(`更新:${data.data.title}`);
				}
			})
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const {history} = this.props;
	    this.props.form.validateFields((err, values) => {
	    		if(!err){
	    			postData(this.url, values)
	    				.then((data) => {
	    					this.props.postUpdate(values);
	    					message.success('文章更新成功！');
	    					history.push(`/list/detail/${this.props.match.params.id}`);
	    				})
	    				.catch((err) => {
	    					message.error('文章更新失败！');
	    				})
	    		}
	    })
	}
	
	dropUpdate = () => {
		const {history} = this.props;
		history.goBack();
	}
	
	render(){
		const { getFieldDecorator } = this.props.form;
		const {detail} = this.props;
		
		return(
			<div style={styles.container}>
				<Form onSubmit={this.handleSubmit}>
					<br />
		          	<div>
		          		<i style={styles.i}>文章标题 : {detail.title}</i>
		           	</div>
		           	<br />
		          	<div>
		          		<i style={styles.i}>文章描述 : {detail.distract}</i>
		           	</div>
		           	<br />
		          	<div>
		          		<i style={styles.i}>背景图片 : {detail.image}</i>
		           	</div>
		           	<br />
		          	<div>
		          		<i style={styles.i}>文章标签 : {detail.tags !== undefined && detail.tags.map((item, i) => <span key={i}>{item}&#12288;</span>)}</i>
		           	</div>
		           	<br />
		           	<p style={styles.i}><i>文章正文 : </i></p>
			        <FormItem>
			          {getFieldDecorator('content' ,{
			          		initialValue: detail.content,
					       rules: [{ required: true, message: '不能为空!' }],
					    })(
			           		<TextArea style={styles.input} rows={15} placeholder="文章正文(支持markdown语法！)" />
			          )}
			        </FormItem>
			        <FormItem>
			          {getFieldDecorator('_id' ,{
			          		initialValue: detail._id,
					       rules: [{ required: true, message: '不能为空!' }],
					    })(
			           		<Input style={styles._id} />
			          )}
			        </FormItem>
			        <Button type="primary" htmlType="submit">
		           		保存修改
		          	</Button>
		          	 &#12288;&#12288;
		          	<Button type="primary" onClick={this.dropUpdate}>
		           		放弃修改
		          	</Button>
				</Form>
			</div>
		)
	}
}

const arcticleUpdate = Form.create()(ArcticleUpdate);
const routerUpdate = withRouter(arcticleUpdate);

const mapStateToProps = (state) => {
	return {
		detail:state.thisDetail
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		postUpdate: (values)=>{
			dispatch({type:'UPDATE_ITEM', _id: values._id, content: values.content});
		},
		setDetail: (item) => {
			dispatch({type:'THIS_DETAIL', item: item})
		},
		setTitle: (title) => {
			dispatch({type:'SET_TITLE', title: title})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(routerUpdate);