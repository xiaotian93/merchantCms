import React , { Component } from 'react';
import { Col , Form , Input , DatePicker , Select , Button } from 'antd';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

const form_layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
}

const form_mix = {
    wrapperCol: { span: 24 }
}
// const text_layout = {
//     labelCol: { span: 0 },
//     wrapperCol: { span: 23 }
// }

class Filter extends Component{
	constructor(props){
        super(props);
        this.state = {
        }
    }
    componentDidMount(){

    }
    create_form () {
        let items = this.props['data-source'];
        let cols = [];
        let maps = {
            mix:this.create_mix.bind(this),
            text:this.create_text.bind(this),
            select:this.create_select.bind(this),
            rangeDate:this.create_rangeDate.bind(this),
            multiple:this.create_multiple.bind(this)
        }
        for(let i in items){
            // try{
                cols.push(maps[items[i].type](i,items[i]));
            // }catch(e){
            //     console.log(i,items);
            //     continue;
            // }
        }
        return cols;
    }
    create_mix(key,item){
        const { getFieldDecorator } = this.props.form;
        return (
            <Col key={key} span={7}>
                <FormItem {...form_mix}>
                    {getFieldDecorator(key)(
                        <Input placeholder={ item.placeholder } />
                    )}
                </FormItem>
            </Col>
        )
    }
    create_text(key,item){
        const { getFieldDecorator } = this.props.form;
        return (
            <Col key={key} span={7}>
                <FormItem {...form_layout} label={ item.title }>
                    {getFieldDecorator(key)(
                        <Input placeholder={ item.placeholder } />
                    )}
                </FormItem>
            </Col>
        )
    }
    create_rangeDate(key,item){
        const { getFieldDecorator } = this.props.form;
        return (
            <Col key={key} span={7}>
                <FormItem {...form_layout} label={ item.title }>
                    {getFieldDecorator(key)(
                        <RangePicker format="YYYY-MM-DD HH:mm:ss" />
                    )}
                </FormItem>
            </Col>
        )
    }
    create_select(key,item){
        const { getFieldDecorator } = this.props.form;
        return (
            <Col key={key} span={7}>
                <FormItem {...form_layout} label={item.title}>
                    {getFieldDecorator(key)(
                        <Select placeholder={item.placeholder}>
                            { this.create_option(item.values) }
                        </Select>
                    )}
                </FormItem>
            </Col>
        )
    }
    create_multiple(key,item){
        const { getFieldDecorator } = this.props.form;
        return (
            <Col key={key} span={7}>
                <FormItem {...form_layout} label={item.title}>
                    {getFieldDecorator(key)(
                        <Select mode="multiple" placeholder={item.placeholder}>
                            { this.create_option(item.values) }
                        </Select>
                    )}
                </FormItem>
            </Col>
        )
    }
    create_option(arr){
        let options = [];
        for(let a in arr){
            options.push(<Option key={a} value={arr[a].val}>{arr[a].name}</Option>)
        }
        return options
    }

    submit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                return ;
            }
            let res = {};
            for(let v in values){
                if(values[v]){
                    res[v] = values[v];
                }
            }
            if(this.props["data-get"]){
                this.props["data-get"](res);
            }else{
                console.log(res);
            }
        });
    }

    render(){
        
        let cols = this.create_form();
    	return (
            <Form onSubmit = {this.submit.bind(this)}>
                { cols }
                <Col span={2} offset={1}>
                    <FormItem>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </FormItem>
                </Col>
            </Form>
    	)
    }
}

export default Form.create()(Filter);