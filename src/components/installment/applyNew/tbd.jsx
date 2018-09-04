import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message} from 'antd';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
import moment from 'moment';
import Syx from './syx';
const FormItem = Form.Item;
const Option = Select.Option;
const {  RangePicker } = DatePicker;
let clickNum=1,clickArr=[],refArr=[];
class Insurance extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            receipt_list:[],
            insur_company_list:[],
            detail:props.tbdDetal,
            end:undefined,
            start:undefined,
            addClick:[],
            tbd:[],
            orderIds:props.orderId,
        }
    }
    componentDidMount() {
        this.getOption()
    }
    componentWillMount(){
        clickArr=[];
        refArr=[]
    }
    receipt(e) {
        var rqd='?insur_company_id='+e;
        this.props.form.setFieldsValue({receiptId:''})
        axios.get(api.receipt_list+rqd).then(data=>{
            var getData=data.data;
            this.setState({
                receipt_list:getData,
            })
            //return getData
        })
    }
    getOption(){
        axios.get(api.insur_company_list, '').then((e)=> {
            var data=e.data;
            this.setState({
                insur_company_list:data
            })
        })
    }

    add(){
        var tbdNum,warn;

        tbdNum = (this.state.orderIds ? 3 : 2);
        warn = '最多可添加3个保单';
        if(clickArr.length>=tbdNum){
            message.warn(warn);
            return;
        }else{
            message.success('保单添加成功');
        }
        clickNum++;
        clickArr.push(clickNum);
        this.setState({
            addClick:clickArr,
        })
    }
    delete(i,k) {
        clickArr.splice(k,1);
        //teatArr.splice(k,1)
        var node=document.getElementById("dels"+i);
        var childs = node.childNodes;
        var delSyx=node.getElementsByClassName("syxInput")[0].value;
        //分期方案变化
        //this.delsyx(delSyx);

        for(var i = 0; i < childs.length; i++) {
            node.removeChild(childs[i]);
        }
        //tbd.removeChild(node);
        message.success('保单删除成功');
        this.setState({
            addClick:clickArr,
        });
        if(this.state.orderIds){
            refArr.splice(k,1)
        }else{
            refArr.splice(k+1,1)
        }
        this.getCalc();
    }
    onRef(e) {
        this.tbd=e;
        refArr.push(e)
        this.setState({
            tbd:[].push(e)
        })
    }
    getSyx(){
        var syxTotal=[];
        var company=this.props.form.getFieldsValue();
        var receipt=company.receiptId.split('-');
        for(var i in refArr){
            refArr[i].props.form.validateFields();
            var value=refArr[i].props.form.getFieldsValue();
            value.insurCompanyId=company.insurCompanyId;
            value.type=company.type;
            value.receiptId=receipt[0];
            value.receiptName=receipt[1];
            value.syx=value.syx*100;
            syxTotal.push(value)
        }
        return syxTotal
    }
    syx(){
        var syx=0;
        for(var i in refArr){
            var value=refArr[i].props.form.getFieldsValue();
            syx+=parseFloat(value.syx===''?0:value.syx);
        }
        return syx;

    }
    getCalc(){
        this.props.calc();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formInit={
            labelCol:{span: 8 },
            wrapperCol:{ span: 12 },
            colon:false
        };
        var detailArr=this.props.syxList;
        const type=this.props.type;
        if(this.state.orderIds){
            if(detailArr.length>0){
                clickNum=detailArr[detailArr.length-1].ordinal===undefined?detailArr[detailArr.length-1]:detailArr[detailArr.length-1].ordinal;
            }
        }
        var tbdList=[];
        function tbdLists(detailArr,edit,that) {
            if(edit){
                clickArr=detailArr;
                for(var i=0;i<detailArr.length;i++){
                    let num=i;
                    //clickArr.push(detailArr[i])
                    var data;
                    if(i==0){
                        data=(
                            <div key={'key'+(detailArr[i].ordinal===undefined?detailArr[i]:detailArr[i].ordinal)}>
                                <Row style={{paddingBottom:'10px'}}>
                                    <Col span={8} style={{textAlign:"right",paddingRight:"10px",fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>投保单1</Col>
                                    <Col span={2} push={10} style={{textAlign:"right"}}>
                                        <Button type="primary" shape="circle" icon="plus" size="small" onClick={that.add.bind(that)}  />
                                    </Col>
                                </Row>
                                <Syx onRef={that.onRef.bind(that)} value={1} type={1} syx={that.getCalc.bind(that)} tbd={detailArr[i]} orderId={that.state.orderIds}></Syx>
                            </div>
                        )
                    }else{
                        data=(
                            <Row key={'key'+(detailArr[i].ordinal===undefined?detailArr[i]:detailArr[i].ordinal)} id={'dels'+(detailArr[i].ordinal===undefined?detailArr[i]:detailArr[i].ordinal)}>
                                <div>
                                    <Row style={{paddingBottom:'10px'}}>
                                        <Col span={8} style={{textAlign:"right",paddingRight:"10px",fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>投保单{num+1}</Col>

                                        <Col span={2} push={10} style={{textAlign:"right"}}>
                                            <Button type="danger" shape="circle" icon="minus" size="small" onClick={()=>{that.delete((detailArr[num].ordinal===undefined?detailArr[num]:detailArr[num].ordinal),num)}} />
                                        </Col>
                                    </Row>
                                    <Syx onRef={that.onRef.bind(that)} value={num+1} type={1} syx={that.getCalc.bind(that)} tbd={detailArr[i]} orderId={that.state.orderIds}></Syx>
                                </div>
                            </Row>
                        )
                    }

                    tbdList.push(data);
                }
            }else{
                //alert(1)
                for(var i=0;i<detailArr.length;i++){
                    let delNum=i;
                    var data=(
                        <Row key={'keys'+detailArr[i]} id={'dels'+detailArr[i]}>
                            <div>
                                <Row style={{paddingBottom:'10px'}}>
                                    <Col span={8} style={{textAlign:"right",paddingRight:"10px",fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>投保单{delNum+2}</Col>
                                    <Col span={2} push={10} style={{textAlign:"right"}}>
                                        <Button type="danger" shape="circle" icon="minus" size="small" onClick={()=>{that.delete(detailArr[delNum],delNum)}} />
                                    </Col>
                                </Row>
                                <Syx onRef={that.onRef.bind(that)} value={delNum+2} type={1} syx={that.getCalc.bind(that)}></Syx>
                            </div>
                        </Row>
                    )
                    tbdList.push(data);

                }
            }
            return tbdList

        }
        return (
            <Form className='fqsq'>
                <Row>
                    <div className='genre'>
                        <span className='genreIcon'></span>
                        <span className='genreTitle'>商业险</span>
                    </div>
                    <Row>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>保险公司</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('insurCompanyId', {
                                rules: [{ required: true, message: '请选择保险公司' }],
                                initialValue:''
                            })(
                                <Select
                                    placeholder="请选择" className="width_input" onChange={(e)=>{this.receipt(e)}}
                                    >
                                    {
                                        this.state.insur_company_list.map(function (i, k) {
                                            return <Option value={i.id.toString()}
                                                           key={k}>{i.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('type', {
                                initialValue:1
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:"0"}}
                                  wrapperCol={{ span: 10}}
                            >
                            {getFieldDecorator('receiptName', {
                                initialValue:''
                                //rules: [{ required: true, message: 'Please select your gender!' }],
                            })(
                                <div>
                                </div>

                            )}
                        </FormItem>
                        <FormItem
                            label={<span style={{color:"#7F8FA4"}}>收款机构</span>}
                            {...formInit}
                            >
                            {getFieldDecorator('receiptId', {
                                rules: [{ required: true, message: '请选择收款机构' }],
                                initialValue:''
                            })(
                                <Select
                                    placeholder="请选择" className="width_input"
                                    >
                                    {
                                        this.state.receipt_list.map(function (i, k) {
                                            return <Option value={i.id.toString()+'-'+i.name}
                                                           key={k} name={i.name}>{i.name}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        {
                            type||this.state.orderIds!==undefined?'':<Row style={{paddingBottom:'10px'}}>
                                <Col span={8} style={{textAlign:"right",paddingRight:"10px",fontSize:"14px",color:"#7F8FA4",marginBottom:"10px"}}>投保单1</Col>

                                <Col span={2} push={10} style={{textAlign:"right"}}>
                                    <Button type="primary" shape="circle" icon="plus" size="small" onClick={this.add.bind(this)}  />
                                </Col>
                            </Row>
                        }
                        {
                            type===0&&this.state.orderIds===undefined?<Syx onRef={this.onRef.bind(this)} value={1} type={1} syx={this.getCalc.bind(this)} ></Syx>:''
                        }
                        {
                            type?<Syx onRef={this.onRef.bind(this)} value={1} type={1} syx={this.getCalc.bind(this)} ></Syx>:''
                        }
                        {
                            this.state.orderIds===undefined?tbdLists(clickArr,false,this):tbdLists(detailArr,true,this)
                        }
                    </Row>
                </Row>
            </Form>
        )
    }
}
export default Form.create()(Insurance);