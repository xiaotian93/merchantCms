import React , { Component } from 'react';
import { Row , Col , Table , Form , Button , Modal , Upload , Input , message } from 'antd';
import Filter from '../../utils/Filter_mix'
import { Link } from 'react-router';

import axios from '../../ajax/request_form';
import axios_JSON from '../../ajax/request';
import { format_date } from '../../ajax/tool';
import Tbd from './tbdList';
import {host} from '../../ajax/config';
import { gtask_query , upload , insur_detail , supplement_bd,gtask_img_url } from '../../ajax/api';
import { upload_file } from '../../ajax/request';
import { page , order_status_map , order_status_select } from '../../ajax/config';

const FormItem = Form.Item;
const refArr=[];
class Query extends Component {
    constructor(props){
        super(props);
        this.state = {
            bdInvoiceStorageNoList:[],
            bdStorageNoList:[],
            supplement:{
                show:false
            },
            syxtbds:[],
            fjxtbds:[],
            jqxtbds:[]
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
            "2" : "bg-success", 
            "3" : "bg-success", 
            "4" : "bg-success", 
            "5" : "bg-success", 
            "6" : "bg-success", 
            "7" : "bg-success", 
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
                title:"车牌号",
                dataIndex:"plateNo",
                render:data=>{
                    return data===null?'新车未上牌':data
                }
            },
            {
                title:"发动机号",
                dataIndex:"engineNo"
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
                render:data=>{
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
                title:"拒绝原因",
                dataIndex:"noPassReason"
            },
            {
                title:"操作",
                width:175,
                render:(data)=>{
                    let operate = [];
                    operate.push(
                        <Link key="detail" to={"/fq/query/detail?orderNo="+data.orderId}><Button size="small">详情</Button>&emsp;</Link>
                    )
                    // if(true){
                    if(data.status===7||data.status===8){
                        if(data.archiveStatus===0){
                            operate.push(
                                <span key="supplement"><Button onClick={()=>{this.supplement_click(data)}} size="small">上传保单</Button></span>
                            )
                        }
                    }
                    if(data.archiveStatus===-1){
                        operate.push(
                            <span key="supplementagain"><Button onClick={()=>{this.supplement_click(data)}} size="small">重新上传保单</Button></span>
                        )
                    }
                    if(data.archiveStatus===1){
                        operate.push(
                            <span key="supplementfinish"><Button size="small">已上传保单</Button></span>
                        )
                    }
                    if(data.status===-3) {
                        operate.push(
                            <Link key="audit" to={"/fq/apply?orderNo="+data.orderId}>&emsp;<Button type="primary"
                                                                                                   size="small">重新申请</Button></Link>
                        )
                    }
                    //}else if(data.status===1){
                    //    operate.push(
                    //        <Link key="payment" to={"/fq/query/pay?orderNo="+data.orderId+"&type=payment"}><Button type="primary" size="small">付首付</Button></Link>
                    //    )
                    //}else
                    //if(data.status===7){
                    //    operate.push(
                    //        <Link key="repayment" to={"/fq/query/repay?orderNo="+data.orderNo+"&orderId="+data.orderId+"&type=signed"}><Button type="primary" size="small">还款</Button></Link>
                    //    )
                    //}
                    return {
                        children:operate,
                        props:{
                            className:"text-left"
                        }
                    };
                }
            }
        ]
        
    }
    componentDidMount(){
        this.get_list()
    }

    // 点击补填保单
    supplement_click(data){
        this.init_form();
        this.get_tbd_info(data.orderId);
    }

    // 初始化表单
    init_form(){
        this.setState({
            tbds:[],
            bdInvoiceStorageNoList:[],
            bdStorageNoList:[]
        })
    }

    // 获取投保单信息
    get_tbd_info(orderId){
        let rqd = {
            orderId:orderId
        }
        axios.post(insur_detail,rqd).then(data=>{
            var data=data.data;
            for(var i in data){
                var NoArr=[];
                if(i=='bdStorageNoList'||i=='bdInvoiceStorageNoList'){
                    var storageNosArr=data[i];
                    if(storageNosArr!==null){
                        for(var j in storageNosArr){
                            var tbdstorageNos={};
                            tbdstorageNos.uid=i+j;
                            tbdstorageNos.url=host+gtask_img_url+'?storageNo='+storageNosArr[j];
                            tbdstorageNos.name=storageNosArr[j];
                            tbdstorageNos.status='done';
                            NoArr.push(tbdstorageNos)
                        }
                        console.log(NoArr)
                        this.setState({
                            [i]:NoArr
                        })
                    }
                    this.props.form.setFieldsValue({[i]:storageNosArr})

                }

            }
            this.setState({
                supplement:{
                    show:true,
                    orderId:orderId
                },
                syxtbds:data.syxList===null?[]:data.syxList,
                fjxtbds:data.syfjxList===null?[]:data.syfjxList,
                jqxtbds:data.jqxccsList===null?[]:data.jqxccsList,
                //bdInvoiceStorageNoList:data.bdInvoiceStorageNoList===null?[]:data.bdInvoiceStorageNoList,
                //bdStorageNoList:data.bdStorageNoList===null?[]:data.bdStorageNoList
            })
        })
    }
    // 关闭弹窗
    cancelModal(){
        this.setState({
            supplement:{
                show:false
            }
        })
    }
    // 提交保单
    submit_policy(e){
        e.preventDefault();
        var syx=[],fjx=[],jqx=[];
        for(var i in refArr){
            refArr[i].props.form.validateFields();
            var tbd=refArr[i].props.form.getFieldsValue();
            if(tbd.type===1){
                syx.push(tbd)
            }else if(tbd.type===2){
                fjx.push(tbd)
            }else{
                jqx.push(tbd)
            }
        }
        this.props.form.validateFields((err,vals)=>{
            // console.log(this.transfrom_data(vals));
            if(!err){
                vals.syxList=syx;
                vals.syfjxList=fjx;
                vals.jqxccsList=jqx;
                vals.orderId=this.state.supplement.orderId;
                console.log(vals)
                this.save_supplement(vals)
            }
        })
    }
    // 转换表格数据
    transfrom_data(data){
        let res = {};
        res.bdList = [];
        res.orderId = this.state.supplement.orderId;
        for(let d in data){
            if(d==="bdInvoiceStorageNoList"||d==="bdStorageNoList"){
                res[d] = data[d];
            }else{
                res.bdList.push({
                    id:d.split("_")[1],
                    bdNo:data[d]
                })
            }
        }
        return res;
    }
    // 保存保单数据
    save_supplement(data){
        let rqd = {
            ...data
        }
        axios_JSON.post(supplement_bd,rqd).then(data=>{
            message.success(data.msg);
            this.cancelModal();
            this.get_list()
        })
    }

    get_list(p=1,filter={}){
        let rqd = {
            page:p,
            page_size:page.size,
            ...filter
        }
        axios.post(gtask_query,rqd).then(data=>{
            this.setState({
                list:data.data,
                current:data.current,
                total:data.total
            })
        })
    }
    search(values){

        let vals = {}
        for(let v in values){
            if(v==="time"){
                if(values[v].length>0){
                    //console.log(values)
                    vals.start_time = format_date(values[v][0]) + " 00:00:00"
                    vals.end_time = format_date(values[v][1]) + " 23:00:00"
                }
                //continue;

            }else{
                vals[v] = values[v];
            }
            // if(v==="order_status"){
            //     vals[v] = parseInt(values[v]);
            //     continue;
            // }

        }
        //console.log(vals)
        this.setState({
            filter:vals
        })
        this.get_list(1,vals)
    }
    page_up(page){
        this.get_list(page,this.state.filter);
    }
    upload_back(data,rqd){
        console.log(data)
        let file = data.file;
        this.setState({
            [rqd.usage]:data.fileList
        })
        if(file.status==="removed"){
            console.log(file)
            let files = this.props.form.getFieldValue(rqd.usage)||[];
            let storageNo = file.response?file.response.data.storageNo:file.name;
            files.splice(files.indexOf(storageNo),1);
            this.props.form.setFieldsValue({[rqd.usage]:files});
        }
        if(file.status==="done"){
            if(!file.response){
                return;
            }
            if(file.response.code!==0){
                return message.warn(file.response.msg);
            }
            let files = this.props.form.getFieldValue(rqd.usage)||[];
            files.push(file.response.data.storageNo);
            console.log(files)
            this.props.form.setFieldsValue({[rqd.usage]:files});
        }
    }
    onRef(e){
        refArr.push(e)
    }
    render() {
        // 补填保单弹窗参数
        let modal_props = {
            title:"保单归档",
            maskClosable:false,
            visible:this.state.supplement.show,
            className:"supplement",
            onCancel:()=>{this.cancelModal()},
            footer:null
        }
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
                    placeholder:"请输入车主姓名/车牌号/发动机号"
                },
                time:{
                    title:"提交时间",
                    type:"rangeDate",
                    feild_s:"start_time",
                    feild_e:"end_time"
                },
                order_status:{
                    title:"订单状态",
                    type:"select",
                    placeholder:"请选择订单状态",
                    values:order_status_select
                }
            }
        }
        let form_layout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
              }
        }
        let button_layout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 12 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 , offset:10 },
              }
        }
        let {getFieldDecorator} = this.props.form;
        let bd_upload = upload_file("file",upload,{usage:"bdStorageNoList"},this.upload_back.bind(this));
        bd_upload.fileList = this.state.bdStorageNoList;
        let bdfp_upload = upload_file("file",upload,{usage:"bdInvoiceStorageNoList"},this.upload_back.bind(this));
        bdfp_upload.fileList = this.state.bdInvoiceStorageNoList;

        let syx_inputs = [];
        for(let t in this.state.syxtbds){
            //let tbd_info = this.state.tbds[t];
            //syx_inputs.push(
            //    <FormItem key={t} {...form_layout} label={"投保单"+t+1}>
            //        {getFieldDecorator("bdNo",{
            //            rules:[{required: true, message: '请输入保单号'}]
            //        })(
            //            <Input placeholder="请输入保单号" />
            //        )}
            //    </FormItem>
            //)
        }
        return (
            <Col>
                <Row className="filter">
                    <Filter {...filter_props} />
                </Row>
                <Row>
                    <Table bordered {...table_props} />
                </Row>
                <Modal {...modal_props}>
                    <Form className='fqsq'>
                        {this.state.syxtbds.length>0?<Row><Col span={5} style={{textAlign:'right'}}>商业险</Col></Row>:''}
                        {
                            this.state.syxtbds.map((i,k)=>{
                                return <Tbd key={k} type={i.type} val={i.ordinal} id={i.id} onref={this.onRef.bind(this)} bdNo={i.bdNo}></Tbd>
                            })
                        }
                        {this.state.fjxtbds.length>0?<Row><Col span={5} style={{textAlign:'right'}}>商业附属险</Col></Row>:''}
                        {
                            this.state.fjxtbds.map((i,k)=>{
                                return <Tbd key={k} type={i.type} val={i.ordinal} id={i.id} onref={this.onRef.bind(this)} bdNo={i.bdNo}></Tbd>
                            })
                        }
                        {this.state.jqxtbds.length>0?<Row><Col span={8} style={{textAlign:'right'}}>交强险|车船税（代缴）</Col></Row>:''}
                        {
                            this.state.jqxtbds.length>0?this.state.jqxtbds.map((i,k)=>{
                                return <Tbd key={k} type={i.type} val={i.ordinal} id={i.id} onref={this.onRef.bind(this)} bdNo={i.bdNo}></Tbd>
                            }):''
                        }
                        <FormItem {...form_layout} className="upload-item upload-img" label={"上传保单"}>
                            {getFieldDecorator("bdStorageNoList",{
                                rules:[{required: true, message: '请上传保单'}]
                            })(<div />)}
                            <Upload {...bd_upload}>
                                <Button>上传</Button>
                            </Upload>
                        </FormItem>
                        <FormItem {...form_layout} label={"上传保单发票"} className='upload-img'>
                            {getFieldDecorator("bdInvoiceStorageNoList",{
                                rules:[{required: true, message: '请上传保单发票'}]
                            })(<div />)}
                            <Upload {...bdfp_upload}>
                                <Button>上传</Button>
                            </Upload>
                        </FormItem>
                        <FormItem {...button_layout} className='upload-btn'>
                            <Button htmlType="submit" type="primary" onClick={this.submit_policy.bind(this)}>提交</Button>
                        </FormItem>
                    </Form>
                </Modal>
            </Col>
        )
    }
}


export default Form.create()(Query);