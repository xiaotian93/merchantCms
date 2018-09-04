/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import ax from 'axios';
import { message } from 'antd';
import { host } from './config';
import { set_logstate } from './tool'

const error_info = {
    net: "网络异常",
    404: "请求地址错误",
    500: "服务器异常",
    401: "未登录",
    302: "未登录",
    403: "认证失败"
}

// 数据请求参数
const axios_config = {
	timeout: 50000,
    responseType: 'json',
    withCredentials: true,
    // headers:{ "where_i_go_baimaodai_loan_manage":"..." },
    validateStatus: function(status) {
        return (status >= 200 && status < 300);
    },
    transformRequest: [function(data) {
        if(typeof data==="string"){
            return data
        }
        let params = [];
        for(let d in data){
            params.push(d+"="+data[d]);
        }
        return params.join("&");
    }],
    transformResponse: [function(data) {
        let res;
        try {
            res = JSON.parse(JSON.stringify(data));
        } catch (e) {
            message.error("返回值格式错误");
        }
        // 100 未登录 200 权限不足 300 权限不足 0 未定义错误
        if(res.code===1003000001){
            message.warn(res.msg);
            set_logstate(false);
            return Promise.reject(res.msg);
        }
        if(res.code===1002000001){
            message.warn(res.errMsg);
            return Promise.reject(res.errMsg);
        }
        if(res.code!==0){
            message.error("错误代码："+res.code+"--错误信息："+res.msg, 5);
            return Promise.reject(res.msg)
        }
        
        return res;
    }]
}

// 拦截器处理
const interceptors_res = (response) => {
    return response.data;
}
const interceptors_ers = (err) => {
    let status = err.response ? err.response.status : "net";
    message.error(error_info[status], 3);
    if(status==='net'){
    }
    return Promise.reject(error_info[status])
}
// 请求实例JSON
const axios = ax.create(axios_config);
axios.defaults.baseURL = host;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.response.use(interceptors_res, interceptors_ers);
// axios.interceptors.request.use(interceptors_req, interceptors_erq);
export default axios;

