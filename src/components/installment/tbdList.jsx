import React , { Component } from 'react';
import { Row , Col , Form , Input  } from 'antd';
const FormItem = Form.Item;
class Tbdlist extends Component{
    constructor(props){
        super(props);
        props.onref(this);
        this.state={

        }
    }
    render() {
        let {getFieldDecorator} = this.props.form;
        let form_layout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            }
        };
        let type=this.props.type;
        let id=this.props.id;
        let val=this.props.val;
        let bdNo=this.props.bdNo;
        return (
            <Row>
                <FormItem {...form_layout} label={"保单"+val}>
                    {getFieldDecorator("bdNo",{
                        initialValue:bdNo?bdNo:'',
                        rules:[{required: true, message: '请输入保单号'}]
                    })(
                        <Input placeholder="请输入保单号" />
                    )}
                </FormItem>
                <FormItem style={{marginBottom:"0"}}
                          wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('id', {
                        initialValue:id
                    })(
                        <div>
                        </div>
                    )}
                </FormItem>
                <FormItem style={{marginBottom:"0"}}
                          wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('type', {
                        initialValue:type
                    })(
                        <div>
                        </div>
                    )}
                </FormItem>
                <FormItem style={{marginBottom:"0"}}
                          wrapperCol={{ span: 10}}
                    >
                    {getFieldDecorator('ordinal', {
                        initialValue:val
                    })(
                        <div>
                        </div>
                    )}
                </FormItem>
            </Row>
        )
    }
}
export default Form.create()(Tbdlist);