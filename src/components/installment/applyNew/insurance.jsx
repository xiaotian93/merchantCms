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
            ]
        }
    }
    add() {
        ++clickNum;
        if(clickNum>3){
            message.warn('仅可新增3年的投保单信息');
            return;
        }else{
            message.success('保单信息添加成功')
        }
        clickNum===2?
            this.setState({
                2:true
            }):this.setState({
            3:true
        })
        var data=this.props.form.getFieldsValue();
        var companyId=data[1][1]['insurCompanyId'];
        var receipt=data[1][1]['receiptId'];
        var date=data[1][1]['syxStartDate'];
        var companyId2=data[1][2]['insurCompanyId'];
        var receipt2=data[1][2]['receiptId'];
        var date2=data[1][2]['syxStartDate'];
        //setTimeout(function(){
            this.receipt(clickNum,1,companyId,true);
        this.receipt(clickNum,2,companyId2,true);
            this.setState({
                company_1:companyId,
                receipt_1:receipt,
                date_1:[
                    {y:date===''?'':[moment(date[0].format('YYYY-MM-DD')),moment(date[1].format('YYYY-MM-DD'))]},
                    {y:date===''?'':[moment(date[0].format('YYYY-MM-DD')).add(1,'years'),moment(date[1].format('YYYY-MM-DD')).add(1,'years')]},
                    {y:date===''?'':[moment(date[0].format('YYYY-MM-DD')).add(2,'years'),moment(date[1].format('YYYY-MM-DD')).add(2,'years')]}
                ],
                company_2:companyId2,
                receipt_2:receipt2,
                date_2:[
                    {y:date2===''?'':[moment(date2[0].format('YYYY-MM-DD')),moment(date2[1].format('YYYY-MM-DD'))]},
                    {y:date2===''?'':[moment(date2[0].format('YYYY-MM-DD')).add(1,'years'),moment(date2[1].format('YYYY-MM-DD')).add(1,'years')]},
                    {y:date2===''?'':[moment(date2[0].format('YYYY-MM-DD')).add(2,'years'),moment(date2[1].format('YYYY-MM-DD')).add(2,'years')]}
                ]
            })

        //}.bind(this),10)
        //console.log(moment(date[0].format('YYYY-MM-DD')).add(1,'years').format('YYYY-MM-DD'));


    }
    totalSyx(e){
        var data=this.props.form.getFieldsValue(),syx=0;
        for(var i in data){
            for(var j in data[i]){
                syx+=(data[i][j].syx===''?0:parseFloat(data[i][j].syx));
            }
        }
        this.props.calc(syx);
    }
    componentDidMount() {
        this.getOption()
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
            this.props.form.setFieldsValue({[name]:''})
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
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        function addForm(year,that){
            var yearNum={1:"一",2:"二",3:"三"};
            return (
                <Row>
                    <Row>
                        <Col span={9} push={3} style={{fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>第{yearNum[year]}年投保信息</Col>
                        {
                            year===1?<Col span={2} push={10}>
                                <Button type="primary" shape="circle" icon="plus" size="small" onClick={()=>{that.add()}} />
                            </Col>:""
                        }

                    </Row>
                    <Row>
                        <Col span={8} style={{textAlign:"right",paddingRight:"10px",fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>投保单1</Col>
                    </Row>
                    <Row>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>保险公司</span>}
                            {...formInit}
                            >
                            {getFieldDecorator(year+'.1.insurCompanyId', {
                                rules: [{ required: true, message: '请选择保险公司' }],
                                initialValue:that.state.company_1
                            })(
                                <Select
                                    placeholder="请选择" className="width_input" onChange={(e)=>{that.receipt(year,1,e)}}
                                    >
                                    {
                                        that.state.insur_company_list.map(function (i, k) {
                                            return <Option value={i.id.toString()}
                                                           key={k}>{i.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.1.ordinal', {
                                initialValue:1
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.1.receiptName', {
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
                            {getFieldDecorator(year+'.1.receiptId', {
                                rules: [{ required: true, message: '请选择收款机构' }],
                                initialValue:that.state.receipt_1
                            })(
                                <Select
                                    placeholder="请选择" className="width_input"
                                    >
                                    {
                                        that.state['receipt_list_'+year+'_1'].map(function (i, k) {
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
                            {getFieldDecorator(year+'.1.syxTbdNo', {
                                rules: [{ required: true, message: '请输入商业险投保单号' }],
                            })(
                                    <Input className="width_input" placeholder='请输入商业险投保单号'/>

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险保费金额</span>}
                            {...formInit}
                            >
                            {getFieldDecorator(year+'.1.syx', {
                                initialValue:'',
                                rules: [{ required: true, message: '请输入商业险保费金额' },{pattern:/^[0-9]{1,25}$/,message:"输入金额格式错误"}],
                            })(
                                    <Input placeholder="请输入商业险保费金额" className="width_input" onBlur={that.totalSyx.bind(that)} />

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险起止时间</span>}
                            {...formInit}
                            >
                            {getFieldDecorator(year+'.1.syxStartDate', {
                                rules: [{ required: true, message: '请选择商业险起止时间' }],
                                initialValue:that.state.date_1[year-1]['y']
                            })(
                                <RangePicker className="width_input" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.1.syxEndDate', {
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span={8} style={{textAlign:"right",paddingRight:"10px",fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>投保单2</Col>
                    </Row>
                    <Row>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>保险公司</span>}
                            {...formInit}
                            >
                            {getFieldDecorator(year+'.2.insurCompanyId', {
                                initialValue:that.state.company_2
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <Select
                                    placeholder="请选择" className="width_input" onChange={(e)=>{that.receipt(year,2,e)}}
                                    >
                                    {
                                        that.state.insur_company_list.map(function (i, k) {
                                            return <Option value={i.id.toString()}
                                                           key={k}>{i.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.2.ordinal', {
                                initialValue:2
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
                            {getFieldDecorator(year+'.2.receiptId', {
                                initialValue:that.state.receipt_2
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <Select
                                    placeholder="请选择" className="width_input"
                                    >
                                    {
                                        that.state['receipt_list_'+year+'_2'].map(function (i, k) {
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
                            {getFieldDecorator(year+'.2.syxTbdNo', {
                                initialValue:""
                                //rules: [{ required: false, message: 'Please select your gender!' }],
                            })(
                                    <Input className="width_input" placeholder='请输入商业险投保单号'/>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.2.receiptName', {
                                initialValue:''
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险保费金额</span>}
                            {...formInit}
                            >
                            {getFieldDecorator(year+'.2.syx', {
                                initialValue:'',
                                rules: [{pattern:/^[0-9]{1,25}$/,message:"输入金额格式错误"}]
                            })(
                                    <Input placeholder="请输入商业险保费金额" className="width_input" onBlur={that.totalSyx.bind(that)} />

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.2.ordinal', {
                                initialValue:2
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>商业险起止时间</span>}
                            {...formInit}
                            >
                            {getFieldDecorator(year+'.2.syxStartDate', {
                                initialValue:that.state.date_2[year-1]['y']
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <RangePicker className="width_input"/>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.2.syxEndDate', {
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.1.year', {
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                                initialValue:year
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                            >
                            {getFieldDecorator(year+'.2.year', {
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                                initialValue:year
                            })(
                                <div>
                                </div>
                            )}
                        </FormItem>
                    </Row>
                </Row>
            )
        }
        return (
            <div>
                {addForm(1,this)}
                {this.state['2']?<div style={{borderBottom:"1px solid #CED0DA",width:"90%",margin:"5px auto"}}></div>:""}
                {this.state['2']?addForm(2,this):''}
                {this.state['3']?<div style={{borderBottom:"1px solid #CED0DA",width:"90%",margin:"5px auto"}}></div>:""}
                {this.state['3']?addForm(3,this):''}
            </div>
        )
    }
}
export default Form.create()(Insurance);