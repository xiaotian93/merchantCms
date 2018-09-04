import React , { Component } from 'react';
import { Row , Col , Table , Modal } from 'antd';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import QRCode from 'qrcode.react';

// import { order_status_map } from '../../../ajax/config';
import axios from '../../../ajax/request_form';
import { get_payment_info , get_payment_plan , verify_pay_status } from '../../../ajax/api';

// const QRCode = require('qrcode.react');

class Audit extends Component {
    constructor(props){
        super(props);
        this.state = {
            downPaymentMoney:"",
            paidDownPaymentMoney:0,
            discountRate:"",
            syx:"",
            loanMoney:"",
            periods:"",
            repayDay:"",
            codeUrl:"",
            tbdSyxList:[],
            visible:false,
            success:false,
            auto_second:5,
            type:0,
            needRefund:""
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
                render:data=>{
                    return data.repayDate||"--"
                }
            },
            {
                title:"实还日期",
                render:data=>{
                    return data.realRepayDate||"--"
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
            orderId:this.props.location.query.orderNo
        }
        axios.post(get_payment_info,rqd).then(data=>{
            let res = data.data;
            this.setState({
                ...res
            })
            this.timer = setInterval((e)=>{
                this.verify_state()
            },2000);
        })
    }
    get_plan(){
        let rqd = {
            orderId:this.props.location.query.orderNo
        }
        axios.post(get_payment_plan,rqd).then(data=>{
            let res = data.data;
            this.setState({
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
    onCancel(){
        this.setState({
            visible:false
        })
    }
    // 验证还款状态
    verify_state(requestId){
        let rqd = {
            orderId:this.props.location.query.orderNo
        }
        axios.post(verify_pay_status,rqd).then(data=>{
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
            visible:true,
            className:"pay-modal",
            footer:null
        }
        let modal_success = {
            title:"支付结果",
            visible:this.state.success,
            className:"pay-modal",
            footer:null
        }
        // let test = {
        //     account:"广州市智度互联网小额贷款有限公司",
        //     bank:"中信银行广州分行营业部",
        //     no:"8110901411700617469"
        // }
        let qrimg = this.state.codeUrl?<QRCode size={150} value = {this.state.codeUrl} />:"";
        let pay_html = "";
        if(!this.state.needRefund){
            pay_html = (
                <Row>
                    <div className="page-subtitle">微信支付</div>
                    <Col span={12}>
                        { qrimg }
                        <div>打开微信扫一扫支付</div>
                    </Col>
                </Row>
            )
        }else{
            pay_html = (
                <Modal {...modal_result}>
                    <span className="page-subtitle">已完成支付,如有问题请联系客服。</span>
                    <Link to={"/fq/query"}>返回列表</Link>
                </Modal>
            )
        }
        let strs = [];
        for(let t in this.state.tbdSyxList){
            strs.push(this.state.tbdSyxList[t].money());
        }
        let payment_html = "";
        if(this.state.type===0){
            payment_html = (
                <div className="pay-content">
                    <div className="page-title">需支付首付款</div>
                    <div className="moneys">
                        <span className="money">
                            <span>{this.state.downPaymentMoney.money()}</span>元
                        </span><br />
                        <span>首付款=商业险总额{this.state.syx.money()}*{this.state.discountRate+"%"}</span><br />
                        <span>（商业险总额={strs.join("+")}）</span>
                    </div>
                    <div className="info">
                        <span className="origin">{this.state.periods}期</span> | 每月{this.state.repayDay}日还款&emsp;&emsp;&emsp;&emsp;分期总额 
                        <span className="origin">{this.state.loanMoney.money()}</span>元
                        <a onClick={this.show.bind(this)}>分期详情</a>
                    </div>
                </div>
            )
        }else{
            payment_html = (
                <div className="pay-content">
                    <div className="page-title">需补付首付</div>
                    <div className="moneys">
                        <span className="money">
                            <span>{(this.state.downPaymentMoney-this.state.paidDownPaymentMoney).money()}</span>元
                        </span><br />
                        <span>首付款=商业险总额{this.state.syx.money()}*{this.state.discountRate+"%"}</span><br />
                        <span>（补付差额=首付款{this.state.downPaymentMoney.money()}-已付首付{this.state.paidDownPaymentMoney.money()}）</span>
                    </div>
                    <div className="info">
                        <span className="origin">{this.state.periods}期</span> | 每月{this.state.repayDay}日还款&emsp;&emsp;&emsp;&emsp;分期总额 
                        <span className="origin">{this.state.loanMoney.money()}</span>元
                        <a onClick={this.show.bind(this)}>分期详情</a>
                    </div>
                </div>
            )
        }
        return (
            <Row className="content pay">
                <div className="page-title">
                    <Row>
                        <Col span={16}>订单提交成功,请尽快完成付款！请您在24小时内完成支付,否则订单会被自动取消</Col>
                        <Col span={8} className="text-right"> <Link to={'/fq/query/detail?orderNo='+this.props.location.query.orderNo}>订单详情</Link>&nbsp;</Col>
                    </Row>
                </div>
                { payment_html }
                <div className="pay-content">
                    <div className="page-title">支付方式：</div>
                    { pay_html }<br />
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
                    <span className="money-item">首付总额：{this.state.downPaymentMoney.money()}元</span>
                    <span className="money-item">还款日：{this.state.repayDay}日</span>
                    <br /><br />
                    <Table bordered {...table_props} />
                </Modal>
                <Modal {...modal_success} >
                    <span className="page-subtitle">付款成功! {this.state.auto_second}s后自动返回列表页</span>
                    <Link to={"/fq/query"}>返回列表</Link>
                </Modal>
            </Row>
        )
    }
}


export default Audit;