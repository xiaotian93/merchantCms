// import { getUrlParam } from './tool';

let domain = "/";
let browser_host = window.location.hostname;

if(browser_host==="cxfq.baimaodai.com"){
	domain = "http://cxfq.api.baimaodai.com/chexianfenqi/";
}else{
	domain = "http://lcrawler.baimaodai.com/chexianfenqi";
}

// 通用host
export const host = domain;

// 列表每页条数
export const page = {size:30}

// 分期订单状态
export const order_status_map = {
	"-6" : "未绑卡", 
	"-5" : "已退保",
	"-4" : "放款失败",
	"-3" : "智度审核未通过",
	"-2" : "商户审核未通过", 
	"-1" : "已失效",
	"0" : "待签约",
	"1" : "待首付",
	"2" : "待商户审核", 
	"3" : "待审核", 
	"4" : "待审核", 
	"5" : "待放款", 
	"6" : "放款中", 
	"7" : "待还款", 
	"8" : "已结清"
}

// 分期订单状态下拉列表
export const order_status_select = [
	{val:"" ,name: "全部"}, 
	// {val:"-6" ,name: "未绑卡"}, 
	// {val:"-2" ,name: "商户审核未通过"}, 
	// {val:"-1" ,name: "已失效"},
	{val:"0" ,name: "待签约"},
	{val:"1" ,name: "待首付"},
	// {val:"2" ,name: "待商户审核"}, 
	{val:"3,4" ,name: "待审核"}, 
	{val:"-3" ,name: "审核未通过"},
	{val:"5" ,name: "待放款"}, 
	{val:"6" ,name: "放款中"},
	{val:"-4" ,name: "放款失败"},
	{val:"7" ,name: "待还款"},
	{val:"8" ,name: "已结清"},
	{val:"-5" ,name: "已退保"},
]
