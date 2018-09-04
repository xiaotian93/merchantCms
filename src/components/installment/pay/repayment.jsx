import React , { Component } from 'react';
import { Row , Col , Table , Modal } from 'antd';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import QRCode from 'qrcode.react';

// import { order_status_map } from '../../../ajax/config';
// import TableCol from './../../../utils/table-col';
import axios from '../../../ajax/request_form';
import { get_repayment_info , get_payment_plan , verify_repay_status } from '../../../ajax/api';

// const QRCode = require('qrcode.react');

class Audit extends Component {
    constructor(props){
        super(props);
        this.state = {
            downPayment:0,
            loanMoney:"",
            money:"",
            periods:"",
            repayDate:"",
            codeUrl:"",
            repayDay:"",
            success:false,
            visible:false
        }
    }
    componentWillMount () {
        let pay_status = {
            "-1":"--",
            "0":"未还款",
            "1":"已还款",
            "2":"逾期未还",
            "3":"逾期已还",
        }
        this.columns = [
            {
                title:"期数",
                dataIndex:"period"
            },
            {
                title:"应还日期",
                dataIndex:"repayDate"
            },
            {
                title:"实还日期",
                dataIndex:"realRepayDate",
                render:data=>{
                    return data||"--"
                }
            },
            {
                title:"应还金额(元)",
                render:(data)=>{
                    return data.repayMoney.money()
                }
            },
            {
                title:"实还金额(元)",
                render:(data)=>{
                    return data.realRepayMoney.money()
                }
            },
            {
                title:"逾期罚息(元)",
                render:(data)=>{
                    return data.lateFee.money()
                }
            },
            {
                title:"还款状态",
                render:(data)=>{
                    return pay_status[data.status]
                }
            }
        ]
        
    }
    componentDidMount(){
        this.get_info();
        this.get_plan();
    }
    componentWillUnmount(){
        clearInterval(this.timer);
    }
    // 获取页面信息
    get_info(filter={}){
        let rqd = {
            orderNo:this.props.location.query.orderNo
        }
        axios.post(get_repayment_info,rqd).then(data=>{
            let res = data.data;
            this.setState({
                ...res
            })
            this.timer = setInterval((e)=>{
                this.verify_state(res.requestId);
            },2000);
        })
    }
    get_plan(){
        let rqd = {
            orderId:this.props.location.query.orderId
        }
        axios.post(get_payment_plan,rqd).then(data=>{
            let res = data.data;
            this.setState({
                repayDay:res.repayDay,
                downPayment:res.downPayment,
                productName:res.productName,
                periods:res.periods,
                list:res.repayPlanDetailList
            })
        })
    }
    show(){
        this.setState({
            visible:true
        })
    }
    onOk(){

    }
    // 验证还款状态
    verify_state(requestId){
        let rqd = {
            requestId:requestId
        }
        axios.post(verify_repay_status,rqd).then(data=>{
            if(data.data){
                let auto_second = this.state.auto_second;
                clearInterval(this.timer);
                this.setState({
                    success:true
                });
                setInterval(e=>{
                    if(auto_second===0){
                        browserHistory.push("/fq/query");
                    }
                    this.setState({
                        auto_second:auto_second--
                    })
                    
                },1000);
            }
            
        })
    }
    onCancel(){
        this.setState({
            visible:false
        })
    }
    render() {
        let table_props = {
            columns : this.columns,
            pagination : false,
            rowKey:"orderId",
            dataSource : this.state.list
        }
        let modal_props = {
            title:"分期详情",
            visible:this.state.visible,
            width:"60%",
            className:"pay-modal modal-long",
            footer:null,
            onOk:this.onOk.bind(this),
            onCancel:this.onCancel.bind(this)
        }
        let modal_result = {
            title:"支付结果",
            visible:this.state.success,
            className:"pay-modal",
            footer:null
        }

        let qrimg = this.state.codeUrl?<QRCode size={150} value = {this.state.codeUrl} />:"";
        return (
            <Row className="content pay">
                <div className="pay-content">
                    <div className="page-title">本期应还</div>
                    <div className="moneys">
                        <span className="money">
                            <span>{this.state.money.money()}</span>元
                        </span><br />
                    </div>
                    <div className="info">
                        {/*<span className="origin">{this.state.periods}期</span> | 每月{this.state.repayDay}日还款&emsp;&emsp;&emsp;&emsp;分期总额 */}
                        {/*<span className="origin">{this.state.loanMoney}</span>元*/}
                        <span>分期总额：{this.state.loanMoney.money()}元</span><br />
                        <span>本次是第 <span className="origin">{this.state.period}</span> 次还款，还款日<span className="origin">{this.state.repayDate}</span></span>
                        <a onClick={this.show.bind(this)}>分期详情</a>
                    </div>
                </div>
                <div className="pay-content">
                    <div className="page-title">主动还款方式</div>
                    <Row>
                        <Col span={12}>
                            <Row>
                                <div className="page-subtitle">微信支付</div>
                                <Col span={12}>
                                    { qrimg }
                                    <div>打开微信扫一扫支付</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row><br />
                    {/*<Row>
                        <div className="page-subtitle">2、线下转账</div>
                        <Col span={12}>
                            <TableCol data-source = {test} data-columns={this.columns}/>
                        </Col>
                    </Row>
                    <br />
                    <div><span className="origin">※</span> 打款时请备注：还款人姓名+订单编号</div>*/}
                </div>
                <Modal {...modal_props}>
                    <span className="money-item">分期总额：{this.state.loanMoney.money()}元</span>
                    <span className="money-item">首付总额：{this.state.downPayment.money()}元</span>
                    <span className="money-item">还款日：{this.state.repayDay}日</span>
                    <br /><br />
                    <Table bordered {...table_props} />
                </Modal>
                <Modal {...modal_result}>
                    <span className="page-subtitle">已完成支付,如有问题请联系客服。</span>
                    <Link to={"/fq/query"}>返回列表</Link>
                </Modal>
            </Row>
        )
    }
}


export default Audit;