import React , { Component } from 'react';
import { Form, Input, DatePicker, Col, Row, TimePicker, Select, Cascader, InputNumber , Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

class Filter extends Component{
    constructor(props){
        super(props);
        this.state = {
            items:[]
        }
    }
    componentDidMount(){
        
    }
    get_data(){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let items = this.props['data-source'];
        console.log(items);
        let eles = [];
        for(let i in items){
            let ele = (
                <Col key={i} span={8}>
                    <FormItem {...formItemLayout} label={items[i].name}>
                      {getFieldDecorator(i)(
                        <Input placeholder={items[i].placeHolder} />
                      )}
                    </FormItem>
                </Col>
            )
            if(items[i].type==='select'){
                let ops = [];
                for(let v in items[i].values){
                    ops.push(
                        <Option key={v} value={items[i].values[v].val}>{items[i].values[v].name}</Option>
                    )
                }
                ele = (
                    <Col key={i} span={8}>
                        <FormItem {...formItemLayout} label={items[i].name}>
                          {getFieldDecorator(i)(
                            <Select placeholder={items[i].placeHolder}>
                                {ops}
                            </Select>
                          )}
                        </FormItem>
                    </Col>
                )
            }
            eles.push(ele);
        }
        return (
        <Form>
            <Row>
                <Col span={20}>
                    {eles}
                </Col>
                <Col span={4}>
                    <FormItem >
                        <Button type="primary" htmlType="submit">查询</Button>
                    </FormItem>
                    <FormItem >
                        <Button type="default" htmlType="submit">重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        )
    }
}
const FilterForm = Form.create()(Filter);
export default FilterForm