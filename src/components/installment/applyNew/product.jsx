import React , { Component } from 'react';
import { Row , Col , Table , Form , Checkbox , Button , Icon , Select , Input ,Radio ,Upload,List,DatePicker,message,Modal} from 'antd';
import {host} from '../../../ajax/config.js';
import api from '../../../ajax/api.js';
import axios from '../../../ajax/request.js';
import axios_form from '../../../ajax/request_form';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class Product extends Component{
    constructor(props){
        super(props);
        props.onRef(this);
        this.state={
            product_list:[],
            multipleRate:''
        }
    }
    componentDidMount(){
        this.getOption();
    }
    getOption() {
        axios.get(api.product_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                product_list:data
            })
        });
    }
    getRate(e) {
        var data=this.state.product_list;
        //console.log(data)
        for(var i in data){
            if(data[i].id.toString()==e){
                this.props.product(data[i].id,data[i].rateList[0].productRateId);
                this.props.show(data[i].haveSyfjx);
                this.setState({
                    multipleRate:data[i].rateList[0].multipleRate,
                })
                this.props.form.setFieldsValue({loanBasis:data[i].loanBasis,productRateId:data[i].rateList[0].productRateId,multipleRate:(data[i].rateList[0].multipleRate.toString()+'%')});
            }
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        var rate=this.state.multipleRate===''?'请输入综合费用':(this.state.multipleRate.toString()+'%');
        return(
            <Form className='fqsq'>
                <div className='genre'>
                    <span className='genreIcon'></span>
                    <span className='genreTitle'>分期产品</span>
                </div>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>分期产品选择</span>}
                    {...formInit}
                    >
                    {getFieldDecorator('productId', {
                        rules: [{required: true, message: '请选择分期产品'}],
                    })(
                        <Select placeholder='请选择分期产品' onChange={this.getRate.bind(this)} >
                            {
                                this.state.product_list.map((i,k)=>{
                                    return <Option value={i.id.toString()} key={k} >{i.name}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>综合费用</span>}
                    {...formInit}
                    >
                    {getFieldDecorator('multipleRate', {
                        rules: [{required: true, message: '请输入综合费用'}],
                        initialValue:rate
                    })(
                        <Input placeholder='请输入综合费用' disabled={true} />
                    )}
                </FormItem>
                <FormItem
                    style={{marginBottom:"0"}}
                    wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('loanBasis', {
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
                    {getFieldDecorator('productRateId', {
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
export default Form.create()(Product);
