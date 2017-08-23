import React,{Component} from 'react';

import {getData} from '../http/http';

import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import {adminTag} from '../fetchurl';

import { Table } from 'antd';

class TagArcticle extends Component {
	
	componentWillMount(){
		let fetch = `${adminTag}?tag=${this.props.match.params.tag}`;
		getData(fetch)
			.then((data) =>{
				if(data.code === 200){
					this.props.setTagArcticle(data.data);
					this.props.setTitle(`标签:${this.props.match.params.tag}`);
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}
	
	render(){
		const {tagArcticle} = this.props;
		
		const columns = [{
		  title: '文章标题',
		  dataIndex: 'title',
		  key:'title',
		  render:(text, record) => (
		  		<Link to={{pathname:`/list/detail/${record._id}`,query:record}}>
		  			<p dangerouslySetInnerHTML={{__html:text}} />
		  		</Link>
		)}, {
		  title: '文章描述',
		   key:'distract',
		  dataIndex: 'distract',
		  render: text => <p dangerouslySetInnerHTML={{__html:text}} />,
		}, {
		  title: '发布时间',
		  key:'creatAt',
		  dataIndex: 'meta.creatAt'
		},{
		  title: '更新时间',
		  key:'updateAt',
		  dataIndex: 'meta.updateAt',
		}];
		
		return (
			<div>
				<Table  columns={columns} dataSource={tagArcticle}  pagination={false} />
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		tagArcticle: state.tagArcticle
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setTagArcticle:(items) => {
			dispatch({type:'TAG_ARCTICLE', tagart: items})
		},
		setTitle: (title) => {
			dispatch({type:'SET_TITLE', title: title})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(TagArcticle);
