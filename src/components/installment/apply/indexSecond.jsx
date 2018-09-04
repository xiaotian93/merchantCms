import React , { Component } from 'react';
import { Row , Col , Table , Form , Checkbox , Button , Icon , Select , Input ,Radio ,Upload,List,DatePicker,message,Modal} from 'antd';
import {host} from '../../../ajax/config.js';
import api from '../../../ajax/api.js';
import axios from '../../../ajax/request.js';
import axios_form from '../../../ajax/request_form';
import Insurance from './tbdMore';
import {format_date} from '../../../ajax/tool';
import ModalMessage from './insurance_message';
import { browserHistory } from 'react-router';
import Bind from './bind';
import Person from './recognizee_person';
import Company from './recognizee_company';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {  RangePicker } = DatePicker;

const businessType='';
class ApplySecond extends  Component {
    constructor(props) {
        super(props);
        this.state={
            drivingLicZbStorageNo:[],  //行驶证正本
            drivingLicFbStorageNo:[],  //行驶证副本
            invoiceStorageNoList:[],  //新车发票
            tbdSyxStorageNoList:[],  //保单
            idCardZmStorageNo:[],  //身份证正面
            idCardFmStorageNo:[],  //身份证反面
            newCar:'false',
            name:'',
            idCard:"",
            phone:"",
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
            tbdDatas:[
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
            ordinalArr:[
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
            year:[
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
            tbdList:[
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
            businessType:''
        }
        this.columns=[
            {dataIndex:"period",width:'33.33%'},
            {dataIndex:'repayDate',width:'33.33%',render:(e)=>{return format_date(e).split(' ')[0]}},
            {dataIndex:'money',width:'33.33%',render:(e)=>{return parseFloat(e/100).toFixed(2)+'元'}}
        ]

    }
    handleSubmit = (e) => {
        e.preventDefault();
        //const car=(this.state.newCar==='false'?1:0);
        //console.log(this.child.getDate());
        //this.props.form.setFieldsValue({loanBasis:this.state.loanBasis,carUseType:car,borrowerType:0,orderId:''});
        //this.props.form.setFieldsValue({'borrowerPerson.name':this.state.name},{'borrowerPerson.idCard':this.state.idCard},{'borrowerPerson.phone':this.state.phone});
        var tbd=this.child.getDate(),arr=[],receipt=[],tbds=this.child.getDate();
        for(var i in tbd){
            var time=tbd[i]['syxStartDate'];
            var receiptId=tbd[i]['receiptId'];
            var syx=tbd[i]['syx'];
            if(tbd[i]['syxStartDate']!==undefined&&tbd[i]['syxEndDate']!==undefined){
            tbd[i]['syxStartDate']=tbd[i]['syxStartDate'].format('YYYY-MM-DD');
            tbd[i]['syxEndDate']=tbd[i]['syxEndDate'].format('YYYY-MM-DD');
            tbd[i]['year']=time.format('YYYY-MM-DD').split('-')[0];
            }

            if(receiptId!=''){
                tbd[i]['receiptId']=receiptId.split('-')[0];
                tbd[i]['receiptName']=receiptId.split('-')[1];
            }
            if(syx!==''){
                tbd[i]['syx']=syx*100;
            }
            receipt.push(tbd[i])
        }
        for(var p in tbds){
            var times=tbds[p]['syxStartDate'];
            var receiptIds=tbds[p]['receiptId'];
            var syxs=tbds[p]['syx'];
            if(tbds[p]['syxStartDate']!==undefined&&tbds[p]['syxEndDate']!==undefined){
            tbds[p]['syxStartDate']=tbds[p]['syxStartDate'].format('YYYY-MM-DD');
            tbds[p]['syxEndDate']=tbds[p]['syxEndDate'].format('YYYY-MM-DD');
            }
            if(receiptIds!==''){
                tbds[p]['receiptId']=receiptIds.split('-')[0];
            }
            if(syxs!==''){
                tbds[p]['syx']=syxs*100;
            }
            arr.push(tbds[p])
            delete tbds[p].receiptName;
            delete tbds[p].year;
            //console.log(arr)

        }
        this.props.form.setFieldsValue({'tbdOrder.tbdDetailList':arr});
        function sortArr(arr, str) {
            var _arr = [],
                _t = [],
            // 临时的变量
                _tmp;

            // 按照特定的参数将数组排序将具有相同值得排在一起
            arr = arr.sort(function(a, b) {
                var s = a[str],
                    t = b[str];

                return s < t ? -1 : 1;
            });
            //console.log(arr);
            if ( arr.length ){
                _tmp = arr[0][str];
            }
            // console.log( arr );
            // 将相同类别的对象添加到统一个数组
            for (var i in arr) {
                //console.log( _tmp);
                if ( arr[i][str] === _tmp ){
                    _t.push( arr[i] );
                    _t=_t.sort(function(a, b) {
                        var s = a['ordinal'],
                            t = b['ordinal'];

                        return s < t ? -1 : 1;
                    });
                } else {
                    _tmp = arr[i][str];
                    _arr.push( _t );
                    _t = [arr[i]];
                }
            }
            // 将最后的内容推出新数组
            //_t=_t.sort(function(a, b) {
            //    var s = a['ordinal'],
            //        t = b['ordinal'];
            //
            //    return s < t ? -1 : 1;
            //});
            //console.log(_t);
            _arr.push( _t );
            return _arr;
        }
        var testArr=[],tempArr=[];
        var ordinalArr=sortArr( receipt, 'receiptName');   //投保单根据机构划分
        var year=sortArr( receipt, 'year');   //投保单根据年限划分
        //for(var o in ordinalArr){
        //    //ordinalArr[o].sort(this.compare('ordinal'));
        //    testArr.push(sortArr(ordinalArr[o],'ordinal'));
        //}
        for(var m in testArr){
            for(var n in testArr[m]){
                tempArr.push(testArr[m][n])
            }
        }
        //console.log(ordinalArr)
        var tbdList=this.person.props.form.getFieldValue('tbdSyxStorageNoList');

        this.person.props.form.validateFields();
        this.props.form.validateFields((err, values) => {
            var person=this.person.props.form.getFieldsValue();
            var test=values;
            for(var i in person){
                if(i==='tbdSyxStorageNoList'){
                    test.tbdOrder[i]=person[i]
                }else{
                    test[i]=person[i]
                }

            }
            //console.log(tbdList,arr)
            if (!err) {

                if(tbdList.length<arr.length){
                    message.warn('投保单上传图片不得少于投保单数量');
                    return;
                }
                this.setState({
                    modal:true,
                    tbdData:receipt,  //判断收款机构与每个机构单数
                    tbdDatas:ordinalArr,
                    ordinalArr:ordinalArr,
                    year:year
                })
            }else{
                message.warn('必填信息不能为空')
            }
        });

    };
    tbdSure() {
        var checkApi=(this.state.orderIds?api.update:api.add);
        var tbd=this.state.ordinalArr;
        var year=this.state.year;
        var tbdNum=0;
        for(var s in tbd){
            if(tbd[s][0].receiptName!==''){
                tbdNum+=parseInt(tbd[s].length);
            }
            if(this.state.businessType==0){
                if(tbd[s][0].receiptName!==''&&tbd.length>2){
                    message.warn('收款机构最多2个，请核对确认');
                    return;
                }else if(tbd[s].length>3){
                    message.warn('每个收款机构最多3单，请核对确认');
                    return;
                }else if(tbd.length===2&&tbd[s].length===2){
                    message.warn('请确认收款机构');
                    return;
                }
            }else{
                if(tbd[s].length>1){
                    message.warn('请确认收款机构');
                    return;
                }
            }

        }
        if(this.state.businessType==0){
            if(tbdNum!==6&&tbdNum!==1&&tbdNum!==3&&tbdNum!==4){
                //console.log(tbdNum)
                message.warn('请确认投保单数量');
                return;
            }
            if(tbdNum===3&&tbd.length>1){
                message.warn('请确认收款机构');
                return;
            }
            for(var j in year){
                if(year[j].length>2){
                    message.warn('同一年投保单最多两单');
                    return;
                }else if(year[j].length===2){
                    if(year[j][0].syxStartDate!==year[j][1].syxStartDate||year[j][0].syxEndDate!==year[j][1].syxEndDate){
                        message.warn('同一年投保单起止日期必须相同');
                        return;
                    }
                }

            }
        }else{
            if(tbdNum!==1&&tbdNum!==2){
                //console.log(tbdNum)
                message.warn('请确认投保单数量');
                return;
            }
        }


        this.props.form.validateFields((err, values) => {
            //保单被保信息
            var person=this.person.props.form.getFieldsValue();
            var test=values;
            for(var i in person){
                if(i==='tbdSyxStorageNoList'){
                    test.tbdOrder[i]=person[i]
                }else{
                    test[i]=person[i]
                }
            }
            delete test.show;
            if (!err) {
                //console.log(values)
                if(this.state.newCar==='false'){
                    delete values.unusedCar
                }else{
                    delete values.usedCar
                }
                axios.post(checkApi,test).then((e)=>{
                    if(e.code===0){
                        message.success(e.msg);
                        if(e.data.binded){
                            browserHistory.push('/fq/audit/detail?orderNo='+e.data.orderId+'&type=audit');
                            return;
                        }
                        //this.binds.setState({
                        //    visible_img:true,
                        //    orderNo:e.data.orderId
                        //})
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
        });
    }
    onBind(e) {
        this.binds=e;
    }
    componentDidMount(){
        axios.get(api.get_me).then(data=>{
            this.props.form.setFieldsValue({borrowerType:data.data.businessInfo.businessType===1?0:1,orderId:'',beneficiaryType:data.data.businessInfo.businessType===1?0:1});
            this.setState({
                businessType:data.data.businessInfo.businessType===1?0:1
            })
        })
        this.getOption();
        this.state.orderIds===undefined?"":this.detail(this.state.orderIds);
        if(this.state.type==='bind'){
            this.binds.setState({
                visible_img:true,
                orderNo:this.state.orderIds
            })
        }
    };

    detail(e){
        var rqd={orderId:e};
        axios_form.post(api.edit,rqd).then(data=>{
            if(data.code===0){
                //alert(1)
                this.setState({
                    businessType:data.data.borrowerType
                })
                var totalData=data.data;
                var basicInfo=data.data.borrowerPerson;
                var tbdLists=totalData.tbdOrder.tbdDetailList;
                var simpleStorages=data.data.simpleStorageList;
                var carUseType=(totalData.carUseType===0?'true':'false');
                var car;
                totalData.carUseType===0?car=totalData.unusedCar:car=totalData.usedCar;
                if(data.data.borrowerType==0){
                    //个人编辑
                    //图片编辑
                    this.person.props.form.setFieldsValue({'borrowerPerson.idCardFmStorageNo':basicInfo.idCardFmStorageNo===null?'':basicInfo.idCardFmStorageNo,'borrowerPerson.idCardZmStorageNo':basicInfo.idCardZmStorageNo===null?'':basicInfo.idCardZmStorageNo,'tbdSyxStorageNoList':totalData.tbdOrder.tbdSyxStorageNoList===null?'':totalData.tbdOrder.tbdSyxStorageNoList});
                    //图片编辑结束
                    this.person.props.form.setFieldsValue({'borrowerPerson.name':basicInfo.name,'borrowerPerson.idCard':basicInfo.idCard,'borrowerPerson.phone':basicInfo.phone,'borrowerPerson.bank':basicInfo.bank,'borrowerPerson.bankCard':basicInfo.bankCard});
                    this.person.props.form.setFieldsValue({'beneficiaryPerson.name':basicInfo.name,'beneficiaryPerson.idCard':basicInfo.idCard,'beneficiaryPerson.phone':basicInfo.phone});
                }else{
                    //企业编辑

                    this.person.props.form.setFieldsValue({beneficiaryBusinessId:totalData.beneficiaryBusinessId.toString(),borrowerBusinessId:totalData.borrowerBusinessId.toString(),borrowerBusinessAgentId:totalData.borrowerBusinessAgentId.toString(),borrowerBusinessBankId:totalData.borrowerBusinessBankId.toString(),'show.bank':totalData.borrowerBusinessBank.bank,'show.phone':totalData.borrowerBusinessAgent.phone,'show.idCard':totalData.borrowerBusinessAgent.idCard});
                    this.person.props.form.setFieldsValue({'tbdSyxStorageNoList':totalData.tbdOrder.tbdSyxStorageNoList===null?'':totalData.tbdOrder.tbdSyxStorageNoList})
                    this.person.beneficiaryChange(totalData.beneficiaryBusinessId.toString(),true,totalData.borrowerBusinessId.toString());
                    //setTimeout(function(){
                    //    this.person.borrowerBusinessChange(totalData.borrowerBusinessId.toString());
                    //}.bind(this),1000)
                }

                this.getRate(totalData.tbdOrder.productId);
                this.props.form.setFieldsValue({'tbdOrder.productId':totalData.tbdOrder.productId.toString()});
                this.props.form.setFieldsValue({'tbdOrder.productRateId':totalData.tbdOrder.productRateId.toString()});
                this.person.props.form.setFieldsValue({'clerkId':totalData.clerkId.toString()});
                this.props.form.setFieldsValue({loanBasis:totalData.loanBasis,borrowerType:totalData.borrowerType,orderId:totalData.orderId,beneficiaryType:totalData.beneficiaryType});

                this.props.form.setFieldsValue({'carUseType':totalData.carUseType});

                for(var i in simpleStorages){
                    if(simpleStorages[i].storageNos!==null){
                        var usage=simpleStorages[i].usage;
                        var NoArr=[];
                        if(usage==='tbdSyxStorageNoList'||usage==='invoiceStorageNoList'){
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
                        this.setState({
                            [usage]:NoArr
                        })
                        this.person.setState({
                            [usage]:NoArr
                        })
                    }



                }
                this.setState({
                    basicInfo:basicInfo,
                    totalData:totalData,
                    newCar:carUseType,
                    car:car,
                    //name:basicInfo.name,
                    //phone:basicInfo.phone,
                    //idCard:basicInfo.idCard,
                    tbdList:tbdLists,
                    productRateId:totalData.tbdOrder.productRateId.toString(),   //编辑获取综合费用
                    calc:true,  //编辑显示分期方案
                    productId:totalData.tbdOrder.productId.toString()   //编辑获取分期产品

                })
                this.child.setState({
                    tbdList:tbdLists,
                    businessType:totalData.businessType
                })
                if(totalData.carUseType===0){
                    this.props.form.setFieldsValue({'unusedCar.ownerName':totalData.unusedCar.ownerName,'unusedCar.engineNo':totalData.unusedCar.engineNo,'unusedCar.vinNo':totalData.unusedCar.vinNo});
                    this.props.form.setFieldsValue({'unusedCar.invoiceStorageNoList':totalData.unusedCar.invoiceStorageNoList===null?'':totalData.unusedCar.invoiceStorageNoList})
                }else{
                    this.props.form.setFieldsValue({'usedCar.ownerName':totalData.usedCar.ownerName,'usedCar.engineNo':totalData.usedCar.engineNo,'usedCar.plateNo':totalData.usedCar.plateNo,'usedCar.vinNo':totalData.usedCar.vinNo})
                    this.props.form.setFieldsValue({'usedCar.drivingLicFbStorageNo':totalData.usedCar.drivingLicFbStorageNo===null?'':totalData.usedCar.drivingLicFbStorageNo,'usedCar.drivingLicZbStorageNo':totalData.usedCar.drivingLicZbStorageNo===null?'':totalData.usedCar.drivingLicZbStorageNo})
                }
            }
        })
    }
    getOption() {
        axios.get(api.product_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                product_list:data
            })
        });

        axios.get(api.clerk_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                clerk_list:data
            })
        })
    }
    ImgChange(e) {
        var arr=[];
        arr.push(e.fileList[e.fileList.length-1]);
        if(arr[0].size>20000000){
            message.warn('图片不能大于20M');
            return;
        }
        this.setState({
            drivingLicZbStorageNo:arr
        })
        //console.log(arr)
        if(arr[0].response){
            if(arr[0].response.code===0){
                this.props.form.setFieldsValue({'usedCar.drivingLicZbStorageNo':arr[0].response.data.storageNo});

            }else{
                message.warn(arr[0].response.msg);
                return
            }
        }else{
            this.props.form.setFieldsValue({'usedCar.drivingLicZbStorageNo':''});

        }
    }
    drivingLicFbStorageNo(e) {
        var arr=[];
        arr.push(e.fileList[e.fileList.length-1]);
        if(arr[0].size>20000000){
            message.warn('图片不能大于20M');
            return;
        }
        this.setState({
            drivingLicFbStorageNo:arr
        })

        if(arr[0].response){
            if(arr[0].response.code===0){
                this.props.form.setFieldsValue({'usedCar.drivingLicFbStorageNo':arr[0].response.data.storageNo});

            }else{
                message.warn(arr[0].response.msg);
                return;
            }
        }else{
            this.props.form.setFieldsValue({'usedCar.drivingLicFbStorageNo':''});

        }
    }
    invoiceStorageNoList(e) {
        if(e.fileList.length>5){
            message.warn('最多可上传5张');
            return;
        }
        for(var i in e.fileList){
            if(e.fileList[i].size>20000000){
                message.warn('图片不能大于20M');
                return;
            }
        }
        var arr=[];
        this.setState({
            invoiceStorageNoList:e.fileList
        });
        for(var i in e.fileList){
            if(e.fileList[i].status==="done"){
                //arr.push(e.fileList[i].response?e.fileList[i].response.data.storageNo:e.fileList[i].name)
                if(e.fileList[i].response){
                    if(e.fileList[i].response.code===0){
                        arr.push(e.fileList[i].response.data.storageNo)
                    }else{
                        message.warn(e.fileList[i].response.msg);
                        return;
                    }
                }else{
                    arr.push(e.fileList[i].name)
                }
            }
        }
        this.props.form.setFieldsValue({'unusedCar.invoiceStorageNoList':arr});

    }
    idCardZmStorageNo(e) {
        var arr=[];
        arr.push(e.fileList[e.fileList.length-1]);
        if(arr[0].size>20000000){
            message.warn('图片不能大于20M');
            return;
        }
        this.setState({
            idCardZmStorageNo:arr
        })
        //this.props.form.setFieldsValue({'borrowerPerson.idCardZmStorageNo':arr[0].response&&arr[0].response.code===0?arr[0].response.data.storageNo:[]});
        if(arr[0].response){
            if(arr[0].response.code===0){
                this.props.form.setFieldsValue({'borrowerPerson.idCardZmStorageNo':arr[0].response.data.storageNo});
            }else{
                message.warn(arr[0].response.msg);
                return;
            }
        }else{
            this.props.form.setFieldsValue({'borrowerPerson.idCardZmStorageNo':''});
        }
    }
    idCardFmStorageNo(e) {
        var arr=[];
        arr.push(e.fileList[e.fileList.length-1]);
        if(arr[0].size>20000000){
            message.warn('图片不能大于20M');
            return;
        }
        this.setState({
            idCardFmStorageNo:arr
        })
        //this.props.form.setFieldsValue({'borrowerPerson.idCardFmStorageNo':arr[0].response&&arr[0].response.code===0?arr[0].response.data.storageNo:[]});
        if(arr[0].response){
            if(arr[0].response.code===0){
                this.props.form.setFieldsValue({'borrowerPerson.idCardFmStorageNo':arr[0].response.data.storageNo});
            }else{
                message.warn(arr[0].response.msg);
                return
            }
        }else{
            this.props.form.setFieldsValue({'borrowerPerson.idCardFmStorageNo':''});
        }
    }
    tbdSyxStorageNoList(e) {
        console.log(e)
        if(e.fileList.length>20){
            message.warn('最多可上传20张');
            return;
        }
        for(var j in e.fileList){
            if(e.fileList[j].size>20000000){
                message.warn('图片不能大于20M');
                return;
            }
        }
        var arr=[];
        this.setState({
            tbdSyxStorageNoList:e.fileList
        });
        for(var i in e.fileList){
            if(e.fileList[i].status==="done"){
                //arr.push(e.fileList[i].response?e.fileList[i].response.data.storageNo:e.fileList[i].name)
                if(e.fileList[i].response){
                    if(e.fileList[i].response.code===0){
                        arr.push(e.fileList[i].response.data.storageNo)
                    }else{
                        message.warn(e.fileList[i].response.msg);
                        return;
                    }
                }else{
                    arr.push(e.fileList[i].name)
                }
            }
        }
        this.props.form.setFieldsValue({'tbdOrder.tbdSyxStorageNoList':arr});

    }
    drivingLicZbStorageNoRemove() {
        this.setState({
            drivingLicZbStorageNo:[]
        })
    }
    invoiceStorageNoRemove() {
        this.setState({
            invoiceStorageNoList:[]
        })
    }
    drivingLicFbStorageNoRemove() {
        this.setState({
            drivingLicFbStorageNo:[]
        })
    }
    tbdSyxStorageNoListRemove() {
        this.setState({
            tbdSyxStorageNoList:[]
        })
    }
    idCardZmStorageNoRemove() {
        this.setState({
            idCardZmStorageNo:[]
        })
    }
    idCardFmStorageNoRemove() {
        this.setState({
            idCardFmStorageNo:[]
        })
    }

    isNewcar(e) {
        //console.log(`${e.target.checked}`);
        const cars=(`${e.target.checked}`==='false'?1:0);
        this.setState({
            newCar:`${e.target.checked}`
        })
        if(`${e.target.checked}`==='true'){
            this.setState({
                drivingLicZbStorageNo:[],
                drivingLicFbStorageNo:''
            })
        }else{
            this.setState({
                invoiceStorageNoList:[]
            })
        }
        this.props.form.setFieldsValue({carUseType:cars});
    }
    nameChange(e) {
        this.setState({
            name:e.target.value
        })
        this.props.form.setFieldsValue({'borrowerPerson.name':e.target.value});
    }
    phoneChange(e) {
        this.setState({
            phone:e.target.value
        })
        this.props.form.setFieldsValue({'borrowerPerson.phone':e.target.value});
    }
    idChange(e) {
        this.setState({
            idCard:e.target.value
        })
        this.props.form.setFieldsValue({'borrowerPerson.idCard':e.target.value});
    }
    getRate(e) {
        var data=this.state.product_list;
        for(var i in data){
            if(data[i].id==e){
                this.setState({
                    rateList:data[i].rateList,
                    loanBasis:data[i].loanBasis,
                    productId:e
                })
                this.props.form.setFieldsValue({loanBasis:data[i].loanBasis});
            }
        }
    }
    getRateId(e){
        this.setState({
            productRateId:e
        })
    }
    onRef(ref) {
        this.child=ref;
    }
    onPerson(e){
        this.person=e;
    }
    getCalc(e){
        if(this.state.productId===''){
            message.warn('请选择分期产品');
            return;
        }
        if(this.state.productRateId===''){
            message.warn('请选择综合费用');
            return;
        }
        this.setState({
            syxTotal:e*100
        })
        var rqd='?productId='+this.state.productId+'&productRateId='+this.state.productRateId+'&syx='+e*100;
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
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
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
        function setUpload(rqd,backfn){
            return {
                action:host+api.upload,
                listType:"picture",
                className:"upload-list-inline",
                onChange:function(data){backfn(data,rqd)},
                withCredentials:true,
                data:rqd,
                name:"file"
            }
        }
        function upload(){
            return {

            }
        }
        const drivingLicZbStorageNo={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange usedCar",
            fileList:this.state.drivingLicZbStorageNo,
            onChange:this.ImgChange.bind(this),
            onRemove:this.drivingLicZbStorageNoRemove.bind(this),
            withCredentials:true,
            data:{usage:'drivingLicFbStorageNo'},
            name:"file"
        };
        const drivingLicFbStorageNo={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange usedCar",
            fileList:this.state.drivingLicFbStorageNo,
            onChange:this.drivingLicFbStorageNo.bind(this),
            onRemove:this.drivingLicFbStorageNoRemove.bind(this),
            withCredentials:true,
            data:{usage:'drivingLicFbStorageNo'},
            name:"file"
        };
        const invoiceStorageNoList={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange",
            fileList:this.state.invoiceStorageNoList,
            onChange:this.invoiceStorageNoList.bind(this),
            withCredentials:true,
            data:{usage:'invoiceStorageNoList'},
            name:"file",
            multiple:true
        };
        const tbdSyxStorageNoList={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange",
            fileList:this.state.tbdSyxStorageNoList,
            onChange:this.tbdSyxStorageNoList.bind(this),
            withCredentials:true,
            data:{usage:'tbdSyxStorageNoList'},
            name:"file",
            multiple:true
        };
        const idCardZmStorageNo={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange usedCar",
            fileList:this.state.idCardZmStorageNo,
            onChange:this.idCardZmStorageNo.bind(this),
            onRemove:this.idCardZmStorageNoRemove.bind(this),
            withCredentials:true,
            data:{usage:'idCardZmStorageNo'},
            name:"file"
        };
        const idCardFmStorageNo={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange usedCar",
            fileList:this.state.idCardFmStorageNo,
            onChange:this.idCardFmStorageNo.bind(this),
            onRemove:this.idCardFmStorageNoRemove.bind(this),
            withCredentials:true,
            data:{usage:'idCardFmStorageNo'},
            name:"file"
        };
        var orderIds=this.state.orderIds;
        return (
            <div style={{background:"#fff"}}>
                <div className="applyTitle"><Icon type="file-text" style={{marginRight:"10px"}}/>分期订单申请</div>
                <Row span={24} style={{background:"#EFF3F6"}}>
                    <Col span={11} style={{paddingTop:"33px",paddingBottom:"43px",background:"#fff",borderRight:"1px solid #CED0DA"}}>
                        <Form className='fqsq'>
                            <Row style={{borderBottom:"1px solid #CED0DA"}}>
                                <div className='genre'>
                                    <span className='genreIcon'></span>
                                    <span className='genreTitle'>申请人基本信息</span>
                                </div>
                                <FormItem
                                    label={<span style={{color:"#7F8FA4"}}>分期产品选择</span>}
                                    {...formInit}
                                    >
                                    {getFieldDecorator('tbdOrder.productId', {
                                        rules: [{ required: true, message: '请选择分期产品' }],
                                    })(
                                        <Select
                                            placeholder="请选择" className="width_input" onChange={this.getRate.bind(this)}
                                            >
                                            {
                                                this.state.product_list.map(function(i,k){
                                                    return <Option value={i.id.toString()} key={k}>{i.name}</Option>
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label={<span style={{color:"#7F8FA4"}}>综合费用</span>}
                                    {...formInit}
                                    >
                                    {getFieldDecorator('tbdOrder.productRateId', {
                                        rules: [{ required: true, message: '请选择综合费用' }],
                                    })(
                                        <Select
                                            placeholder="请选择" className="width_input" onChange={this.getRateId.bind(this)}
                                            >
                                            {
                                                this.state.rateList.map(function (i, k) {
                                                    return <Option value={i.productRateId.toString()}
                                                                   key={k}>{i.multipleRate+'%'}</Option>
                                                })
                                            }
                                        </Select>


                                    )}
                                </FormItem>

                                <FormItem style={{marginBottom:"0"}}
                                          wrapperCol={{ span: 10}}
                                    >
                                    {getFieldDecorator('loanBasis', {   //借款依据  0-保单  1-投保单
                                        //rules: [{ required: true, message: 'Please select your gender!' }],
                                    })(
                                        <div>
                                        </div>

                                    )}
                                </FormItem>
                                <FormItem style={{marginBottom:"0"}}
                                          wrapperCol={{ span: 10}}
                                    >
                                    {getFieldDecorator('tbdOrder.tbdDetailList', {
                                        //rules: [{ required: true, message: 'Please select your gender!' }],
                                    })(
                                        <div>
                                        </div>

                                    )}
                                </FormItem>
                                <FormItem style={{marginBottom:"0"}}
                                          wrapperCol={{ span: 10}}
                                    >
                                    {getFieldDecorator('carUseType', {   //车辆  0-新车  1-旧车
                                        //rules: [{ required: true, message: 'Please select your gender!' }],
                                        initialValue:1
                                    })(
                                        <div>
                                        </div>

                                    )}
                                </FormItem>
                                <FormItem style={{marginBottom:"0"}}
                                          wrapperCol={{ span: 10}}
                                    >
                                    {getFieldDecorator('orderId', {   //
                                        //rules: [{ required: true, message: 'Please select your gender!' }],
                                    })(
                                        <div>
                                        </div>

                                    )}
                                </FormItem>
                                <FormItem style={{marginBottom:"0"}}
                                          wrapperCol={{ span: 10}}
                                    >
                                    {getFieldDecorator('borrowerType', {   //借款人类型   0-个人  1-企业
                                        //rules: [{ required: true, message: 'Please select your gender!' }],
                                    })(
                                        <div>
                                        </div>

                                    )}
                                </FormItem>


                            </Row>
                            <Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                                <Insurance onRef={this.onRef.bind(this)} productId={this.state.productId} rateId={this.state.productRateId} calc={this.getCalc.bind(this)} tbdList={this.state.tbdList} orderId={this.state.orderIds} businessType={this.state.businessType} ></Insurance>
                            </Row>
                            {
                                this.state.newCar==="false"?<Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>行驶证</span>}
                                        labelCol={{span: 8}}
                                        wrapperCol={{ span: 15}}
                                        colon={false}
                                        className='uploadXsz'
                                        >
                                        {getFieldDecorator('usedCar.drivingLicZbStorageNo', {
                                            rules: [{ required: true, message: '请上传行驶证' }],
                                        })(
                                            <div></div>
                                        )}
                                        <div>

                                            <Upload {...drivingLicZbStorageNo}>
                                                <Button className="ant-btn-up">正本</Button>
                                            </Upload>
                                            <Upload {...drivingLicFbStorageNo} >
                                                <Button className="ant-btn-up">副本</Button>
                                            </Upload>

                                            <Checkbox onChange={this.isNewcar.bind(this)} >新车未上牌</Checkbox>
                                        </div>
                                    </FormItem>
                                    <FormItem style={{marginBottom:"0"}}
                                        {...formInit}
                                              className='uploadXsf'
                                              wrapperCol={{ span: 10}}
                                        >
                                        {getFieldDecorator('usedCar.drivingLicFbStorageNo', {
                                            rules: [{ required: true, message: '请上传行驶证' }],
                                        })(
                                            <div>
                                            </div>

                                        )}
                                    </FormItem>
                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>车主姓名</span>}
                                        {...formInit}
                                        >
                                        {getFieldDecorator('usedCar.ownerName', {
                                            //initialValue:(orderIds===undefined&&this.state.newCar==='false')?'':this.state.car.ownerName,
                                            rules: [{ required: true, message: '请输入车主姓名' },{pattern:/^[\u4e00-\u9fa5]{1,10}$/,message:"格式错误"}],
                                        })(
                                            <Input className="width_input" placeholder='请输入车主姓名'/>
                                        )}
                                    </FormItem>
                                    {
                                        this.state.newCar==='false'?<FormItem
                                            label={<span style={{color:"#7F8FA4"}}>车牌号</span>}
                                            {...formInit}
                                            >
                                            {getFieldDecorator('usedCar.plateNo', {
                                                rules: [{ required: true, message: '请输入车牌号' }],
                                                //initialValue:orderIds===undefined?'':this.state.car.plateNo,
                                            })(
                                                <Input className="width_input" placeholder='请输入车牌号'/>
                                            )}
                                        </FormItem>:""
                                    }

                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>发动机号</span>}
                                        {...formInit}
                                        >
                                        {getFieldDecorator('usedCar.engineNo', {
                                            rules: [{ required: true, message: '请输入发动机号' }],
                                            //initialValue:orderIds===undefined?'':this.state.car.engineNo,
                                        })(
                                            <Input className="width_input" placeholder='请输入发动机号'/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>车架号/VIN码</span>}
                                        {...formInit}
                                        className='vin'
                                        >
                                        {getFieldDecorator('usedCar.vinNo', {
                                            //initialValue:orderIds===undefined?'':this.state.car.vinNo,
                                            //rules: [{ required: false, message: 'Please select your gender!' }],
                                        })(
                                            <Input className="width_input" placeholder='请输入车架号/VIN码'/>
                                        )}
                                    </FormItem>
                                </Row>:<Row style={{borderBottom:"1px solid #CED0DA",paddingTop:"33px"}}>
                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>发票</span>}
                                        labelCol={{span: 8}}
                                        wrapperCol={{ span: 14}}
                                        colon={false}
                                        className='upload'
                                        >
                                        {getFieldDecorator('unusedCar.invoiceStorageNoList', {
                                            rules: [{ required: true, message: '请上传发票' }],
                                        })(
                                            <div></div>
                                        )}
                                        <div style={{position:"relative"}}>
                                            <Upload {...invoiceStorageNoList}>
                                                <Button className="ant-btn-up">上传</Button>
                                            </Upload>

                                            <Checkbox onChange={this.isNewcar.bind(this)} checked={true} style={{position:"absolute",left:"120px",top:"0"}}>新车未上牌</Checkbox>

                                        </div>
                                    </FormItem>

                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>车主姓名</span>}
                                        {...formInit}
                                        >
                                        {getFieldDecorator('unusedCar.ownerName', {
                                            //initialValue:(orderIds===undefined&&this.state.newCar==='true')?'':this.state.car.ownerName,
                                            rules: [{ required: true, message: '请输入车主姓名' },{pattern:/^[\u4e00-\u9fa5]{1,10}$/,message:"格式错误"}],
                                        })(
                                            <Input className="width_input" placeholder='请输入车主姓名'/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>发动机号</span>}
                                        {...formInit}
                                        >
                                        {getFieldDecorator('unusedCar.engineNo', {
                                            //initialValue:orderIds===undefined?'':this.state.car.engineNo,
                                            rules: [{ required: true, message: '请输入发动机号' }],
                                        })(
                                            <Input className="width_input" placeholder='请输入发动机号'/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        label={<span style={{color:"#7F8FA4"}}>车架号/VIN码</span>}
                                        {...formInit}
                                        className='vin'
                                        >
                                        {getFieldDecorator('unusedCar.vinNo', {
                                            //initialValue:orderIds===undefined?'':this.state.car.vinNo,
                                            //rules: [{ required: false, message: 'Please select your gender!' }],
                                        })(
                                            <Input className="width_input" placeholder='请输入车架号/VIN码'/>
                                        )}
                                    </FormItem>
                                </Row>


                            }
                            <Row style={{marginBottom:"-24px"}}>
                                <FormItem
                                    label={<span style={{color:"#7F8FA4"}}></span>}
                                    {...formInit}
                                    wrapperCol={{ span: 10}}
                                    >
                                    {getFieldDecorator('beneficiaryType', {
                                        //rules: [{ required: false, message: 'Please select your gender!' }],
                                    })(
                                        <div>

                                        </div>
                                    )}
                                </FormItem>

                            </Row>


                        </Form>
                        {
                            this.state.businessType==0?<Person person={this.onPerson.bind(this)}></Person>:<Company person={this.onPerson.bind(this)}></Company>
                        }

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
                                    <Col span={7} pull={1} style={{textAlign:"right",lineHeight:"69px"}}><Button className="ant-btn-up" onClick={this.send_plan.bind(this)}>推送试算方案</Button></Col>
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
