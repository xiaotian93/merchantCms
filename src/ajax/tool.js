import { browserHistory } from 'react-router';
import moment from 'moment';

// 设置登录状态
export const set_logstate = (iflog) => {
	if(iflog){
		localStorage.setItem("isLogin","true");
	}else{
		localStorage.setItem("isLogin","false");
	}
    browserHistory.push(window.location.pathname+window.location.search);
}

// 获取地址栏参数
export const getUrlParam = (name) => {  
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
    let r = window.location.search.substr(1).match(reg);  
    if (r!=null) 
      return decodeURI(r[2]); 
    return null;  
}

// 格式化表格参数  添加需要
export const format_table_data = (data) => {
	let source = JSON.parse(JSON.stringify(data));
	for(let s in source){
		source[s].key = (parseInt(s,10)+1);
		// source[s] = fmt_obj(source[s]);
		// source[s] = fmt_json(source[s])
	}
	return source;
}

// 格式化日期
export const format_date = (date)=>{
	let format = "YYYY-MM-DD";
	if(typeof date==="object"){
		return date?date.format(format):"";
	}else{
		return date?moment(date).format(format):"";
	}
}
// 格式化日期
export const format_time = (date)=>{
	let format = "YYYY-MM-DD HH:mm:ss";
	if(typeof date==="object"){
		return date?date.format(format):"";
	}else{
		return date?moment(date).format(format):"";
	}
}

// 添加滚动事件
export const add_event = (scrollFunc,ele) => {
	let doc = ele||document;
	if(document.addEventListener){
		doc.addEventListener("DOMMouseScroll",scrollFunc,false);
	}
	doc.onmousewheel = scrollFunc;
}