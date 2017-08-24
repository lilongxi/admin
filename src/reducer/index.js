import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';

const initialState = [];
const initialTheme = 'light';
const initialTitle = '文章列表';


//主体颜色选择
const themeUse = (state = initialTheme, action) => {
	switch(action.type){
		case 'SET_THEME':
			return action.theme;
		default:
			return state;
	}
}

//所选文章
const titleUse = (state = initialTitle, action) => {
	switch(action.type){
		case 'SET_TITLE':
			return action.title;
		default:
			return state;
	}
}

//获取文章总数
const count = (state = 0, action) => {
	switch(action.type){
		case 'SET_COUNT':
			return action.count;
		default:
			return state;
	}
}

//文章操作
const trackList = (state = initialState, action) => {
	switch(action.type){
		case 'INIT_LIST':
			return state.concat(action.fetchList);
		case 'TOGGLE_STATUS':
			return state.map(item => {
				if(item._id !== action._id){return item};
				return {
					...item,
					control: !item.control
				}
			});
		case 'DELETE_ITEM':
			return state.filter(item => item._id !== action._id);
		case 'ADD_ITEM':
			state.pop();
			return [
				action.item,
				...state
			]
		case 'PAGE_ITEM':
			return state = action.items;
		case 'UPDATE_ITEM':
			return state.map(item => {
				if(item._id !== action._id){return item};
				return {
					...item,
					content: action.content
				}
			});	
		default:
			return state;
	}
}

//detail
const thisDetail = (state={}, action) => {
	switch(action.type){
		case 'THIS_DETAIL':
			return state = action.item;
		case 'SET_COMMENT':
			return {
				...state,
				comments: [
					...state.comments,
					action.comments
				]
			}
		case 'SET_REPLY':
			return {
				...state,
				comments:state.comments.map((item, i) => {
					if(item._id !== action.contentId){return item}
					return {
						...item,
						reply:[
							...item.reply,
							action.reply
						]
					}
				})
			}
		default:
			return state;
	}
}

//tags
const thisTags = (state = [], action) => {
	switch(action.type){
		case 'THIS_TAGS':
			return state = action.tags;
		default:
			return state;
	}
}

//获取同一个标签对应的文章
const tagArcticle = (state = [], action) =>{
	switch(action.type){
		case 'TAG_ARCTICLE':
			return state = action.tagart;
		default:
			return state;
	}
}

//获取当前用户信息
const currentUser = (state = [], action) => {
	switch(action.type){
		case 'CURRENT_USER':
			return state = action.user;
		default:
			return state;
	}
}

//搜索文章
const searchArt = (state = [], action) => {
	switch(action.type){
		case 'SEARCH_ARTICLE':
			return state = action.search;
		default:
			return state;
	}
}

//获取所有注册用户
const userList = (state = [], action) => {
	switch(action.type){
		case 'INIT_USERLIST':
			return state = action.userlist;
		default:
			return state;
	}
}

export const store = createStore(
	combineReducers({
		themeUse,
		titleUse,
		count,
		thisDetail,
		trackList,
		thisTags,
		tagArcticle,
		currentUser,
		searchArt,
		userList
	})
)
