import React , { Component } from 'react';
import { Col , Button , Modal , Input , message } from 'antd';
// import { Link } from 'react-router';
import { browserHistory } from 'react-router';


import axios from '../../../ajax/request_form';
import { approve_pass , approve_nopass } from '../../../ajax/api';

const { TextArea } = Input;

class Audit extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderNo:props.orderNo,
            visible:false,
            reason:"ccc",
            content:""
        }
    }
    componentWillMount () {
        
    }
    componentDidMount(){

    }
    set_modal(show,option){
        if(show){
            this.setState({
                visible:true,
                option:option,
                title:(option?"确认审核通过":"审核未通过原因"),
                content:option,
                reason:""
            })
        }else{
            this.setState({
                visible:false,
                reason:""
            })
        }
    }
    audit(){
        let rqd = {
            orderId:this.state.orderNo,
            reason:this.state.reason,
            approve:this.state.option
        }
        let path = (this.state.option?approve_pass:approve_nopass)
        axios.post(path,rqd).then(data=>{
            message.success(data.msg);
            if(this.state.option){
                browserHistory.push("/fq/query");
                //browserHistory.push("/fq/query/detail?orderNo="+this.state.orderNo+"&type=signed");
                // window.location.href="/fq/query/detail?orderNo="+this.state.orderNo+"&type=signed";
            }else{
                browserHistory.push("/fq/audit?orderNo="+ this.state.orderNo +"&type=failed")
            }
        })
    }
    textChange(e){
        this.setState({
            reason:e.target.value
        })
    }
    render() {
        let modal_props = {
            visible:this.state.visible,
            title:this.state.title,
            onOk:()=>{ this.audit(true) },
            onCancel:()=>{ this.set_modal(false)}
        }
        return (
            <Col span={24} className="submit-btn">
                <Button type="primary" onClick={()=>{ this.set_modal(true,true)}} >审核通过</Button>&emsp;&emsp;
                <Button type="danger" onClick={()=>{ this.set_modal(true,false)}} >审核不通过</Button>
                <Modal {...modal_props}>
                    <div style={{display:this.state.option?"block":"none"}}>确定审核完成信息无误通过？</div>
                    <TextArea style={{display:!this.state.option?"block":"none"}} rows={4} value={this.state.reason} onChange={this.textChange.bind(this)} />
                </Modal>
            </Col>
        )
    }
}


export default Audit;