import React,{Component} from 'react';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {Link} from 'react-router-dom';

import {getData} from '../http/http';

import {connect} from 'react-redux';

//url
import {adminSearch} from '../fetchurl';

import { Input, Icon,Table } from 'antd';

const styles = {
	search:{
		padding:'20px 20px 0 20px'
	}
}

class ArcticleSearch extends Component{
	constructor(){
		super();
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = `${adminSearch}?`;
		this.state = {ksd:'~搜索您想要的内容~'}
		
	}
	
	componentDidMount(){
		let searchComponent = this.refs.search;
		document.addEventListener('keyup', (e) => {
			
		})
	}
	
	handlechage = (e) => {
		let keyword = e.target.value;
		let usearch = `${this.url}keyword=${keyword}`;
		if(keyword){
			this.setState({ksd:'~没有搜索您想要的内容~'});
			getData(usearch)
				.then((data) => {
					if(data.code === 200){
						this.props.setSearch(data.data)
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}else{
			this.setState({ksd:'~搜索您想要的内容~'});
			this.props.setSearch([]);
		}
	}
	
	render(){
		const {searchArt} = this.props;
		
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
		},{
		  title: '文章标签',
		   key:'tags',
		  dataIndex: 'tags',
		  render: (text, record) => (
		  		<span>
		  			{
		  				record.tags.length !== 0 && 
		  				record.tags.map((tag, i) => 
		  				<Link to={{pathname:`/list/taging/${tag}`}}>{tag}&nbsp;</Link>
		  				)
		  			}
		  		</span>
		  )}, {
		  title: '发布时间',
		  key:'creatAt',
		  dataIndex: 'meta.creatAt'
		},{
		  title: '更新时间',
		  key:'updateAt',
		  dataIndex: 'meta.updateAt',
		}];
		
		return(
			<div>
				<div style={styles.search}>
				<Input
				    placeholder="input search text"
				    style={{ width: 200 }}
				    prefix={<Icon type="search" />}
				    onChange={this.handlechage}
				    ref="search"
				  />
				</div>
				<div style={styles.search}>
					{
						searchArt.length === 0 ? 
						<p>{this.state.ksd}</p>:
						<Table  columns={columns} dataSource={searchArt}  pagination={false} />
					}
				</div>
			</div>
		)
	}
}


const mapStateToProps = (state) => {
	return {
		searchArt: state.searchArt
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setSearch:(items) => {
			dispatch({type:'SEARCH_ARTICLE', search: items})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ArcticleSearch);