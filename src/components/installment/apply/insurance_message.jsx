import React , { Component } from 'react';
import {Modal,Button,Table,Col,Tooltip,Tag} from 'antd';
import Bind from './bind';
class Insurance_M extends Component{
    constructor(props){
        super(props);
        this.state={
            visible:props.visible,
            //tbdData:props.tbd,
        //    tbdData:[
        //    [
        //        {
        //            insurCompanyId:'',
        //            ordinal:'',
        //            receiptId:'',
        //            syx:'',
        //            syxEndDate:'',
        //            syxStartDate:'',
        //            syxTbdNo:'',
        //            year:'',
        //            receiptName:''
        //        }
        //    ]
        //
        //],
        };
        this.columns=[
            {dataIndex:"ordinal",width:'33.33%',key:"year",render:(e)=>{return '保单'+e}},
            {dataIndex:'syxTbdNo',width:'33.33%',key:"syxTbdNo"},
            {dataIndex:'syx',width:'33.33%',key:"syx",render:(e)=>{return e===''?'':parseFloat(e/100).toFixed(2)+'元'}}
        ]
    }
    cancel() {
        this.props.cancel();
    }
    componentDidMount(){
    }
    getData(data){
        var bb=[];
        for(var i in data){
            if(data[i][0].receiptName!==''){
                var aa= (
                    <Col className='insurance' key={i}>
                        {
                            //<span className='name'>投保单{data[i][0].ordinal}</span>
                        }

                        <Table bordered={true} columns={this.columns} dataSource={data[i]} pagination={false} className='table' rowKey='ordinal' ></Table>
                        <div className='company'>收款机构：{data[i][0].receiptName}</div>
                    </Col>
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