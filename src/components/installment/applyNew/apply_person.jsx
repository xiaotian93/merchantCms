import React , { Component } from 'react';
import { Row , Col , Table , Form , Checkbox , Button , Icon , Select , Input ,Radio ,Upload,List,DatePicker,message,Modal} from 'antd';
import {host} from '../../../ajax/config.js';
import api from '../../../ajax/api.js';
import axios from '../../../ajax/request.js';
import axios_form from '../../../ajax/request_form';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const {  RangePicker } = DatePicker;
class ApplyPerson extends Component{
    constructor(props){
        super(props);
        props.onRef(this);
        this.state={
            phone:'',
            carBasicInfoList:[],
            orderId:props.orderId
        }
    }
    componentDidMount(){
        //this.state.orderId===undefined?'':this.borrower_info();
    }
    phone(e){
        this.setState({
            phone:e.target.value
        })
    }
    borrower_info(f){
        var phone=this.state.phone;
        if(phone===''){
            message.warn('请输入手机号');
            return;
        }else{
            axios.get(api.borrower_basic_info+'?phone='+phone).then((e)=>{
                var data=e.data;
                for(var i in data){
                    if(i==='carBasicInfoList'){

                        if(f!==1){

                            this.props.form.setFieldsValue({carId:data[i][0].carId.toString()})
                        }
                        this.setState({
                            carBasicInfoList:data[i]
                        })
                    }else{
                        this.props.form.setFieldsValue({[i]:data[i]})
                    }
                }
            })
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        return (
            <Form className='fqsq'>
                <div className='genre'>
                    <span className='genreIcon'></span>
                    <span className='genreTitle'>申请人基本信息</span>
                </div>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>手机号</span>}
                    //{...formInit}
                    labelCol={{span: 8}}
                    wrapperCol={{ span: 6}}
                    colon={false}
                    >
                    {getFieldDecorator('phone', {
                        rules: [{required: true, message: '请输入手机号'}],
                    })(
                        <Input placeholder='请输入手机号' onBlur={this.phone.bind(this)} />
                    )}
                    <div style={{position:'absolute',left:'130%',top:0}}>
                        <Button type='primary' onClick={this.borrower_info.bind(this)}>查询</Button>
                    </div>
                </FormItem>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>姓名</span>}
                    {...formInit}
                    >
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入姓名'}],
                    })(
                        <Input placeholder='请输入姓名' disabled={true} />
                        //<div></div>
                    )}
                </FormItem>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>身份证号</span>}
                    {...formInit}
                    >
                    {getFieldDecorator('idCard', {
                        rules: [{required: true, message: '请输入身份证号'}],
                    })(
                        <Input placeholder='请输入身份证号' disabled={true} />
                    )}
                </FormItem>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>发动机号</span>}
                    {...formInit}
                    >
                    {getFieldDecorator('carId', {
                        rules: [{required: true, message: '请选择发动机号'}],
                        //initialValue:this.state.carBasicInfoList.length<1?'':this.state.carBasicInfoList[0].engineNo
                    })(
                        <Select placeholder='请选择发动机号' >
                            {
                                this.state.carBasicInfoList.map((i,k)=>{
                                    return <Option value={i.carId.toString()} key={k} >{i.engineNo}</Option>
                                })
                            }

                        </Select>
                    )}
                </FormItem>
                <FormItem
                    style={{marginBottom:"0"}}
                    wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('wxUserId', {
                        //rules: [{ required: false, message: 'Please select your gender!' }],
                    })(
                        <div>

                        </div>
                    )}
                </FormItem>
            </Form>
        )
    }
}
export default Form.create()(ApplyPerson);
