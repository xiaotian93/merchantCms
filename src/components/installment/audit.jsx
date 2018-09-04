import React , { Component } from 'react';
import { Row , Col , Table , Button } from 'antd';
import { Link } from 'react-router';

import Filter from '../../utils/Filter_mix'
import { page , order_status_map } from '../../ajax/config';
import axios from '../../ajax/request_form';
import { format_date } from '../../ajax/tool';
import { gtask_audit } from '../../ajax/api';

class Audit extends Component {
    constructor(props){
        super(props);
        this.state = {
            list:[]
        }
    }
    componentWillMount () {
        let status_color_map = {
            "-6" : "bg-danger", 
            "-5" : "bg-danger",
            "-4" : "bg-danger",
            "-3" : "bg-danger",
            "-2" : "bg-danger", 
            "-1" : "bg-danger",
            "0" : "bg-success",
            "1" : "bg-success",
            "2" : "待商户审核", 
            "3" : "待智度一审", 
            "4" : "待智度二审", 
            "5" : "bg-success", 
            "6" : "放款中", 
            "7" : "待还款", 
            "8" : "已结清"
        }
        this.columns = [
            {
                title:"编号",
                width:"80px",
                dataIndex:"orderId"
            },
            {
                title:"车主姓名",
                dataIndex:"ownerName"
            },
            {
                title:"发动机号",
                dataIndex:"engineNo"
            },
            {
                title:"车牌号",
                dataIndex:"plateNo",
                render:(data)=>{
                    return data===null?'新车未上牌':data
                }
            },
            {
                title:"被保人",
                dataIndex:"beneficiary"
            },
            {
                title:"被保人联系方式",
                dataIndex:"phone"
            },
            {
                title:"业务员",
                dataIndex:"clerk"
            },
            {
                title:"提交时间",
                render:(data)=>{
                    return format_date(data.createTime)
                }
            },
            {
                title:"订单状态",
                render:(data)=>{
                    return {
                        children:order_status_map[data.status],
                        props:{
                            className:status_color_map[data.status]
                        }
                    }
                }
            },
            {
                title:"操作",
                width:175,
                className:"text-left",
                render:(data)=>{
                    let operate = [];
                    if(data.status===2){
                        //operate.push(
                        //    <Link key="edit" to={"/fq/apply?orderNo="+data.orderId}><Button type="success" size="small">编辑</Button></Link>
                        //)
                        operate.push(
                            <Link key="audit" to={"/fq/audit/detail?orderNo="+data.orderId+"&type=audit"}>&emsp;<Button type="primary" size="small">审核</Button></Link>
                        )
                    }
                    if(data.status===-2){
                        operate.push(<Link to={"/fq/audit/detail?orderNo="+data.orderId+"&type=failed"} key='detail1' ><Button size="small">详情</Button></Link>);
                        operate.push(
                            <Link key="audit" to={"/fq/apply?orderNo="+data.orderId}>&emsp;<Button type="primary" size="small">重新申请</Button></Link>
                        )
                    }
                    if(data.status===-6){
                        //operate.push(
                        //    <Link key="edit" to={"/fq/apply?orderNo="+data.orderId}><Button type="success" size="small">编辑</Button></Link>
                        //)
                        operate.push(<Link to={"/fq/audit/detail?orderNo="+data.orderId+"&type=audit"} key='detail2'>&emsp;<Button size="small" type="primary">审核</Button></Link>);
                        //operate.push(
                        //    <Link key="bind" to={"/fq/apply?orderNo="+data.orderId+"&type=bind"}>&emsp;<Button type="primary" size="small">绑卡</Button></Link>
                        //)
                    }
                    return {
                        children:operate,
                        props:{
                            className:'text-left'
                        }
                    };
                }
            }
        ]
        
    }
    componentDidMount(){
        this.get_list();
    }
    search(values){
        this.setState({
            filter:values
        })
        this.get_list(1,values)

    }
    get_list(p=1,filter={}){
        let rqd = {
            page:p,
            page_size:page.size,
            ...filter
        }
        axios.post(gtask_audit,rqd).then(data=>{
            this.setState({
                list:data.data,
                current:data.current,
                total:data.total
            })
        })
    }
    page_up(page){
        this.get_list(page,this.state.filter);
    }
    render() {
        let pagination = {
            current:this.state.current,
            pageSize:page.size,
            total:this.state.total,
            onChange:this.page_up.bind(this)
        }
        let table_props = {
            columns : this.columns,
            className : "table-sh lg",
            pagination : pagination,
            rowKey:"orderId",
            dataSource : this.state.list
        }
        let filter_props = {
            "data-get":this.search.bind(this),
            "data-source":{
                condition:{
                    type:"mix",
                    placeholder:"请输入车主姓名/发动机号/车牌号/VIN码"
                }
                // car_no:{
                //     title:"车牌号",
                //     type:"text",
                //     placeholder:"请输入车牌号码"
                // },
                // power_no:{
                //     title:"发动机号",
                //     type:"text",
                //     placeholder:"请输入车牌号码"
                // },
                // vin_code:{
                //     title:"vin码",
                //     type:"text",
                //     placeholder:"请输入车牌号码"
                // },
            }
        }

        return (
            <Col>
                <Row className="filter">
                    <Filter {...filter_props} />
                </Row>
                <Row>
                    <Table bordered {...table_props} />
                </Row>
            </Col>
        )
    }
}


export default Audit;