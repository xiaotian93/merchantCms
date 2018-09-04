import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message} from 'antd';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
import moment from 'moment';
import Syx from './syx';
const FormItem = Form.Item;
const Option = Select.Option;
const {  RangePicker } = DatePicker;
let clickNum=1,clickArr=[],refArr=[];
class Insurance extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            receipt_list:[],
            insur_company_list:[],
            detail:props.tbdDetal,
            end:undefined,
            start:undefined,
            addClick:[],
            tbd:[]
        }
    }
    componentDidMount() {
        this.getOption()
        //this.state.detail===undefined?'':this.detail();
    }
    componentWillMount(){
        clickArr=[];
        //refArr=[]
    }
    receipt(e,add) {
        add=add||false;
        var rqd='?insur_company_id='+e;
        if(!add){
            this.props.form.setFieldsValue({receiptId:''})
        }
        axios.get(api.receipt_list+rqd).then(data=>{
            var getData=data.data;
            this.setState({
                receipt_list:getData,
            })
            //return getData
        })
    }
    getOption(){
        axios.get(api.insur_company_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                insur_company_list:data
            })
        })
    }
    onRef(e) {
        this.tbd=e;
        refArr.push(e)
    }
    getSyx(){
        var syxTotal=[];
        var company=this.props.form.getFieldsValue();
        for(var i in refArr){
            var value=refArr[i].props.form.getFieldsValue();
            value.insurCompanyId=company.insurCompanyId;
            value.type=company.type;
            value.receiptId=company.receiptId;
            syxTotal.push(value)
        }
        console.log(syxTotal)
    }
    start(data){
        this.setState({
            start:data,
            end:moment(moment(data.format('YYYY-MM-DD')).add(1,'years').format('YYYY-MM-DD')).add(-1,'day')
        });
        this.props.form.setFieldsValue({startDate:data.format('YYYY-MM-DD')})
        this.props.form.setFieldsValue({endDate:moment(moment(data.format('YYYY-MM-DD')).add(1,'years').format('YYYY-MM-DD')).add(-1,'day').format('YYYY-MM-DD')})
    }
    end(data){
        this.setState({
            end:data
        });
        this.props.form.setFieldsValue({endDate:data.format('YYYY-MM-DD')})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        var detailArr=this.props.tbdList;
        if(this.state.orderId){
            clickNum=detailArr[detailArr.length-1].ordinal===undefined?detailArr[detailArr.length-1]:detailArr[detailArr.length-1].ordinal;
        }
        return (
            <Form >
                <Row>
                    <Row className='fqsq'>
                        <div className='genre'>
                            <span className='genreIcon'></span>
                            <span className='genreTitle'>交强险|车船税（代缴）</span>
                        </div>
                    </Row>

                    <Row>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>保险公司</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('insurCompanyId', {
                                initialValue:''
                            })(
                                <Select
                                    placeholder="请选择" className="width_input" onChange={(e)=>{this.receipt(1,1,e)}}
                                    >
                                    {
                                        this.state.insur_company_list.map(function (i, k) {
                                            return <Option value={i.id.toString()}
                                                           key={k}>{i.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('type', {
                                initialValue:3
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('ordinal', {
                                initialValue:1
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>收款机构</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('receiptId', {
                                initialValue:''
                            })(
                                <Select
                                    placeholder="请选择" className="width_input"
                                    >
                                    {
                                        this.state.receipt_list.map(function (i, k) {
                                            return <Option value={i.id.toString()+'-'+i.name}
                                                           key={k}>{i.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>交强险金额</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('jqx', {
                                initialValue:'',
                            })(
                                <Input placeholder="请输入交强险金额" className="width_input syxInput" />

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>车船税金额</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('ccs', {
                                initialValue:'',
                            })(
                                <Input placeholder="请输入车船税金额" className="width_input syxInput" />

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>交强险起止时间</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('startDate', {
                                //initialValue:this.state.start
                            })(
                                <Row>
                                    <Col span={12}><DatePicker onChange={this.start.bind(this)} value={this.state.start} allowClear={false} /></Col>
                                    <Col span={12}><DatePicker value={this.state.end} onChange={this.end.bind(this)} allowClear={false} /></Col>
                                </Row>

                                //<RangePicker className="width_input"  />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('endDate', {
                                //initialValue:this.state.end
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('receiptName', {
                                //initialValue:this.state.end
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>
                            )}
                        </FormItem>
                    </Row>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(Insurance);