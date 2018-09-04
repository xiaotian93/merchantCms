import React , { Component } from 'react';
import { Row , Col , Input , Modal , Button , message} from 'antd';
import { browserHistory } from 'react-router';

import axios from '../../../ajax/request_form';
import { get_captcha_bind , verify_code_bind , verify_msg_bind , get_msg_bind } from '../../../ajax/api';
import { host } from '../../../ajax/config';


class BindCard extends Component {
    constructor(props){
        super(props);
        props["set-bind"](this);
        this.state = {
            orderNo:props.orderNo,
            uniqueCode:"",
            textValue:"",
            visible_img:props.defaultShow||false,
            img_code:"",
            imgurl:"",
            error_img:"hidden",
            visible_msg:false,
            button_text:"获取验证码",
            msg_info:"",
            error_msg:"hidden",
            disabled_btn:false,

        }
    }
    //componentWillMount () {
    //
    //}
    componentDidMount(){
        this.imgChange();
    }
    verify_img(){
        let rqd = {
            captcha:this.state.img_code
        }
        if(!this.state.img_code){
            this.setState({
                error_img:"visible",
            })
            return;
        }
        // 单独验证图片
        axios.post(verify_code_bind,rqd).then(data=>{
            this.setState({
                visible_img:false,
                textValue:"",
                visible_msg:true,
            })
        })
    }
    verify_msg(){
        let rqd = {
            smsCode:this.state.msg_info,
            uniqueCode:this.state.uniqueCode,
            orderId:this.state.orderNo
        }
        if(!this.state.msg_info){
            this.setState({
                error_msg:"visible",
            })
            return;
        }
        axios.post(verify_msg_bind,rqd).then(data=>{
            if(data.data.code===0){
                message.success(data.data.msg);
                browserHistory.push('/fq/audit/detail?orderNo='+this.state.orderNo+'&type=audit')
            }else{
                message.warn(data.data.msg);
            }
        })
        
    }
    send_msg(){
        axios.get(get_msg_bind+"?orderId="+this.state.orderNo+"&captcha="+this.state.img_code,null).then(data=>{
            message.warn(data.data.msg)
            this.setState({
                uniqueCode:data.data.uniqueCode
            })
        })
    }
    count_down(){
        let second = 60;
        this.setState({
            disabled_btn:true,
            button_text:second+"s"
        })
        this.send_msg();
        let timer = setInterval(()=>{
            second--;
            this.setState({
                button_text:second+" s"
            })
            if(second<=0){
                clearInterval(timer);
                this.setState({
                    disabled_btn:false,
                    button_text:"重新获取"
                })
            }
        },1000)
    }
    imgChange(){
        this.setState({
            imgurl:host+get_captcha_bind+"?t="+Date.parse(new Date()),
        })
    }
    textChange(e,key){
        if(e.target.value){
            this.setState({
                error_img:"hidden",
                error_msg:"hidden"
            })
        }
        this.setState({
            [key]:e.target.value,
            textValue:e.target.value
        })
    }
    cancelModal(key){
        this.setState({
            [key]:false
        })
    }
    render() {
        let footer_img = [
            <Button key="img" type="primary" onClick={this.verify_img.bind(this)}>确定</Button>
        ]
        let footer_msg = [
            <Button key="msg" type="primary" onClick={this.verify_msg.bind(this)}>确定</Button>
        ]
        let img_props = {
            title:"您正在进行还款人绑卡",
            maskClosable:false,
            visible:this.state.visible_img,
            className:"bind",
            onCancel:()=>{this.cancelModal("visible_img")},
            footer:footer_img
        }
        let msg_props = {
            title:"您正在进行还款人绑卡",
            maskClosable:false,
            visible:this.state.visible_msg,
            className:"bind",
            onCancel:()=>{this.cancelModal("visible_msg")},
            footer:footer_msg
        }
        return (
            <span>
                <Modal {...img_props}>
                    <Row className="verify-modal">
                        <Col span={14}>
                            <Input type="text" placeholder="请输入验证码" value={this.state.textValue} onChange={(e)=>{this.textChange(e,"img_code")}} />
                            <div className="text-danger" style={{visibility:this.state.error_img}}>请输入图片验证码</div>
                        </Col>
                        <Col span={8} offset={2}>
                            <img alt="验证码" onClick={this.imgChange.bind(this)} src={this.state.imgurl} />
                        </Col>
                    </Row>
                </Modal>
                <Modal {...msg_props}>
                    <Row className="verify-modal">
                        <Col span={14}>
                            <Input type="text" value={this.state.textValue} onChange={(e)=>{this.textChange(e,"msg_info")}} />
                            <div className="text-danger" style={{visibility:this.state.error_msg}}>请输入短信验证码</div>
                        </Col>
                        <Col span={8} offset={2}>
                            <Button type="primary" className="timer" disabled={this.state.disabled_btn} onClick={this.count_down.bind(this)}>{this.state.button_text}</Button>
                        </Col>
                    </Row>
                </Modal>
            </span>
        )
    }
}


export default BindCard;