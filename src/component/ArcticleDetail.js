import React,{Component} from 'react';
import {withRouter, Link} from 'react-router-dom';

import {getData, postData} from '../http/http';

import moment from 'moment';

import {connect} from 'react-redux';

//url
import {adminDetail, userComment} from '../fetchurl';

import {Button, Icon, Input, Form, message} from 'antd';
const FormItem = Form.Item;

//highlight
//import Highlight from '../highlight/index';

const styles = {
	container:{
		width:'95%',
		height:'auto',
		backgroundColor:'#ecf6fd',
		margin:'20px auto',
		borderRadius:'5px',
		padding:'15px'
	},
	alink:{
		cursor: 'pointer'
	},
	btn:{
		marginLeft:'2.5%',
	},
	comment:{
		width:'95%',
		minWidth:'240px',
		marginLeft:'2.5%',
		position:'relative',
		top:'0',
		left:'0',
		display:'inline-block'
	},
	commentInput:{
		width:'50%'
	},
	reply:{
		
	}
}

class ArcticleDetail extends Component{
	
	constructor(){
		super();
		//hiddenReplay，控制回复还是评论，idReplay暂存回复人和被回复人的id
		this.state = {
			hiddenReplay:false,
			disable:false,
			idReplay:{}
		}
	}

	componentWillMount(){
		let id = this.props.match.params.id;
		let fetch = `${adminDetail}?id=${id}`;
		getData(fetch)
			.then((data) =>{
				if(data.code === 200){
					Object.assign(data.data, {comments: data.comments});
					this.props.setDetail(data.data);
					this.props.setTitle(`文章标题:${data.data.title}`)
				}
			})
	}
	
	goBack = () => {
		const {history} = this.props;
		history.goBack();
	}
	
	//提交评论
	handleSubmit = (e) => {
	    e.preventDefault();
	    let id = this.props.match.params.id,
			fromId = this.props.fromUser._id,
		 	username = this.props.fromUser.username;
	    this.props.form.validateFields((err, values) => {
	      if (!err) {
	      	Object.assign(values, {articleId: id, fromId: fromId});
	      	postData(userComment, values)
	      		.then((data) =>{
	      			if(data.code === 200){
	      				this.props.setComment(data.comment, username, fromId);
	      			}else{
	      				message.error('获取评论失败！')
	      			}
	      		})
	      }
	    });
	  }
	
	//回复功能
	repaly = (item) => {
		//from评论回复人,即当前登录人的id，to被评论者，即被回复的人的id， content回复的内容,
		//contentId当前被评论的id可通过此id判断是回复还是评论
		let from = this.props.fromUser._id,
			to = item.fromId;
		
		if(from === to._id){
			message.warning('不能回复自己！');
			this.setState({hiddenReplay:true,disable: true});
			return false;
		}else{
			let idReplay = {
				fromId:from,
				to:to._id,
				toUser:to.username,
				contentId:item._id
			}
			this.setState({hiddenReplay:true,idReplay:idReplay,disable: false});
		}
		
	}
	
	//提交回复
	handleSubmitReply = (e) => {
		e.preventDefault();
		let from = this.props.fromUser;
		
		this.props.form.validateFields((err, values) => {
			if(!err){
				Object.assign(values, this.state.idReplay);
				postData(userComment, values)
		      		.then((data) =>{
		      			if(data.code === 200){
		      				//获取当前被回复评论的id,和最后一个回复即是当前回复,回复人，被回复人
		      				this.props.setReply(this.state.idReplay, data.comment.reply.pop(), from)
		      			}else{
		      				message.error('获取评论失败！')
		      			}	
		      		})
			}
		});
	}
	
	render(){
		const {detail, fromUser} = this.props;
		const { getFieldDecorator } = this.props.form;
		return(
			<div>
			<div style={styles.container}>
				<div>
					文章描述: {detail.distract}
				</div>
				<div>
					阅读量:{detail.pv} | 评论量:{detail.comments !== undefined && detail.comments.length} | 文章状态:{ detail.control ? '开放评论' : '关闭评论' }
					<br />
					发布时间:{detail.meta !== undefined && moment(detail.meta.creatAt).format('YYYY/MM/DD HH:mm:ss')}  |  更新时间:{detail.meta !== undefined && moment(detail.meta.updateAt).format('YYYY/MM/DD HH:mm:ss')}
				</div>
				<div>
					文章标签: 
					{
						detail.tags !== undefined && 
						(detail.tags.map((item, i) => <span style={styles.alink} key={i}> <Link  to={`/list/taging/${item}`} > {item} </Link> </span>))
					}
				</div>
				<div>
					文章正文: 
					<div dangerouslySetInnerHTML={{__html:detail.contentHtml}} />
				</div>
			</div>
			{
				(fromUser.role && fromUser.role < 50 ) ?
				(<Button style={styles.btn} onClick={this.goBack} type="primary" icon="arrow-left">返回上步</Button>) :
				(
					<div>
						<div style={styles.btn}>
							{
								detail.comments !== undefined &&
								(detail.comments.length === 0 ? 
								'~暂无评论哦~' : 
								detail.comments.map((item, i) => 
								<div style={styles.reply} key={i}>
									<div>评论内容:{item.content} | 评论人:<span onClick={this.repaly.bind(this, item)}>{item.fromId.username}</span></div>
									<div>
										{
											item.reply !== 0 && item.reply.map((item, i) => 
											<p key={item._id}>
												<span>{item.from.username}&#12288;</span>回复给:<span>&#12288;{item.to.username}</span><br />
												<span>回复内容:{item.content}</span>
											</p>)
										}
									</div>
								</div>))
							}
						</div>
						<div style={styles.comment}>
							{/*
							  *根据hiddenReplay，控制是评论还是回复 ,false评论，true回复
							  * 待优化
							  * 	*/}
							{
								this.state.hiddenReplay ?
								(
								<Form onSubmit={this.handleSubmitReply}>
									<FormItem>
							          {getFieldDecorator('content', {
							            rules: [{ required: true, message: '回复内容!' }],
							          })(
							          	<Input style={styles.commentInput} size="large" placeholder="~回复哦~"  prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} disabled={this.state.disable} />
							          )}
							        </FormItem>
									<Button onClick={this.goBack} type="primary" icon="arrow-left">返回上步</Button>
									<Button style={styles.btn} type="primary" htmlType="submit">提交回复</Button>
									<Link to={`/list/update/${detail._id}`}>
										<Button style={styles.btn} type="primary" >修改文章<Icon type="arrow-right" /></Button>
									</Link>
							    </Form>
								) :
								(
								<Form onSubmit={this.handleSubmit}>
							        	 <FormItem>
							          {getFieldDecorator('content', {
							          	initialValue:'',
							            rules: [{ required: true, message: '请输入评论内容!' }],
							          })(
							          	<Input style={styles.commentInput} size="large" placeholder="~冒个泡~"  prefix={<Icon type="bulb" style={{ fontSize: 13 }} />} />
							          )}
							        </FormItem>
									<Button onClick={this.goBack} type="primary" icon="arrow-left">返回上步</Button>
									<Button style={styles.btn} type="primary" htmlType="submit">提交评论</Button>
									<Link to={`/list/update/${detail._id}`}>
										<Button style={styles.btn} type="primary" >修改文章<Icon type="arrow-right" /></Button>
									</Link>
							    </Form>
								)
							}
						</div>
					</div>
				)
			}
		</div>
		)
	}
}

const CommentForm = Form.create()(ArcticleDetail);

const arcticleDetail = withRouter(CommentForm);

const mapStateToProps = (state) =>{
	return {
		detail: state.thisDetail,
		fromUser: state.currentUser
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setDetail: (item) => {
			dispatch({type:'THIS_DETAIL', item: item})
		},
		setTitle: (title) => {
			dispatch({type:'SET_TITLE', title: title})
		},
		setComment:(comments, username, fromId) => {
			let result = {
				_id: fromId,
				username: username
			}
			Object.assign(comments, {fromId: result});
			dispatch({type:'SET_COMMENT', comments: comments});
			message.success('评论成功！');
		},
		setReply:(content, replyItem, from) => {
			//被回复的评论的id,评论人,回复人,回复内容
			let contentId = content.contentId,
				fromuser = from.username,
				fromid = from._id,
				touser = content.toUser,
				toid = content.to,
				contentd = replyItem.content;
			const replyToReducer = {
				content:contentd,
				from:{username:fromuser, _id: fromid},
				to:{username:touser, _id: toid},
				_id:replyItem._id
			}
			
			dispatch({type:'SET_REPLY', reply: replyToReducer, contentId: contentId});
			message.success('回复成功！');
			
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(arcticleDetail);
