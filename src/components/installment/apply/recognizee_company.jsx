import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message,Upload} from 'antd';
import {host} from '../../../ajax/config.js';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
const FormItem = Form.Item;
const Option = Select.Option;
class Rec_company extends Component{
    constructor(props){
        super(props);
        props.person(this);
        this.state={
            beneficiaryBusiness:[],
            borrowerBusiness:[],
            borrowerBusinessBank:[],
            borrowerBusinessAgent:[],
            tbdSyxStorageNoList:[],
            clerk_list:[]
        }
    }
    componentDidMount() {
        this.beneficiaryBusiness();
    }
    //获取被保企业
    beneficiaryBusiness(){
        var apis=api.beneficiary_business_list;
        axios.get(apis,'').then((e)=>{
            if(e.code===0){
                this.setState({
                    beneficiaryBusiness:e.data
                })
            }
        })
        axios.get(api.clerk_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                clerk_list:data
            })
        })
    }
    //获取还款企业
    beneficiaryChange(e,edit,p) {
        edit=edit||false;
        var getApi=api.borrower_business_list;
        axios.get(getApi+'?beneficiaryBusinessId='+e).then((e)=>{
            if(e.code===0){
                this.setState({
                    borrowerBusiness:e.data
                })
                if(edit){
                    for(var i in e.data){
                        if(e.data[i].id==p){
                            this.setState({
                                borrowerBusinessBank:e.data[i].borrowerBusinessBankList,
                                borrowerBusinessAgent:e.data[i].borrowerBusinessAgentList
                            })
                        }
                    }
                }
            }
        })
    }
    //获取还款企业银行账号
    borrowerBusinessChange(e){
        this.props.form.setFieldsValue({borrowerBusinessBankId:[],borrowerBusinessAgentId:[]})
        var borrowerBusiness=this.state.borrowerBusiness;
        for(var i in borrowerBusiness){
            if(borrowerBusiness[i].id==e){
                this.setState({
                    borrowerBusinessBank:borrowerBusiness[i].borrowerBusinessBankList,
                    borrowerBusinessAgent:borrowerBusiness[i].borrowerBusinessAgentList
                })
            }
        }
    }
    //获取还款企业开户行
    bankChange(e){
        var bank=this.state.borrowerBusinessBank;
        for(var i in bank){
            if(bank[i].id==e){
                this.props.form.setFieldsValue({'show.bank':bank[i].bank})
            }
        }
    }
    //获取经办人信息
    agentChange(e){
        var agent=this.state.borrowerBusinessAgent;
        for(var i in agent){
            if(agent[i].id==e){
                this.props.form.setFieldsValue({'show.phone':agent[i].phone,'show.idCard':agent[i].idCard})
            }
        }
    }
    tbdSyxStorageNoList(e) {
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
        this.props.form.setFieldsValue({'tbdSyxStorageNoList':arr});

    }
    tbdSyxStorageNoListRemove() {
        this.setState({
            tbdSyxStorageNoList:[]
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
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
        return(
            <Row>
                <Form className='fqsq'>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>被保企业名称</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('beneficiaryBusinessId', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请选择被保企业名称' }],
                        })(
                            <Select placeholder='请选择' onChange={this.beneficiaryChange.bind(this)}>
                                {
                                    this.state.beneficiaryBusiness.map((i,k)=>{
                                        return <Option value={i.id.toString()} key={i} >{i.name}</Option>
                                    })
                                }

                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款企业名称</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerBusinessId', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请选择还款企业名称' }],
                        })(
                            <Select placeholder='请选择' onChange={this.borrowerBusinessChange.bind(this)}>
                                {
                                    this.state.borrowerBusiness.map((i,k)=>{
                                        return <Option value={i.id.toString()} key={i} >{i.name}</Option>
                                    })
                                }

                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款企业银行账号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerBusinessBankId', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请选择还款企业银行账号' }],
                        })(
                            <Select placeholder='请选择' onChange={this.bankChange.bind(this)} >
                                {
                                    this.state.borrowerBusinessBank.map((i,k)=>{
                                        return <Option value={i.id.toString()} key={i} >{i.bankCard}</Option>
                                    })
                                }

                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款企业开户行</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('show.bank', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请输入还款企业开户行' }],
                        })(
                            <Input placeholder='请输入还款企业开户行' disabled={true} />

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>经办人姓名</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerBusinessAgentId', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请输入经办人姓名' }],
                        })(
                            <Select placeholder='请选择' onChange={this.agentChange.bind(this)} >
                                {
                                    this.state.borrowerBusinessAgent.map((i,k)=>{
                                        return <Option value={i.id.toString()} key={i} >{i.name}</Option>
                                    })
                                }

                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>经办人手机号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('show.phone', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请输入经办人手机号' }],
                        })(
                            <Input className="width_input" placeholder='请输入经办人手机号' disabled={true}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>经办人身份证号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('show.idCard', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请输入经办人身份证号' }],
                        })(
                            <Input className="width_input" placeholder='请输入经办人身份证号' disabled={true}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>业务员</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('clerkId', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请选择业务员' }],
                        })(
                            <Select
                                placeholder="请选择" className="width_input"
                                >
                                {
                                    this.state.clerk_list.map(function(i,k){
                                        return <Option value={i.id.toString()} key={k}>{i.name}</Option>
                                    })
                                }
                            </Select>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>上传投保单</span>}
                        labelCol={{span: 8}}
                        wrapperCol={{ span: 15}}
                        colon={false}
                        className='upload'
                        >
                        {getFieldDecorator('tbdSyxStorageNoList', {
                            rules: [{ required: true, message: '请上传投保单' }],
                        })(
                            <div>

                            </div>
                        )}
                        <Upload {...tbdSyxStorageNoList}>
                            <Button className="ant-btn-up">上传</Button>
                        </Upload>
                    </FormItem>
                </Form>
            </Row>
        )
    }
}
export default Form.create()(Rec_company)