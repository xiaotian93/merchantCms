import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message} from 'antd';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const {  RangePicker } = DatePicker;
var clickNum=1;
class Insurance extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            2:false,
            3:false,
            receipt_list_1_1:[],
            receipt_list_1_2:[],
            receipt_list_2_1:[],
            receipt_list_2_2:[],
            receipt_list_3_1:[],
            receipt_list_3_2:[],
            insur_company_list:[],
            company_1:'',
            receipt_1:'',
            date_1:[
                {y:''},
                {y:''},
                {y:''}
            ],
            company_2:'',
            receipt_2:'',
            date_2:[
                {y:''},
                {y:''},
                {y:''}
            ],
            detail:props.tbdDetal,
            end:undefined,
            start:undefined
        }
    }

    totalSyx(e){
        //var data=this.props.form.getFieldsValue(),syx=0;
        //for(var i in data){
        //    for(var j in data[i]){
        //        syx+=(data[i][j].syx===''?0:parseFloat(data[i][j].syx));
        //    }
        //}
        //this.props.calc(syx);
        //console.log(data)
        this.props.syx(e.target.value)
    }
    componentDidMount() {
        this.getOption()
        this.state.detail===undefined?'':this.detail();
    }
    detail() {
        var detail=this.state.detail;var arr=[];
        //this.props.form.setFieldsValue({syx:detail.syx})
        if(typeof detail==='number'){
            return;
        }
        this.setState({
            start:moment(detail['syxStartDate']),
            end:moment(detail['syxEndDate'])
        });
        this.receipt(1,1,detail['insurCompanyId']);
        for(var i in detail){
            if(i==='syxEndDate'||i==='syxStartDate'){
                detail[i]=moment(detail[i]);
                //arr.push(detail[i])
                this.props.form.setFieldsValue({[i]:detail[i]})
            }else if(i==='insurCompanyId'){
                this.props.form.setFieldsValue({[i]:detail[i].toString()})
            }else if(i==='receiptId'){
                this.props.form.setFieldsValue({[i]:detail[i].toString()+'-'+detail.receiptName})

            }else if(i==='syx'){
                this.props.form.setFieldsValue({[i]:detail[i]/100})
            }else{
                this.props.form.setFieldsValue({[i]:detail[i]})
            }

        //    alert(i)

        }
    }
    receipt(y,num,e,add) {
        add=add||false;
        var rqd='?insur_company_id='+e;
        var test='receipt_list_'+y+'_'+num;
        //this.setState({
        //    [test]:[]
        //})
        var name=y+'.'+num+'.receiptId';
        if(!add){
            this.props.form.setFieldsValue({receiptId:''})
        }
        axios.get(api.receipt_list+rqd).then(data=>{
            var getData=data.data;
            this.setState({
                [test]:getData,
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
    start(data){
        //console.log(data);
        this.setState({
            start:data,
            end:moment(data.format('YYYY-MM-DD')).add(1,'years')
            //end:1
        })
        //console.log(this.state.end)
        this.props.form.setFieldsValue({syxStartDate:data})
        this.props.form.setFieldsValue({syxEndDate:moment(data.format('YYYY-MM-DD')).add(1,'years')})
    }
    end(data){
        this.setState({
            end:data
            //end:1
        })
        this.props.form.setFieldsValue({syxEndDate:data})
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        var value=this.props.value;
        return (
            <div>
                <Row>
                    <Row>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>保险公司</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('insurCompanyId', {
                                rules: [{ required: true, message: '请选择保险公司' }],
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
                            {getFieldDecorator('ordinal', {
                                initialValue:value
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
                                initialValue:''
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('year', {
                                initialValue:''
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
                                rules: [{ required: true, message: '请选择收款机构' }],
                                initialValue:''
                            })(
                                <Select
                                    placeholder="请选择" className="width_input"
                                    >
                                    {
                                        this.state['receipt_list_1_1'].map(function (i, k) {
                                            return <Option value={i.id.toString()+'-'+i.name}
                                                           key={k}>{i.name}</Option>
                                        })
                                    }
                                </Select>


                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险投保单号</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('syxTbdNo', {
                                rules: [{ required: true, message: '请输入商业险投保单号' }],
                            })(
                                <Input className="width_input" placeholder='请输入商业险投保单号'/>

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险保费金额</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('syx', {
                                initialValue:'',
                                rules: [{ required: true, message: '请输入商业险保费金额' },{pattern:/^[0-9]{1,6}(\.[0-9]{1,2})?$/,message:"输入金额格式错误"}],
                            })(
                                <Input placeholder="请输入商业险保费金额" className="width_input syxInput" onBlur={this.totalSyx.bind(this)} />

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险起止时间</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('syxStartDate', {
                                rules: [{ required: true, message: '请选择商业险起止时间' }],
                                //initialValue:this.state.start
                            })(
                                <Row>
                                    <Col span={12}><DatePicker onChange={this.start.bind(this)} value={this.state.start} /></Col>
                                    <Col span={12}><DatePicker value={this.state.end} onChange={this.end.bind(this)} /></Col>
                                </Row>

                                //<RangePicker className="width_input"  />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('syxEndDate', {
                                //initialValue:this.state.end
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>
                            )}
                        </FormItem>
                    </Row>
                </Row>
            </div>
        )
    }
}
export default Form.create()(Insurance);