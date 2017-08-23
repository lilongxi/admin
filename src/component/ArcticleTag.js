import React,{Component} from 'react';
//性能优化
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {Link} from 'react-router-dom';

import {connect} from 'react-redux';

import {getData} from '../http/http';

import {adminTags} from '../fetchurl';

import { Tag } from 'antd';

const styles = {
	center:{
		width:'80%'
	}
}

class ArcticleTag extends Component{
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.url = adminTags;
		this.dispatch = props.dispatch;
	}
	
	componentWillMount(){
		getData(this.url)
			.then((data) => {
				if(data.code === 200) {
					this.props.setTags(data.tags);
					this.props.setTitle();
				}
			})
			.catch((err) => {
				console.log(err)
			})
	}
	
	render(){
		const {taglist} = this.props;
	
		return(
			<div>
				<br />
				<center style={styles.center}>
				{
					taglist.length !== 0 ? 
					taglist.map((tag, i) =>
						<Tag color="blue" key={i}><Link to={`/list/taging/${tag}`}> {tag}</Link></Tag>
					) :
					<h3>暂无可选择标签!</h3>
				}
				</center>
				<br />
			</div>
		)
	}
}

const mapStateToProps = (state) =>{
	return {
		taglist: state.thisTags
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		setTags:(tags) => {
			dispatch({type:'THIS_TAGS', tags:tags})
		},
		//更换标题
		setTitle:() => {
			dispatch({type:'SET_TITLE', title:'文章标签'})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ArcticleTag);