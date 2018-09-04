import React , { Component } from 'react';
import {Row,Form,Select,Input,DatePicker,Col,Button,message} from 'antd';
import axios from '../../../ajax/request.js';
import api from '../../../ajax/api.js';
import TbdInput from './tbd';
var clickNum=1,clickArr=[],teatArr=[],refArr=[],syx=0;
var tbdList=[];
class Tbd extends Component{
    constructor(props) {
        super(props);
        props.onRef(this);
        this.state={
            addClick:[],
            dataArr:[],
            orderId:props.orderId,
            businessType:''
        }
    }
    componentDidMount(){
        axios.get(api.get_me).then(data=>{
            this.setState({
                businessType:data.data.businessInfo.businessType===1?0:1
            })
        })
        this.state.orderId?setTimeout(function(){this.syx();}.bind(this),1300):''


    }
    componentWillMount(){
        clickArr=[];
    }
    add(){
        var tbdNum,warn;
        if(this.state.businessType==0){
            tbdNum=(this.state.orderId?6:5);
            warn='最多可添加6个保单';
        }else{
            tbdNum=(this.state.orderId?2:1);
            warn='最多可添加2个保单';
        }
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
        refArr.splice(k+1,1);
        //if(this.state.orderId){
            //refArr.splice(k,1)

        //}else{
        //    refArr.splice(k+1,1)
        //}

        this.syx();
    }
    onRef(e) {
        this.tbd=e;
        refArr.push(e)
    }
    getDate() {
        //console.log(this.tbd.props.form.getFieldsValue())
        var bb=[];
        for(var i in refArr){
            refArr[i].props.form.validateFields()
            if(JSON.stringify(refArr[i].props.form.getFieldsValue())!=='{}'){
                bb.push(refArr[i].props.form.getFieldsValue())
            }

        }
        return bb;
        //console.log(bb.push(this.tbd.props.form.getFieldsValue()))

    }
    syx(e){
        var syx=0;
        for(var i in refArr){
            if(JSON.stringify(refArr[i].props.form.getFieldsValue())!=='{}'){
                syx+=refArr[i].props.form.getFieldValue('syx')===''?0:parseFloat(parseFloat(refArr[i].props.form.getFieldValue('syx')).toFixed(2));
            }
        }
        this.props.calc(syx)
    }
    delsyx(e){
        syx-=(e===''?0:parseFloat(e));
        this.props.calc(syx)
    }

    render() {
        //this.state.orderId?this.syx():'';
        var detailArr=this.props.tbdList;
        if(this.state.orderId){
            clickNum=detailArr[detailArr.length-1].ordinal===undefined?detailArr[detailArr.length-1]:detailArr[detailArr.length-1].ordinal;
        }
        var tbdList=[];
        function tbdLists(detailArr,edit,that) {
            //console.log(detailArr)
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
                                <TbdInput onRef={that.onRef.bind(that)} value={1} syx={that.syx.bind(that)} tbdDetal={detailArr[i]}></TbdInput>
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
                                    <TbdInput onRef={that.onRef.bind(that)} value={num+1} syx={that.syx.bind(that)} tbdDetal={detailArr[i]}></TbdInput>
                                </div>
                            </Row>
                        )
                    }

                    tbdList.push(data);
                }
            }else{
                //alert(1)
                console.log(detailArr)
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
                                <TbdInput onRef={that.onRef.bind(that)} value={i+2} syx={that.syx.bind(that)} ></TbdInput>
                            </div>
                        </Row>
                    )
                    tbdList.push(data);

                }
            }
            return tbdList

        }
        return (
            <Row id="tbdTotal">

                <Row>
                    <div className='genre'>
                        <span className='genreIcon'></span>
                        <span className='genreTitle'>商业险</span>
                    </div>
                    <TbdInput onRef={this.onRef.bind(this)}></TbdInput>
                </Row>
                <Row>
                    <div className='genre'>
                        <span className='genreIcon'></span>
                        <span className='genreTitle'>商业附加险</span>
                    </div>
                    <TbdInput onRef={this.onRef.bind(this)}></TbdInput>
                </Row>
            </Row>
        )
    }
}
export default Tbd;
