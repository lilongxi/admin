import React,{Component} from 'react';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';

//redux
import {connect} from 'react-redux';
//action
import {toggleStatus, deleteItem,pageItem} from '../action';
//fetch
import {postData, getData} from '../http/http';
//router
import {Link} from 'react-router-dom';
//url
import {adminStatusOne, adminRemoveOne, adminList} from '../fetchurl';

import { Table, message,Button,Pagination} from 'antd';

const styles = {
	btn:{
		display:'inline-block',
		verticalAlign:'top',
		padding:'10px'
	},
	pagination:{
		display:'inline-block',
		verticalAlign:'top',
		padding:'10px',
		minWidth:'450px',
	}
}

class ArcticleTable extends Component{

	constructor(){
		super();
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.statusone = adminStatusOne;
		this.removeone = adminRemoveOne;
		this.fetch = `${adminList}?`;
		this.state = {
			currentArr:[],
			item:5
		}
	}
	//改变评论可见状态
	handleStatus =(record)=> {
		let id = record._id,
			control = record.control;
		postData(this.statusone, {id: id, control: !control})
			.then((data) => {
				if(data.code === 200){
					this.props.SetStatus(id);
					message.success(`${data.info}`);
				}else{
					message.error(`${data.info}`);
				}
			})
			.catch((err) => {
				message.error(`更新失败`);
			})
		
	}
	//删除
	handleDel =(record)=> {
		let id = record._id;
		postData(this.removeone, {id: id})
			.then((data) => {
				if(data.code === 200){
					this.props.SetDelete(id);
					message.success(`${data.info}`);
				}else{
					message.error(`${data.info}`);
				}
			})
			.catch((err) => {
				message.error(`更新失败`);
			})
		
	}
	
	everyStatus = () => {
		let arry = this.state.currentArr;
		if(arry.length === 0){
			message.warning('请选择文章！');
			return false;
		}
		for(let i = 0, _ar; _ar = arry[i++];){
			this.props.SetStatus(_ar._id);
		}
	}
	
	everyDel = () => {
		let arry = this.state.currentArr;
		if(arry.length === 0){
			message.warning('请选择文章！');
			return false;
		}
		for(let i = 0, _ar; _ar = arry[i++];){
			this.props.SetDelete(_ar._id);
		}
	}
	
	onPagination = (pageNumber) =>{
		let item = this.state.item,
			skip = pageNumber;
		//跳过的条数
		let page = (skip - 1) * item;
		let fetch = `${this.fetch}item=${item}&page=${page}`;
		getData(fetch)
			.then((data) => {
				if(data.code === 200){
					this.props.SetCount(data.count);
					this.props.SetPage(data.data);
				}else{
					message.error(`${data.info}`);
				}
			})
			.catch((err) => {
				message.error(`更新失败`);
			})
		
	}
	
	handleRole = () => {
		message.warning('您权限不够，请及时联系管理员！');
	}
	
	render(){
	  const {TrackList, Count, user} = this.props;
	  const columns = [{
		  title: '文章标题',
		  dataIndex: 'title',
		  render:(text, record) => (
		  		<Link to={{pathname:`/list/detail/${record._id}`,query:record}}>
		  			<p dangerouslySetInnerHTML={{__html:text}} />
		  		</Link>
		)}, {
		  title: '文章描述',
		  dataIndex: 'distract',
		  render: text => <p dangerouslySetInnerHTML={{__html:text}} />,
		}, {
		  title: '发布时间',
		  dataIndex: 'meta.creatAt',
		  render: text => <span>{text}</span>
		},{
		  title: '更新时间',
		  dataIndex: 'meta.updateAt',
		},{
		  title: '浏览',
		  dataIndex: 'pv',
		},{
		  title: '评论状态',
		  dataIndex: 'control',
		  render:(text, record) => (
		  		//用户权限判断
		  	<span>
		  		{
		  			(user.role && user.role < 50) ?
		  			(<Button shape="circle" icon="close-circle" onClick={this.handleRole.bind(this)}/>) :
		  			(
		  				 <span>
					    		{
					    			text ?
					    			<Button shape="circle" icon="unlock" onClick={this.handleStatus.bind(this, record)}/> :
					    			<Button shape="circle" icon="lock" type="danger" onClick={this.handleStatus.bind(this, record)}/>
					    		}
					       
					    </span>
		  			)
		  		}
		  	</span>
	  	)},{
		  title: '删除',
		  dataIndex: 'delete',
		  render:(text, record) => (
			    <span>
			    		{
			    			(user.role && user.role < 50) ?
			    			(<Button shape="circle" icon="close-circle" onClick={this.handleRole.bind(this)}/>) :
			    			(<Button shape="circle" icon="delete" onClick={this.handleDel.bind(this, record)}/>)
			    		}
			    </span>
	  	)}
	  	];
	  	
	  	const rowSelection = {
			 onChange: (selectedRowKeys, selectedRows) => {
			    		this.setState({
			    			currentArr: selectedRows
			    		})
			  }
		};
		
		return(
				<div>
					<Table rowSelection={rowSelection} columns={columns} dataSource={TrackList} pagination={false} />
					{
						(user.role && user.role < 50 ) || 
						(
							<div style={styles.btn}>
								<Button onClick={this.everyStatus} >批量重置</Button>
								<span className="ant-divider" style={{ margin: '0 1em' }} />
								<Button onClick={this.everyDel} >批量删除</Button>
							</div>
						)
					}
					<div style={styles.pagination}>
						<Pagination showQuickJumper defaultCurrent={1} total={Count *10} onChange={this.onPagination} />
					</div>
					</div>
		)
	}
}


const mapStateToProps = (state) => {
	return{
		TrackList:state.trackList,
		Count:state.count,
		user: state.currentUser
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		//改变评论状态，true可评论，false不可评论
		SetStatus:(id) => {
			dispatch(toggleStatus(id))
		},
		//删除
		SetDelete:(id) => {
			dispatch(deleteItem(id))
		},
		//分页
		SetPage:(items) => {
			dispatch(pageItem(items))
		},
		SetCount:(count) =>{
			dispatch({type:'SET_COUNT', count: count})
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(ArcticleTable);