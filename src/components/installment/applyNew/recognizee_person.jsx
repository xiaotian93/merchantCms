import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message,Upload} from 'antd';
import {host} from '../../../ajax/config.js';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
const FormItem = Form.Item;
const Option = Select.Option;
class Rec_Person extends Component{
    constructor(props){
        super(props);
        props.person(this);
        this.state={
            tbdSyxStorageNoList:[],
            idCardZmStorageNo:[],  //身份证正面
            idCardFmStorageNo:[],  //身份证反面
            name:'',
            idCard:'',
            phone:'',
            clerk_list:[]
        }
    }
    componentDidMount(){
        this.getOption();
    }
    getOption() {
        axios.get(api.clerk_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                clerk_list:data
            })
        })
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
        this.props.form.setFieldsValue({'tbdSyxStorageNoList':arr});

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
        return(
            <Row>
                <Form className='fqsq'>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>被保人姓名</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('beneficiaryPerson.name', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.name,
                            rules: [{ required: true, message: '请输入被保人姓名' },{pattern:/^[\u4e00-\u9fa5]{1,10}$/,message:"格式错误"}],
                        })(
                            <Input className="width_input" placeholder='请输入被保人姓名' onBlur={this.nameChange.bind(this)}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>被保人手机号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('beneficiaryPerson.phone', {
                            rules: [{ required: true, message: '请输入被保人手机号' },{pattern:/^[1][3,4,5,6,7,8][0-9]{9}$/,message:"手机号格式错误"}] , //
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.phone,
                        })(
                            <Input className="width_input" placeholder='请输入被保人手机号' onBlur={this.phoneChange.bind(this)}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>被保人身份证号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('beneficiaryPerson.idCard', {
                            //initialValue:orderIds===undefined?'':this.state.basicInfo.idCard,
                            rules: [{ required: true, message: '请输入被保人身份证号' },{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:"格式错误"}],  //
                        })(
                            <Input className="width_input" placeholder='请输入被保人身份证号' onBlur={this.idChange.bind(this)}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款人姓名</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerPerson.name', {
                            rules: [{ required: true, message: '请输入还款人姓名' }],
                            initialValue:this.state.name,
                        })(
                            <Input className="width_input" placeholder='请输入还款人姓名' disabled={true}/>
                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款人身份证号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerPerson.idCard', {
                            rules: [{ required: true, message: '请输入还款人身份证号' }],  //,{pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message:"格式错误"}
                            initialValue:this.state.idCard
                        })(
                            <Input className="width_input" placeholder='请输入还款人身份证号' disabled={true}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>身份证</span>}
                        labelCol={{span: 8}}
                        wrapperCol={{ span: 15}}
                        colon={false}
                        className='uploadOne'
                        >
                        {getFieldDecorator('borrowerPerson.idCardZmStorageNo', {
                            rules: [{ required: true, message: '请上传身份证' }],
                        })(
                            <div>
                            </div>
                        )}
                        <div>
                            <Upload {...idCardZmStorageNo}>
                                <Button className="ant-btn-up">正面</Button>
                            </Upload>
                            <Upload {...idCardFmStorageNo}>
                                <Button className="ant-btn-up">反面</Button>
                            </Upload>
                        </div>
                    </FormItem>
                    <FormItem style={{marginBottom:"0"}}
                              className='uploadIdf'
                              wrapperCol={{ span: 10}}
                        >
                        {getFieldDecorator('borrowerPerson.idCardFmStorageNo', {
                            rules: [{ required: true, message: '请上传身份证' }],
                        })(
                            <div>
                            </div>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款人手机号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerPerson.phone', {
                            rules: [{ required: true, message: '请输入还款人手机号' }], //,{pattern:/^[1][3,4,5,7,8][0-9]{9}$/,message:"手机号格式错误"}
                            initialValue:this.state.phone
                        })(
                            <Input className="width_input" placeholder='请输入还款人手机号' disabled={true}/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款人银行卡号</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerPerson.bankCard', {
                            //initialValue:this.state.basicInfo.bankCard,
                            rules: [{ required: true, message: '请输入还款人银行卡号' },{pattern:/^[0-9]{1,25}$/,message:"银行卡号格式错误"}],
                        })(
                            <Input className="width_input" placeholder='请输入还款人银行卡号'/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>还款人开户行</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('borrowerPerson.bank', {
                            //initialValue:this.state.basicInfo.bank,
                            rules: [{ required: true, message: '请输入还款人开户行' },{pattern:/^[\u4e00-\u9fa5]{1,30}$/,message:"开户行名格式错误"}],
                        })(
                            <Input className="width_input" placeholder='请输入还款人开户行'/>

                        )}
                    </FormItem>
                    <FormItem
                        label={<span style={{color:"#7F8FA4"}}>业务员</span>}
                        {...formInit}
                        >
                        {getFieldDecorator('clerkId', {
                            //initialValue:this.state.totalData.clerkId,
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
export default Form.create()(Rec_Person)