import React , { Component } from 'react';
import {Modal,Button,Table,Col,Tooltip,Tag,Row} from 'antd';
import Bind from './bind';
class Insurance_M extends Component{
    constructor(props){
        super(props);
        this.state={
            visible:props.visible
        };
        this.columns=[
            {dataIndex:"ordinal",width:'25%',key:"year",render:(e)=>{return '保单'+e}},
            {width:'45%',key:"syxTbdNo",render:(e)=>{return e.startDate+'至'+e.endDate}},
            {dataIndex:'syx',width:'30%',key:"syx",render:(e)=>{return e===''?'':parseFloat(e/100).toFixed(2)+'元'}}
        ]
        this.columns_fjx=[
            {dataIndex:"ordinal",width:'25%',key:"year",render:(e)=>{return '保单'+e}},
            {width:'45%',key:"syxTbdNo",render:(e)=>{return e.startDate+'至'+e.endDate}},
            {dataIndex:'syfjx',width:'30%',key:"syx",render:(e)=>{return e===''?'':parseFloat(e/100).toFixed(2)+'元'}}
        ]
        this.columns_jqx=[
            {width:'25%',key:"year",render:(e)=>{return e.num===1?'交强险':'车船税'}},
            {width:'45%',key:"syxTbdNo",render:(e)=>{return e.startDate+'至'+e.endDate}},
            {width:'30%',key:"syx",render:(e)=>{return e.num===1?parseFloat(e.jqx/100).toFixed(2)+'元':parseFloat(e.ccs/100).toFixed(2)+'元'}}
        ]
    }
    cancel() {
        this.props.cancel();
    }
    componentDidMount(){
    }
    getData(data){
        var bb=[];
        var tbdType={1:"商业险",2:"商业附属险",3:"交强险车船税（代缴）"};
        for(var i in data){
            if(data[i][0].receiptName!==''){
                var aa= (
                    <Row className='insurance' key={i}>
                        {
                            //<span className='name'>投保单{data[i][0].ordinal}</span>
                        }
                        <Row>
                            <Col className='company' span={12}>{tbdType[data[i][0].type]}</Col>
                            <Col className='company textRight' span={12} >收款机构：{data[i][0].receiptName}</Col>
                        </Row>
                        <Row>
                            {
                                data[i][0].type===3?<Table bordered={true} columns={this.columns_jqx} dataSource={data[i]} pagination={false} className='table' rowKey='num'></Table>:<Table bordered={true} columns={data[i][0].type===1?this.columns:this.columns_fjx} dataSource={data[i]} pagination={false} className='table' rowKey='ordinal' ></Table>
                            }
                        </Row>

                    </Row>
                )
                bb.push(aa);
            }
        }
        return bb
    }
    onClick() {
        this.props.tbdSure();

    }
    render() {
        const foot=(<div style={{textAlign:"center"}}>
                <Button type='primary' onClick={this.onClick.bind(this)}>确定</Button>
                <Button onClick={this.cancel.bind(this)}>修改</Button>
        </div>);
        const modal_info={
            visible:this.props.visible,
            footer:foot,
            onCancel:this.cancel.bind(this)

        };
        var data=this.props.tbd;
        return (
            <div >
                <Modal {...modal_info} className='message_info'>
                    <span className='sureMessage'>确认投保单信息</span>
                    {
                        this.getData(data)
                        //this.state.tbdData.map((i,k)=>{
                        //    if(i[0].receiptName!==''){
                        //        alert(i[0].ordinal)
                        //        return (
                        //            <Col className='insurance' key={k}>
                        //                <span className='name'>投保单{i[0].ordinal}</span>
                        //                <Table bordered={true} columns={this.columns} dataSource={i} pagination={false} className='table'></Table>
                        //                <div className='company'>收款机构：{i[0].receiptName}</div>
                        //            </Col>
                        //        )
                        //    }
                        //
                        //})

                    }

                </Modal>

            </div>
        )
    }
}
export default Insurance_M