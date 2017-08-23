import React,{Component} from 'react';

import {connect} from 'react-redux';

import {adminuser} from '../fetchurl';

import {getData}  from '../http/http';

class ArcticleUsers extends Component{
	
	componentWillMount(){
		getData(adminuser)
			.then((data) => {
				if(data.code === 200){
					this.props.setUserlist(data.data);
				}
			})
	}
	
	render(){
		const {user, userlist} = this.props;
		return (
			<div>
				{
					(user.role && user.role < 50) ? 
					(<span>对不起,您权限不够!</span>) :
					(
						<div>
							{
								userlist.length !== 0 && 
								userlist.map((item, i) => <p key={i}>{item.username} | {item.email}</p>)
							}
						</div>
					)
				}
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.currentUser,
		userlist: state.userList
	}
}

const mapDispatchToProps =  (dispatch) => {
	return {
		setUserlist:(list) => {
			dispatch({type:'INIT_USERLIST', userlist: list})
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ArcticleUsers);

