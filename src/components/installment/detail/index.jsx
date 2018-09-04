import React , { Component } from 'react';
import { Col , Button } from 'antd';

import Info from './info';
import Audit from './audit';
import Reapply from './reapply';
import Signed from './signed';
import Bind from '../apply/bind';

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderNo:props.location.query.orderNo,
            type:props.location.query.type
        }
    }
    componentWillMount () {
        
    }
    componentDidMount(){

    }
    bind_modal(modal){
        this.modal = modal;
    }
    set_modal(){
        this.modal.setState({
            visible_img:true,
            visible_msg:false,
        })
    }
    render() {
        let type = this.props.location.query.type;
        // 绑卡
        if(type==="bind"){
            return (
                <span className="query-sh">
                    <Info orderNo={this.state.orderNo} />
                    <Bind set-bind={this.bind_modal.bind(this)} defaultShow={true} orderNo={this.state.orderNo} />
                    <Col span={24} className="submit-btn">
                        <Button type="primary" onClick={this.set_modal.bind(this)}>确认签约</Button>
                    </Col>
                </span>
            )
        }
        // 审批订单
        if(type==="audit"){
            return (
                <span className="query-sh">
                    <Info orderNo={this.state.orderNo} />
                    <Audit orderNo={this.state.orderNo} />
                </span>
            )
        }
        // 审核失败
        if(type==="failed"){
            return (
                <span className="query-sh">
                    <Reapply orderNo={this.state.orderNo} />
                    <Info orderNo={this.state.orderNo} />
                </span>
            )
        }
        // 签约
        if(type==="signed"){
            return (
                <span className="query-sh">
                    <Info orderNo={this.state.orderNo} />
                    {
                        <Signed orderNo={this.state.orderNo} />
                    }

                </span>
            )
        }
        return (
            <span className="query-sh">
                <Info orderNo={this.state.orderNo} />
            </span>
        )
    }
}


export default Index;