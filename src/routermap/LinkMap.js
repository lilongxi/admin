import React,{ Component } from 'react';
import {Link} from 'react-router-dom';


class LinkMap extends Component{
	render(){
		const {children, to} = this.props;
		
		return(
			<Link to={to} >{children}</Link>
		)
	}
}

export default LinkMap;