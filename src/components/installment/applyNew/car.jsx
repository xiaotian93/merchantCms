import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message,Upload,Checkbox} from 'antd';
import axios from '../../../ajax/request_form.js';
import api from '../../../ajax/api.js';
import {host} from '../../../ajax/config.js';
const FormItem = Form.Item;
class Car extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            newCar:'false',
            drivingLicStorageNo:[],
            invoiceStorageNoList:[]
        }
    }
    drivingLicStorageNo(e) {
        var arr=[];
        arr.push(e.fileList[e.fileList.length-1]);
        if(arr[0].size>20000000){
            message.warn('图片不能大于20M');
            return;
        }
        this.setState({
            drivingLicStorageNo:arr
        })

        if(arr[0].response){
            if(arr[0].response.code===0){
                this.props.form.setFieldsValue({'usedCar.drivingLicStorageNo':arr[0].response.data.storageNo});

            }else{
                message.warn(arr[0].response.msg);
                return;
            }
        }else{
            this.props.form.setFieldsValue({'usedCar.drivingLicStorageNo':''});

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
    drivingLicStorageNoRemove() {
        this.setState({
            drivingLicZbStorageNo:[]
        })
    }
    invoiceStorageNoRemove() {
        this.setState({
            invoiceStorageNoList:[]
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
                drivingLicStorageNo:[]
            })
        }else{
            this.setState({
                invoiceStorageNoList:[]
            })
        }
        this.props.form.setFieldsValue({carUseType:cars});
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        const drivingLicStorageNo={
            action:host+api.upload,
            accept:'image/*',
            listType:"picture-card",
            className:"upload-list-inline imgChange usedCar",
            fileList:this.state.drivingLicStorageNo,
            onChange:this.drivingLicStorageNo.bind(this),
            onRemove:this.drivingLicStorageNoRemove.bind(this),
            withCredentials:true,
            data:{usage:'drivingLicStorageNo'},
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
        return(
            <Form className='fqsq'>
                <div className='genre'>
                    <span className='genreIcon'></span>
                    <span className='genreTitle'>车辆信息</span>
                </div>
                <Row>
                    {
                        this.state.newCar==="false"?<Row>
                            <FormItem
                                label={<span style={{color:"#7F8FA4"}}>行驶证</span>}
                                labelCol={{span: 8}}
                                wrapperCol={{ span: 14}}
                                colon={false}
                                className='upload'
                                >
                                {getFieldDecorator('usedCar.drivingLicZbStorageNo', {
                                    rules: [{ required: true, message: '请上传行驶证' }],
                                })(
                                    <div></div>
                                )}
                                <div>

                                    <Upload {...drivingLicStorageNo} >
                                        <Button className="ant-btn-up">上传</Button>
                                    </Upload>

                                    <Checkbox onChange={this.isNewcar.bind(this)} style={{position:"absolute",left:"120px",top:"0"}} checked={false}>新车未上牌</Checkbox>
                                </div>
                            </FormItem>
                            <FormItem style={{marginBottom:"0"}}
                                {...formInit}
                                      className='uploadXsf'
                                      wrapperCol={{ span: 10}}
                                >
                                {getFieldDecorator('usedCar.drivingLicStorageNo', {
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

                                <FormItem
                                    label={<span style={{color:"#7F8FA4"}}>车牌号</span>}
                                    {...formInit}
                                    >
                                    {getFieldDecorator('usedCar.plateNo', {
                                        rules: [{ required: true, message: '请输入车牌号' }],
                                        //initialValue:orderIds===undefined?'':this.state.car.plateNo,
                                    })(
                                        <Input className="width_input" placeholder='请输入车牌号'/>
                                    )}
                                </FormItem>


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
                        </Row>:<Row >
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
                    <FormItem style={{marginBottom:"0"}}
                              //wrapperCol={{ span: 10}}
                        >
                        {getFieldDecorator('carUseType', {
                            initialValue:''
                            //rules: [{ required: true, message: 'Please select your gender!' }],
                        })(
                            <div>
                            </div>

                        )}
                    </FormItem>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(Car);