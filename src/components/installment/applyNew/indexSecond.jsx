import React , { Component } from 'react';
import { Row , Col , Table , Form , Checkbox , Button , Icon , Select , Input ,Radio ,Upload,List,DatePicker,message,Modal} from 'antd';
import {host} from '../../../ajax/config.js';
import api from '../../../ajax/api.js';
import axios from '../../../ajax/request.js';
import axios_form from '../../../ajax/request_form';
import Insurance from './tbd';
import Syxfj from './tbd_syfj';
import Syxjq from './tbd_jqx';
import Car from './car';
import Info from './info';
import moment from 'moment';
import {format_date} from '../../../ajax/tool';
import ModalMessage from './insurance_message';
import { browserHistory } from 'react-router';
import Bind from './bind';
import Person from './apply_person';
import Company from './apply_company.jsx';
import Product from './product';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {  RangePicker } = DatePicker;

const businessType='';
var syxTotal=0;
class ApplySecond extends  Component {
    constructor(props) {
        super(props);
        this.state={
            product_list:[],
            rateList:[],
            insur_company_list:[],
            receipt_list:[],
            clerk_list:[],
            loanBasis:'',
            productId:"",
            productRateId:"",
            calc:false,
            modal:false,
            tbdData:[
                {
                    insurCompanyId:'',
                    ordinal:'',
                    receiptId:'',
                    syx:'',
                    syxEndDate:'',
                    syxStartDate:'',
                    syxTbdNo:'',
                    year:''
                }
            ],
            schemeItemList:{
                syx:0,
                schemeItemList:[],
                discountRate:0,
                downPayment:0,
                loanMoney:0,
                periods:0
            }, //计算结果
            tbdDatas:[       //确认保单信息
                [
                    {
                        insurCompanyId:'',
                        ordinal:'',
                        receiptId:'',
                        syx:'',
                        syxEndDate:'',
                        syxStartDate:'',
                        syxTbdNo:'',
                        year:'',
                        receiptName:''
                    }
                ]

            ],
            orderId:'',
            applicant:props.location.query.orderNo===undefined?true:false,  //确认投保人信息
            syxTotal:0,
            orderIds:props.location.query.orderNo,
            type:props.location.query.type,
            basicInfo:{
                simpleStorages:[]
            },
            totalData:'',
            car:'',
            syxList:[],
            fjxList:[],
            businessType:'',
            haveJqxccs:'',
            haveSyfjx:'',
            param:'',
            syx:0,
            fjx:0
        }
        this.columns=[
            {dataIndex:"period",width:'33.33%'},
            {dataIndex:'repayDate',width:'33.33%',render:(e)=>{return format_date(e).split(' ')[0]}},
            {dataIndex:'money',width:'33.33%',render:(e)=>{return parseFloat(e/100).toFixed(2)+'元'}}
        ]

    }
    handleSubmit = (e) => {
        e.preventDefault();
        var parm={},tbdDetailList=[],tbdOrder={},person,product,syxs,fjxs,info;
        var tbd_verify=[];
        this.person.props.form.validateFields((err,value)=>{
            if(!err){
                parm.wxUserId=value.wxUserId;
                parm.carId=value.carId;
                person=true
            }
        });
        this.product.props.form.validateFields((err,val)=>{
            if(!err){
                tbdOrder.productId=val.productId;
                tbdOrder.productRateId=val.productRateId;
                parm.loanBasis=val.loanBasis;
                product=true
            }
        });
        this.syx.props.form.validateFields((err,val)=>{
            //this.syx.tbd.props.form.validateFields();
            if(!err){
                this.syx.tbd.props.form.validateFields((err,val)=>{
                    if(!err){
                        //商业险
                        var syx=this.syx.getSyx();
                        var syx_v=this.syx.getSyx();
                        tbd_verify.push(syx_v);
                        for(var i in syx){
                            delete syx[i].receiptName;
                            tbdDetailList.push(syx[i])
                        }
                        syxs=true
                    }
                });

            }
        });
        this.state.haveSyfjx?this.fjx.props.form.validateFields((err,val)=>{
            if(!err){
                this.fjx.tbd.props.form.validateFields((err,val)=>{
                    if(!err){
                        //商业附加险
                        var fjx=this.fjx.getSyx();
                        var fjx_v=this.fjx.getSyx();
                        tbd_verify.push(fjx_v);
                        for(var j in fjx){
                            delete fjx[j].receiptName;
                            tbdDetailList.push(fjx[j])
                        }
                        fjxs=true
                    }
                });

            }
        }):'';
        this.state.haveJqxccs?this.jqx.props.form.validateFields((err,val)=>{
            var receipt=val.receiptId.split('-');
            val.jqx=val.jqx*100;
            val.ccs=val.ccs*100;
            val.receiptId=receipt[0];
            val.receiptName=receipt[1];
            if(val.startDate===undefined||val.endDate===undefined){
                val.startDate='';
                val.endDate='';
            }
            console.log(val)
            delete val.receiptName;
            if(val.insurCompanyId===''||val.receiptId===''||val.endDate===''||val.startDate===''||val.jqx===''||val.ccs===''){
                return;
            }
            tbdDetailList.push(val);
        }):'';
        this.state.haveJqxccs?this.jqx.props.form.validateFields((err,val)=>{
            if(!err){
                var jqx=[];
                var val1=this.jqx.props.form.getFieldsValue();
                var val2=this.jqx.props.form.getFieldsValue();
                var receipt=val1.receiptId.split('-');
                val1.jqx=val1.jqx*100;
                val1.ccs=val1.ccs*100;
                val1.receiptId=receipt[0];
                val1.receiptName=receipt[1];
                val1.num=1;
                val2.jqx=val2.jqx*100;
                val2.ccs=val2.ccs*100;
                val2.receiptId=receipt[0];
                val2.receiptName=receipt[1];
                val2.num=2;
                jqx.push(val1);
                jqx.push(val2);
                if(val1.insurCompanyId===''||val1.receiptId===''||val1.endDate===undefined||val1.startDate===undefined||val1.jqx===''||val1.ccs===''){
                    return;
                }
                tbd_verify.push(jqx);
            }


        }):'';
        this.info.props.form.validateFields((err,val)=>{
            if(!err){
                tbdOrder.tbdDetailList=tbdDetailList;
                tbdOrder.tbdStorageNoList=val.tbdStorageNoList;
                parm.tbdOrder=tbdOrder;
                parm.clerkId=val.clerkId;
                parm.beneficiaryType=this.state.businessType;
                parm.borrowerType=this.state.businessType;
                if(this.state.orderIds){
                    parm.orderId=this.state.orderIds
                }
                info=true
            }
        });
        //this.setState({
        //    tbdDatas:tbd_verify,
        //    modal:true
        //})
        if(this.state.haveSyfjx){
            if(person&&product&&syxs&&fjxs&&info){
                this.setState({
                    param:parm,
                    tbdDatas:tbd_verify,
                    modal:true
                })
            }else{
                message.warn('必填信息不能为空')
            }
        }else{
            if(person&&product&&syxs&&info){
                this.setState({
                    param:parm,
                    tbdDatas:tbd_verify,
                    modal:true
                })
            }else{
                message.warn('必填信息不能为空')
            }
        }



    };
    tbdSure() {
        var checkApi=(this.state.orderIds?api.update:api.add);
        var syx=this.syx.getSyx();
        var fjx=this.fjx.getSyx();
        var tbdNum;
        if(syx.length!==1&&syx.length!==3){
            message.warn('请确认投保单数量');
            return;
        }
        if(this.state.haveSyfjx){
            if(fjx.length!==3){
                message.warn('请确认投保单数量');
                return;
            }
            tbdNum=syx.length+fjx.length;
        }else{
            tbdNum=syx.length;
        }
        var tbdImg=this.state.param.tbdOrder.tbdStorageNoList.length;
        if(tbdImg<tbdNum){
            message.warn('投保单图片数量不得少于保单数量');
            return;
        }
        axios.post(checkApi,this.state.param).then((e)=>{
            if(e.code===0){
                message.success(e.msg);
                if(e.data.binded){
                    browserHistory.push('/fq/audit/detail?orderNo='+e.data.orderId+'&type=audit');
                    return;
                }
                this.setState({
                    modal:false
                });
                browserHistory.push('/fq/audit/detail?orderNo='+e.data.orderId+'&type=audit');
                //console.log(e.data)
            }else{
                message.warn('新增失败')
            }

        })
    }
    onBind(e) {
        this.binds=e;
    }
    componentDidMount(){
        axios.get(api.get_me).then(data=>{
            //this.props.form.setFieldsValue({borrowerType:data.data.businessInfo.businessType===1?0:1,orderId:'',beneficiaryType:data.data.businessInfo.businessType===1?0:1});
            this.setState({
                businessType:data.data.businessInfo.businessType===1?0:1,
                haveJqxccs:data.data.businessInfo.haveJqxccs
            })
        })
        this.state.orderIds===undefined?"":this.detail(this.state.orderIds);
        if(this.state.type==='bind'){
            this.binds.setState({
                visible_img:true,
                orderNo:this.state.orderIds
            })
        }
    };
    haveFjx(e){
        this.setState({
            haveSyfjx:e
        })
    }
    detail(e){
        var rqd={orderId:e};
        var syx=[],fjx=[],jqx=[];
        axios_form.post(api.edit,rqd).then(data=>{
            if(data.code===0){
                //alert(1)
                this.setState({
                    businessType:data.data.borrowerType
                });
                var totalData=data.data;
                var basicInfo=data.data.borrowerPerson;
                var tbdLists=totalData.tbdOrder.tbdDetailList;
                var simpleStorages=data.data.simpleStorageList;
                var carUseType=(totalData.carUseType===0?'true':'false');
                var car;
                totalData.carUseType===0?car=totalData.unusedCar:car=totalData.usedCar;
                if(data.data.borrowerType==0){
                    //个人编辑
                    this.person.setState({
                        phone:basicInfo.phone
                    })
                    this.person.props.form.setFieldsValue({'phone':basicInfo.phone});
                    this.person.borrower_info(1);
                    this.person.props.form.setFieldsValue({carId:totalData.carId.toString()})
                }else{
                    //企业编辑
                    this.person.props.form.setFieldsValue({beneficiaryBusinessId:totalData.beneficiaryBusinessId.toString(),borrowerBusinessId:totalData.borrowerBusinessId.toString(),borrowerBusinessAgentId:totalData.borrowerBusinessAgentId.toString(),borrowerBusinessBankId:totalData.borrowerBusinessBankId.toString(),'show.bank':totalData.borrowerBusinessBank.bank,'show.phone':totalData.borrowerBusinessAgent.phone,'show.idCard':totalData.borrowerBusinessAgent.idCard});
                    this.person.props.form.setFieldsValue({'tbdSyxStorageNoList':totalData.tbdOrder.tbdSyxStorageNoList===null?'':totalData.tbdOrder.tbdSyxStorageNoList})
                    this.person.beneficiaryChange(totalData.beneficiaryBusinessId.toString(),true,totalData.borrowerBusinessId.toString());
                    if(totalData.carUseType===0){
                        this.props.form.setFieldsValue({'unusedCar.ownerName':totalData.unusedCar.ownerName,'unusedCar.engineNo':totalData.unusedCar.engineNo,'unusedCar.vinNo':totalData.unusedCar.vinNo});
                        this.props.form.setFieldsValue({'unusedCar.invoiceStorageNoList':totalData.unusedCar.invoiceStorageNoList===null?'':totalData.unusedCar.invoiceStorageNoList})
                    }else{
                        this.props.form.setFieldsValue({'usedCar.ownerName':totalData.usedCar.ownerName,'usedCar.engineNo':totalData.usedCar.engineNo,'usedCar.plateNo':totalData.usedCar.plateNo,'usedCar.vinNo':totalData.usedCar.vinNo})
                        this.props.form.setFieldsValue({'usedCar.drivingLicFbStorageNo':totalData.usedCar.drivingLicFbStorageNo===null?'':totalData.usedCar.drivingLicFbStorageNo,'usedCar.drivingLicZbStorageNo':totalData.usedCar.drivingLicZbStorageNo===null?'':totalData.usedCar.drivingLicZbStorageNo})
                    }
                }

                this.product.getRate(totalData.tbdOrder.productId);
                this.product.props.form.setFieldsValue({'productId':totalData.tbdOrder.productId.toString()});
                this.product.props.form.setFieldsValue({'multipleRate':totalData.tbdOrder.multipleRate+'%'});
                this.info.props.form.setFieldsValue({'clerkId':totalData.clerkId.toString(),borrowerType:totalData.borrowerType,beneficiaryType:totalData.beneficiaryType});
                this.product.props.form.setFieldsValue({loanBasis:totalData.loanBasis});
                //是否显示车辆信息
                data.data.borrowerType===1?this.car.props.form.setFieldsValue({'carUseType':totalData.carUseType}):'';
                //保单分类
                for(var j in tbdLists){
                    if(tbdLists[j].type===1){
                        this.syx.receipt(tbdLists[j].insurCompanyId.toString());
                        this.syx.props.form.setFieldsValue({insurCompanyId:tbdLists[j].insurCompanyId.toString(),receiptId:tbdLists[j].receiptId.toString()+'-'+tbdLists[j].receiptName});
                        syx.push(tbdLists[j]);
                    }else if(tbdLists[j].type===2){
                        this.fjx.receipt(tbdLists[j].insurCompanyId.toString());
                        this.fjx.props.form.setFieldsValue({insurCompanyId:tbdLists[j].insurCompanyId.toString(),receiptId:tbdLists[j].receiptId.toString()+'-'+tbdLists[j].receiptName});
                        fjx.push(tbdLists[j]);
                    }else{
                        this.jqx.receipt(tbdLists[j].insurCompanyId.toString());
                        this.jqx.props.form.setFieldsValue({insurCompanyId:tbdLists[j].insurCompanyId.toString(),receiptId:tbdLists[j].receiptId.toString()+'-'+tbdLists[j].receiptName,jqx:tbdLists[j].jqx/100,ccs:tbdLists[j].ccs/100,startDate:moment(tbdLists[j].startDate).format('YYYY-MM-DD'),endDate:moment(tbdLists[j].endDate).format('YYYY-MM-DD')});
                        jqx.push(tbdLists[j]);
                        this.jqx.setState({
                            start:moment(tbdLists[j].startDate),
                            end:moment(tbdLists[j].endDate)
                        })
                    }
                }
                for(var i in simpleStorages){
                    if(simpleStorages[i].storageNos!==null){
                        var usage=simpleStorages[i].usage;
                        var NoArr=[];
                        if(usage==='tbdStorageNoList'||usage==='invoiceStorageNoList'){
                            var storageNosArr=eval('('+simpleStorages[i].storageNos+')');
                            for(var j in storageNosArr){
                                var tbdstorageNos={};
                                tbdstorageNos.uid=i+j;
                                tbdstorageNos.url=host+api.gtask_img_url+'?storageNo='+storageNosArr[j];
                                tbdstorageNos.name=storageNosArr[j];
                                tbdstorageNos.status='done';
                                NoArr.push(tbdstorageNos)
                            }
                        }else{
                            var storageNos={};
                            storageNos.uid=i;
                            storageNos.url=host+api.gtask_img_url+'?storageNo='+simpleStorages[i].storageNos;
                            storageNos.name=simpleStorages[i].storageNos;
                            storageNos.status='done';
                            NoArr.push(storageNos);
                        }
                        //this.setState({
                        //    [usage]:NoArr
                        //})
                        this.info.setState({
                            [usage]:NoArr
                        })
                        if(usage==='tbdStorageNoList'){
                            this.info.props.form.setFieldsValue({[usage]:eval('('+simpleStorages[i].storageNos+')')})
                        }

                    }
                }
                this.setState({
                    basicInfo:basicInfo,
                    totalData:totalData,
                    newCar:carUseType,
                    car:car,
                    syxList:syx,
                    fjxList:fjx,
                    productRateId:totalData.tbdOrder.productRateId.toString(),   //编辑获取综合费用
                    calc:true,  //编辑显示分期方案
                    productId:totalData.tbdOrder.productId.toString()   //编辑获取分期产品

                })
                this.getCalc()
                //this.child.setState({
                //    tbdList:tbdLists,
                //    businessType:totalData.businessType
                //})

            }
        })
    }

    onSyx(ref) {
        this.syx=ref;
    }
    onFjx(ref) {
        this.fjx=ref;
    }
    onJqx(ref) {
        this.jqx=ref;
    }
    onProduct(ref){
        this.product=ref;
    }
    onInfo(ref){
        this.info=ref;
    }
    onPerson(e){
        this.person=e;
    }
    onCar(e){
        this.car=e;
    }
    getCalc(e){
        var syx=this.syx.syx();var fjx;
        this.state.haveSyfjx?fjx=this.fjx.syx():0;
        var syxTotal=parseInt((syx+fjx)*100);
        if(this.state.productId===''){
            message.warn('请选择分期产品');
            return;
        }
        if(this.state.productRateId===''){
            message.warn('请选择综合费用');
            return;
        }
        this.setState({
            syxTotal:syxTotal
        })
        var rqd='?productId='+this.state.productId+'&productRateId='+this.state.productRateId+'&syx='+syxTotal;
        axios.get(api.calc+rqd).then((e)=>{
            if(e.code===0){
                var data=e.data;
                this.setState({
                    schemeItemList:data,
                    calc:true
                })
            }

        })
    }
    getProduct(id,rate){
        this.setState({
            productId:id,
            productRateId:rate
        })
    }
    cancel() {
        this.setState({
            modal:false
        })
    }
    applicant_cancel() {
        this.setState({
            applicant:false
        })
    }
    send_plan(){
        var engineNo='';
        if(this.state.newCar==='false'){
            engineNo=this.props.form.getFieldValue('usedCar.engineNo');
        }else{
            engineNo=this.props.form.getFieldValue('unusedCar.engineNo');
        }
        var phone=this.props.form.getFieldValue('beneficiaryPerson.phone');
        if(engineNo===''){
            message.warn('请输入发动机号');
            return;
        }
        if(phone===''){
            message.warn('请输入被保人手机号');
            return;
        }
        var rqd='?productId='+this.state.productId+'&productRateId='+this.state.productRateId+'&syx='+this.state.syxTotal+'&engineNo='+engineNo+'&phone='+phone;
        axios.get(api.push_plan+rqd).then(data=>{
            if(data.code===0){
                message.success('推送成功')
            }
        })

    }
    render() {
        const applicant_sure=(
            <div style={{textAlign:"center"}}>
                {
                    //<Col span={24} style={{backgroundImage: 'linear-gradient(-1deg, #1991EB 2%, #2DA1F8 98%)'}}>确定</Col>

                }
                <Button type='primary' onClick={this.applicant_cancel.bind(this)}>确定</Button>
            </div>
        );

        const applicant={
            title:"确认投保人信息",
            visible:this.state.applicant,
            footer:applicant_sure,
            onCancel:this.applicant_cancel.bind(this)
        }
        return (
            <div style={{background:"#fff"}}>
                <div className="applyTitle"><Icon type="file-text" style={{marginRight:"10px"}}/>分期订单申请</div>
                <Row span={24} style={{background:"#EFF3F6"}}>
                    <Col span={11} style={{paddingTop:"33px",paddingBottom:"43px",background:"#fff",borderRight:"1px solid #CED0DA"}}>

                        <Row style={{borderBottom:"1px solid #CED0DA"}}>
                            {
                                this.state.businessType?<Company></Company>:<Person onRef={this.onPerson.bind(this)} orderId={this.state.orderIds}></Person>
                            }

                        </Row>
                        {
                            this.state.businessType ? <Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                                <Car onRef={this.onCar.bind(this)}></Car>
                            </Row> : ''
                        }

                        <Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                            <Product onRef={this.onProduct.bind(this)} show={this.haveFjx.bind(this)} product={this.getProduct.bind(this)} ></Product>
                        </Row>

                        <Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                            <Insurance onRef={this.onSyx.bind(this)} productId={this.state.productId}
                                       rateId={this.state.productRateId} calc={this.getCalc.bind(this)}
                                       syxList={this.state.syxList} orderId={this.state.orderIds}
                                       type={this.state.businessType}></Insurance>
                        </Row>
                        {
                            this.state.haveSyfjx?<Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                                <Syxfj onRef={this.onFjx.bind(this)} type={this.state.businessType} calc={this.getCalc.bind(this)} fjxList={this.state.fjxList} orderId={this.state.orderIds}></Syxfj>
                            </Row>:''
                        }
                        {
                            this.state.haveJqxccs?<Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                                <Syxjq onRef={this.onJqx.bind(this)}></Syxjq>
                            </Row>:''
                        }

                        <Row>
                            <Info type={this.state.businessType} onRef={this.onInfo.bind(this)}></Info>
                        </Row>

                        <Col span={6} push={9} style={{marginTop:'10px'}}>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交分期申请</Button>
                        </Col>
                    </Col>
                    <Col span={13} className="calculate" style={{background:"#EFF3F6"}}>
                        {
                            this.state.calc?<Row>
                                <Row style={{borderBottom:"1px solid #CED0DA"}}>
                                    <Col span={4} className="key">分期方案</Col>
                                    <Col span={12} className="val">首付款比例为商业险总额{this.state.schemeItemList.discountRate}%</Col>
                                    {
                                        //<Col span={7} pull={1} style={{textAlign:"right",lineHeight:"69px"}}><Button className="ant-btn-up" onClick={this.send_plan.bind(this)}>推送试算方案</Button></Col>
                                    }
                                </Row>
                                <Row style={{borderBottom:"1px solid #CED0DA"}}>
                                    <Col span={4} className="key">分期总额</Col>
                                    <Col span={8} className="val">{(parseFloat(this.state.schemeItemList.loanMoney/100).toFixed(2))}元</Col>
                                    <Col span={4} className="key">分期期数</Col>
                                    <Col span={8} className="val">{this.state.schemeItemList.periods}期</Col>
                                </Row>
                                <Row style={{height:"101px",marginTop:"20px",padding:"20px",borderTop:"1px solid #CED0DA"}}>
                                    <Col span={2} style={{fontSize:"14px",color:"#444"}}>首付</Col>
                                    <Col span={14}><div style={{fontSize:"36px",color:"#F66604",height:"36px",lineHeight:"36px"}}>{parseFloat(this.state.schemeItemList.downPayment/100).toFixed(2)}<span style={{fontSize:"14px"}}>元</span></div><div style={{fontSize:"12px",color:"#444"}}>（商业险总额{this.state.schemeItemList.syx/100}*{this.state.schemeItemList.discountRate}%）</div></Col>

                                </Row>
                                <Row style={{textAlign:"center",borderLeft:"none"}}>
                                    <Table dataSource={this.state.schemeItemList.schemeItemList} columns={this.columns} pagination={false} bordered={true} className='table-calc' rowKey='period' ></Table>
                                </Row>
                            </Row>:''
                        }
                    </Col>

                    <div className="result">试算结果</div>
                    <ModalMessage visible={this.state.modal} cancel={this.cancel.bind(this)} tbd={this.state.tbdDatas} tbdSure={this.tbdSure.bind(this)}></ModalMessage>
                </Row>
                <Bind set-bind={this.onBind.bind(this)} ></Bind>
                <Modal {...applicant}>
                    <div style={{fontSize:"16px",textAlign:"left",paddingBottom:"20px",width:"70%",margin:"0 auto"}}>投保人：广州市智度互联网小额贷款有限公司</div>
                    <div style={{fontSize:"16px",textAlign:"left",paddingBottom:"20px",width:"70%",margin:"0 auto"}}>组织代码：91440101MA59UGWK9Y</div>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(ApplySecond);
