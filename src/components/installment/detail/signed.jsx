import React , { Component } from 'react';
import { Row , Col , Checkbox , Button , message } from 'antd';
import { browserHistory } from 'react-router';
// import VerifyModal from './verify';

import axios from "../../../ajax/request_form";
import { host } from "../../../ajax/config";
import { create_contact_file , get_contact_info , order_signed } from '../../../ajax/api';
// import VerifyModal from './../apply/bind';

class Signed extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderNo:props.orderNo,
            storageNo:"0",
            disabled:false,
            loading:false,
            visible:false
        }
    }
    componentWillMount () {
        this.verify_modal = {};
    }
    componentDidMount(){
        this.create_contact();
    }
    // 生成合同PDF
    create_contact(){
        let rqd = {
            orderId:this.state.orderNo
        }
        axios.post(create_contact_file,rqd).then(data=>{
            this.setState({
                storageNo:data.data
            })
        })
    }
    stateChange(e){
        this.setState({
            disabled:!e.target.checked
        })
    }
    show(modal){
        this.verify_modal = modal;
    }
    verify(){
        this.setState({
            loading:true
        })
        let rqd = {
            orderId:this.state.orderNo
        }
        axios.post(order_signed,rqd).then(data=>{
            message.success(data.msg);
            this.setState({
                loading:false
            })
            browserHistory.push("/fq/query/pay?orderNo="+this.state.orderNo+"&type=payment");
        })
    }
    go_protocol(){
        if(this.state.storageNo!=="0"){
            window.open(host+get_contact_info+"?storageNo="+this.state.storageNo);
        }else{
            message.warn("协议正在生成中,请稍后再试...")
        }
    }
    render() {

        return (
            <Row className = "content query-sh last">
                <Checkbox onChange={this.stateChange.bind(this)} defaultChecked>确认</Checkbox>
                <a onClick={ this.go_protocol.bind(this) }>《借款协议》</a>
                <Col span={24} className="submit-btn">
                    <Button type="primary" onClick={this.verify.bind(this)} loading={this.state.loading} disabled={this.state.disabled}>确认签约</Button>
                </Col>
                {/*<VerifyModal type="signed" set-bind={this.show.bind(this)} orderNo={this.state.orderNo} />*/}
            </Row>
        )
    }
}


export default Signed;