import React , { Component } from 'react';
import { Row , Table } from 'antd';

import TableCol from '../../../utils/table-col';
import axios from '../../../ajax/request_form';
import { gtask_detail , gtask_img_url } from '../../../ajax/api';
import { host } from '../../../ajax/config';
import { format_date } from '../../../ajax/tool';

class Detail extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderId:props.orderNo,
            repay_info:{
                loanMoney:"",
                downPayment:0,
                productName:"--",
                periods:"",
                syx:"",//商业险
                discountRate:""
            },
            repay_plan:[
                
            ],
            base_info_data:{

            },
            borrowerType:''
        }
    }
    componentWillMount () {
        this.base_info_company = {
            beneficiary:{
                name:"被保人",
                width_key:"10%"
            },
            cardNo:{
                name:"被保人证件号",
                width:"10%"
            },
            phone:{
                name:"被保人联系方式"
            },
            engineNo:{
                name:"发动机号"
            },
            ownerName:{
                name:"车主姓名"
            },
            plateNo:{
                name:"车牌号"
            },
            vinNo:{
                span_val:3,
                name:"车架号"
            },
            // xcfpj:{
            //     name:"车辆价格"
            // },
            tbr:{
                name:"投保人",
            },
            agent_name:{name:"经办人"},
            agent_phone:{name:"经办人手机号"},
            agent_idCard:{name:"经办人身份证号"},
            simpleStorages:{
                name:"单据",
                span_val:7,
                className_val:"text-left",
                render:(data)=>{
                    return data.simpleStorages
                }
            }
        }
        this.base_info = {
            beneficiary:{
                name:"被保人",
                width_key:"10%"
            },
            cardNo:{
                name:"被保人证件号",
                width:"10%"
            },
            phone:{
                name:"被保人联系方式"
            },
            engineNo:{
                name:"发动机号"
            },
            ownerName:{
                name:"车主姓名"
            },
            plateNo:{
                name:"车牌号",
                render:(data)=>{
                    return data.plateNo===null?'新车未上牌':data.plateNo
                }
            },
            vinNo:{
                span_val:3,
                name:"车架号"
            },
            // xcfpj:{
            //     name:"车辆价格"
            // },
            tbr:{
                name:"投保人",
                span_val:7
            },
            simpleStorages:{
                name:"单据",
                span_val:7,
                className_val:"text-left",
                render:(data)=>{
                    return data.simpleStorages
                }
            }
        }
        this.bill_info = {
            insurCompany:{
                name:"保险公司",
                width_key:"12%",
                width_val:"13%"
            },
            syx:{
                name:"商业险金额(元)",
                width_key:"13%",
                width_val:"15%",
                render:(data)=>{
                    return data.syx.money()
                }
                
            },
            receipt:{
                name:"收款机构",
                width_key:"15%",
                span_val:3
            },
            bdNo:{
                name:"商业险保单号",
                span_val:3,
            },
            syxze:{
                name:"商业险起止日期",
                span_val:3,
                render:(data)=>{
                    return data.startDate+"至"+data.endDate
                }
            }
        }
        this.fjx_info = {
            insurCompany:{
                name:"保险公司",
                width_key:"12%",
                width_val:"13%"
            },
            syfjx:{
                name:"附属险金额(元)",
                width_key:"13%",
                width_val:"15%",
                render:(data)=>{
                    return data.syfjx.money()
                }

            },
            receipt:{
                name:"收款机构",
                width_key:"15%",
                span_val:3
            },
            bdNo:{
                name:"附属险保单号",
                span_val:3,
            },
            syxze:{
                name:"附属险起止日期",
                span_val:3,
                render:(data)=>{
                    return data.startDate+"至"+data.endDate
                }
            }
        }
        this.jqx_info = {
            insurCompany:{
                name:"保险公司",
                width_key:"12%",
                width_val:"13%"
            },
            jqx:{
                name:"交强险金额(元)",
                width_key:"13%",
                width_val:"13%",
                render:(data)=>{
                    return data.jqx!==null?data.jqx.money():''
                }

            },
            ccs:{
                name:"车船税金额(元)",
                width_key:"13%",
                width_val:"17%",
                render:(data)=>{
                    return data.ccs!==null?data.ccs.money():''
                }

            },
            receipt:{
                name:"收款机构",
                //width_key:"15%",
                //span_val:3
            },
            bdNo:{
                name:"交强险保单号",
                //span_val:3,
            },
            syxze:{
                name:"交强险起止日期",
                //span_val:3,
                render:(data)=>{
                    return data.startDate+"至"+data.endDate
                }
            }
        }
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
                render:(data)=>{
                    return format_date(data.repayDate)
                }
            },
            {
                title:"实还日期",
                render:(data)=>{
                    return format_date(data.realRepayDate)||"--"
                }
            },
            {
                title:"应还金额（元）",
                render:(data)=>{
                    return data.repayMoney.money()
                }
            },
            {
                title:"实还金额（元）",
                render:(data)=>{
                    return data.realRepayMoney.money()
                }
            },
            {
                title:"逾期罚息",
                render:(data)=>{
                    return data.lateFee.money()
                }
            },
            {
                title:"还款状态",
                render:(data)=>{
                    return pay_status[data.status]||"--"
                }
            }
        ]
    }
    componentDidMount(){
        this.get_info();
    }
    get_info(){
        let rqd = {
            orderId : this.state.orderId
        }
        axios.post(gtask_detail,rqd).then(data=>{
            this.transfrom_data(data.data);
        })
    }
    transfrom_data(data){
        let res = {};
        if(data.borrowerType==0){
            res.base_info_data = {
                ...data.basicInfo,
            }
        }else{
            res.base_info_data = {
                ...data.basicInfo,
                agent_name:data.agentInfo.name,
                agent_phone:data.agentInfo.phone,
                agent_idCard:data.agentInfo.idCard,
            }
        }


        res.base_info_data.simpleStorages = [];
        for(let d in data.basicInfo.simpleStorages){
            let storage = data.basicInfo.simpleStorages[d];
            if(storage.storageNos.indexOf("[")>=0){
                let list = JSON.parse(storage.storageNos);
                for(let l in list){
                    res.base_info_data.simpleStorages.push(<img alt={d} key={d+l} src={host+gtask_img_url+"?storageNo="+list[l]} />)
                }
            }else{
                res.base_info_data.simpleStorages.push(<img alt={d} key={d} src={host+gtask_img_url+"?storageNo="+storage.storageNos} />)
            }
        }
        res.repay_info = {
            loanMoney:data.repayPlan.loanMoney,
            productName:data.repayPlan.productName,
            periods:data.repayPlan.periods,
            downPayment:data.repayPlan.downPayment,
            syx:data.repayPlan.syx,//商业险
            discountRate:data.repayPlan.discountRate
        }
        res.repay_plan = data.repayPlan.repayPlanDetailList;
        res.bill_info_data = data.insurDetailItemList;
        res.borrowerType=data.borrowerType;
        this.setState({
            ...res
        })
    }
    render() {
        let table_props = {
            columns : this.columns,
            className : "table-sh",
            pagination : false,
            rowKey:"period",
            dataSource : this.state.repay_plan
        }
        let bills = [],bill_fjx=[],syx=[],fjx=[],bill_jqx=[],jqx=[];
        let datas = this.state.bill_info_data||[];
        datas.sort(function(a,b){
            if(a.ordinal>b.ordinal){
                return 1
            }else{
                return 0
            }
        });
        let tbdType={1:'商业险',2:'商业附属险',3:'交强险|车船税'};
        for(let b in datas){
            if(datas[b].type===1){
                bills.push(datas[b]);
            }else if(datas[b].type===2){
                bill_fjx.push(datas[b]);
            }else{
                bill_jqx.push(datas[b]);
            }
            //bills.push(
            //    <div key={b}>
            //        <div className="sub-title">{tbdType[datas[b].type]}</div>
            //        <div className="sub-title">投保单{datas[b].ordinal}</div>
            //        <TableCol data-source = {datas[b]} data-columns={this.bill_info} />
            //    </div>
            //)
        }
        for(let i in bills){
            syx.push(<div key={i}>
                <div className="sub-title">投保单{bills[i].ordinal}</div>
                <TableCol data-source = {bills[i]} data-columns={this.bill_info} />
            </div>)
        }
    for(let j in bill_fjx){
        fjx.push(<div key={j}>
            <div className="sub-title">投保单{bill_fjx[j].ordinal}</div>
            <TableCol data-source = {bill_fjx[j]} data-columns={this.fjx_info} />
        </div>)
    }
    for(let j in bill_jqx){
        jqx.push(<div key={j}>
            <div className="sub-title">投保单{bill_jqx[j].ordinal}</div>
            <TableCol data-source = {bill_jqx[j]} data-columns={this.jqx_info} data-row={6}/>
        </div>)
    }
        return (
            <span>
            <Row className = "content query-sh">
                <div className="title"><div className="icon" />基本信息{this.state.base_info_data.name}</div>
                <TableCol data-source = {this.state.base_info_data} data-columns={this.state.borrowerType==1?this.base_info_company:this.base_info} />
            </Row>

            <Row style={{display:bills.length>0?"block":"none"}} className = "content query-sh">
                <div className="title"><div className="icon" />保单信息</div>
                {syx.length>0?<div className="sub-title" style={{fontWeight:'bold',fontSize:'16px'}}>商业险</div>:''}
                {syx.length>0?syx:'' }
                {fjx.length>0?<div className="sub-title" style={{fontWeight:'bold',fontSize:'16px'}}>商业附属险</div>:''}
                {fjx.length>0?fjx:''}
                {jqx.length>0?<div className="sub-title" style={{fontWeight:'bold',fontSize:'16px'}}>交强险|车船税（代缴）</div>:''}
                {jqx.length>0?jqx:''}
            </Row>

            <Row className = "content query-sh last">
                <div className="title"><div className="icon" />{this.state.repay_info.productName}
                    <span>{this.state.repay_info.periods}期</span>
                </div>
                <table className="bmd-tableCol">
                    <tbody>
                        <tr>
                            <td className="key">分期总额</td>
                            <td>{this.state.repay_info.loanMoney.money()}</td>
                            <td className="key">分期期数</td>
                            <td>&emsp;{this.state.repay_info.periods}期&emsp;</td>
                            <td className="key">首付总额</td>
                            <td>{this.state.repay_info.downPayment.money()}元(商业险总额*{this.state.repay_info.discountRate}%)</td>
                        </tr>
                    </tbody>
                </table>
                {
                    //<Table {...table_props} bordered />
                }

            </Row>
            </span>
        )
    }
}


export default Detail;