import React , { Component } from 'react';
import { Form, Input, Button , Row , Col , Checkbox } from 'antd';
// import { browserHistory } from 'react-router';
// import CryptoJS from "crypto-js";
import logo from '../../style/imgs/logo.png';

import { login } from '../../ajax/api';
import axios from '../../ajax/request';
import { set_logstate } from '../../ajax/tool';

const FormItem = Form.Item;

class NormalLoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            min_height:window.innerHeight
        }
    }
    componentWillMount () {
        this.setState({
            min_height:window.innerHeight
        })
        window.onresize = () => {
            this.setState({
                min_height:window.innerHeight
            })
        }
    }
    componentDidMount(){

    }
    login(e){
        e.preventDefault();
        this.props.form.validateFields((err,vals)=>{
            if(err){
                return;
            }
            this.setState({
                loading:true
            })
            vals.remember_me = vals.remember_me||false
            axios.post(login,vals).then(data=>{
                set_logstate(true);
                this.setState({
                    loading:false
                })
            });
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const window_height = window.innerHeight;
        return (
            <Row className="loginBg" style={{minHeight:this.state.min_height+"px"}}>
                <Col span={6} offset={10}>
                    <Form onSubmit={this.login.bind(this)} className="login-form" style={{marginTop:(window_height-391)/2+'px'}}>
                        <div className="logo">
                            <img src={logo} alt="白猫贷" />
                        </div>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入账户名' }],
                            })(
                                <Input className="login-input" placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码  ' }],
                            })(
                                <Input className="login-input" type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem className="checkbox-item">
                            {getFieldDecorator('remember_me')(
                                <Checkbox className="checkbox-sh">七天免密登录</Checkbox>
                            )}
                        </FormItem>
                        <FormItem >
                                <Button type="primary" htmlType="submit" loading={this.state.loading} className="login-form-button">登录</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        );
    }
}


export default Form.create()(NormalLoginForm);