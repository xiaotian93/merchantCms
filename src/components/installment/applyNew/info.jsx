import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message,Upload} from 'antd';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
import {host} from '../../../ajax/config.js';
const FormItem = Form.Item;
const Option = Select.Option;
class Info extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            clerk_list:[],
            tbdStorageNoList:[]
        }
    }
    componentDidMount() {
        this.getOption()
    }
    getOption() {
        axios.get(api.clerk_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                clerk_list:data
            })
        })
    }
    tbdStorageNoList(e) {
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
            tbdStorageNoList:e.fileList
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
        this.props.form.setFieldsValue({'tbdStorageNoList':arr});

    }
    tbdSyxStorageNoListRemove() {
        this.setState({
            tbdStorageNoList:[]
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        const tbdStorageNoList={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange",
            fileList:this.state.tbdStorageNoList,
            onChange:this.tbdStorageNoList.bind(this),
            withCredentials:true,
            data:{usage:'tbdStorageNoList'},
            name:"file",
            multiple:true
        };
        //console.log(this.state.tbdStorageNoList)
        return(
            <Form className='fqsq' style={{paddingTop:'33px'}}>
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
                    {getFieldDecorator('tbdStorageNoList', {
                        rules: [{ required: true, message: '请上传投保单' }],
                    })(
                        <div>

                        </div>
                    )}
                    <Upload {...tbdStorageNoList}>
                        <Button className="ant-btn-up">上传</Button>
                    </Upload>
                </FormItem>
                <FormItem
                    style={{marginBottom:"0"}}
                    wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('borrowerType', {
                        //rules: [{ required: false, message: 'Please select your gender!' }],
                    })(
                        <div>

                        </div>
                    )}
                </FormItem>
                <FormItem
                    style={{marginBottom:"0"}}
                    wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('beneficiaryType', {
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
export default Form.create()(Info);
