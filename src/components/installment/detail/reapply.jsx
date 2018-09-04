import React , { Component } from 'react';
import { Row , Button } from 'antd';
import { Link } from 'react-router';

import axios from '../../../ajax/request_form';
import { gtask_detail } from '../../../ajax/api';

class Reapply extends Component {
    constructor(props){
        super(props);
        this.state = {
            orderId:props.orderNo,
            reason:""
        }
    }
    componentWillMount(){
        
    }
    componentDidMount(){
        this.get_info();
    }
    get_info(){
        let rqd = {
            orderId : this.props.orderNo
        }
        axios.post(gtask_detail,rqd).then(data=>{
            try{
                this.setState({
                    reason:data.data.otherData.shNoPassLog.comment
                })
            }catch(e){
                this.setState({
                    reason:"未知原因"
                })
            }
        })
    }
    render() {
        return (
            <Row className = "content query-sh">
                <div className="title"><div className="icon" />审核不通过原因</div>
                    <div className="text-content">
                        { this.state.reason }
                    </div>
                    <div className="text-content">
                        <Link to={"/fq/apply?orderNo="+this.props.orderNo}><Button type="primary">重新申请</Button></Link>
                    </div>
            </Row>
        )
    }
}


export default Reapply;