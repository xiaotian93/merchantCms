import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message} from 'antd';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
class Syx extends Component{
    constructor(props){
        super(props);
        props.onRef(this);
        this.state={
            end:undefined,
            start:undefined,
        }
    }
    totalSyx(e){
        this.props.syx()
    }
    componentDidMount(){
        this.props.orderId===undefined?'':this.detail();
        //this.props.orderId===undefined?'':this.totalSyx();
    }
    detail(){
        var detail=this.props.tbd;
        var typeNum=this.props.type;
        if(typeof detail==='number'){
            return;
        }
        this.setState({
            start:moment(detail.startDate),
            end:moment(detail.endDate)
        });
        if(typeNum===1){
            this.props.form.setFieldsValue({syx:detail.syx/100,startDate:moment(detail.startDate).format('YYYY-MM-DD'),endDate:moment(detail.endDate).format('YYYY-MM-DD')})
        }else{
            this.props.form.setFieldsValue({syfjx:detail.syfjx/100,startDate:moment(detail.startDate).format('YYYY-MM-DD'),endDate:moment(detail.endDate).format('YYYY-MM-DD')})
        }
    }
    start(data){
        console.log(data)
        this.setState({
            start:data===null?undefined:data,
            end:data===null?undefined:moment(moment(data.format('YYYY-MM-DD')).add(1,'years').format('YYYY-MM-DD')).add(-1,'day')
        });
        this.props.form.setFieldsValue({startDate:data===null?'':data.format('YYYY-MM-DD')})
        this.props.form.setFieldsValue({endDate:data===null?"":moment(moment(data.format('YYYY-MM-DD')).add(1,'years').format('YYYY-MM-DD')).add(-1,'day').format('YYYY-MM-DD')})
    }
    end(data){
        this.setState({
            end:data
        });
        this.props.form.setFieldsValue({endDate:data.format('YYYY-MM-DD')})
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        const value=this.props.value;
        var type={1:'syx',2:'syfjx'}
        var typeNum=this.props.type;
        return(
            <Row>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>{typeNum===1?'商业险保费金额':'附属险保费金额'}</span>}
                    {...formInit}
                    >
                    {getFieldDecorator(type[typeNum], {
                        initialValue:'',
                        rules: [{ required: true, message: '请输入商业险保费金额' },{pattern:/^[0-9]{1,6}(\.[0-9]{1,2})?$/,message:"输入金额格式错误"}],
                    })(
                        <Input placeholder="请输入商业险保费金额" className="width_input syxInput" onBlur={this.totalSyx.bind(this)} />

                    )}
                </FormItem>
                <FormItem
                    label={<span style={{color:"#7F8FA4"}}>{typeNum===1?'商业险起止时间':'附属险起止时间'}</span>}
                    {...formInit}
                    >
                    {getFieldDecorator('startDate', {
                        rules: [{ required: true, message: '请选择商业险起止时间' }],
                        //initialValue:this.state.start
                    })(
                        <Row>
                            <Col span={12}><DatePicker onChange={this.start.bind(this)} value={this.state.start} allowClear={false}/></Col>
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
                    {getFieldDecorator('ordinal', {
                        initialValue:value
                        //rules: [{ required: true, message: 'Please select your gender!' }],
                    })(
                        <div>
                        </div>

                    )}
                </FormItem>
            </Row>
        )
    }
}
export default Form.create()(Syx);