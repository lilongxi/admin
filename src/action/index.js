
//改变主体颜色action
const SET_THEME = 'SET_THEME';
//改变title
const SET_TITLE = 'SET_TITLE';
//初始化数据
const INIT_LIST = 'INIT_LIST';
//设置数据可见状态
const TOGGLE_STATUS = 'TOGGLE_STATUS';
//删除数据
const DELETE_ITEM = 'DELETE_ITEM';
//分页
const PAGE_ITEM = 'PAGE_ITEM';
//添加数据
const ADD_ITEM = 'ADD_ITEM';

export const setTheme = (theme) => {
	return {
		type: SET_THEME,
		theme
	}
}

export const setTitle = (title) => {
	return {
		type: SET_TITLE,
		title
	}
}

export const initList = (fetchList) => {
	return{
		type: INIT_LIST,
		fetchList
	}
}

export const toggleStatus = (_id) => {
	return {
		type:TOGGLE_STATUS,
		_id
	}
}

export const deleteItem = (_id) => {
	return {
		type:DELETE_ITEM,
		_id
	}
}

export const pageItem = (items) => {
	return {
		type:PAGE_ITEM,
		items
	}
}

export const addItem = (item) =>{
	return {
		type:ADD_ITEM,
		item
	}
}
