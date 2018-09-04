import React , { Component } from 'react';
import { Row , Col , DatePicker , Select } from 'antd';
// import moment from 'moment';

import Btn from './Buttons';
const RangePicker = DatePicker.RangePicker
const Option = Select.Option;

class Filter extends Component{
    constructor(props){
        super(props);
        this.state = { ...props }
    }
    componentDidMount(){
        this.reset_data();
    }
    textChange(e){
        let key = e.target.getAttribute("id");
        this.setState({
            [key]:e.target.value
        })
    }
    selectChange(val,key){
        this.setState({
            [key]:val
        })
    }
    dateChange(date1,date2,key){
        this.setState({
            [key]:date1
        })
    }
    get_data(e){
        let items = this.state['data-source'];
        let values = [];
        console.log(items)
        for(let i in items){
            if(!this.state[i]||this.state[i].length<=0){
                continue;
            }
            if(items[i].type==="range_date"){
                let start = {}
                let sdate = this.state[i][0];
                start.key = items[i].feild_s;
                start.value = this.state[i]?sdate.format("YYYY-MM-DD") + " 00:00:00":"";
                start.op = "ge";
                let end = {};
                let edate = this.state[i][1];
                end.key = items[i].feild_e;
                end.value = this.state[i]?edate.format("YYYY-MM-DD") + " 23:59:59":"";
                end.op = "le";
                values.push(start,end);
            }else if(items[i].type==="multi_select"){
                let arr = [];
                arr = this.state[i]||[];
                values.push({
                    key:i,value:arr.join(','),op:"in"
                })
            }else if(items[i].type==="single_date"){
                let val = {};
                val.key = i;
                val.value = this.state[i].format("YYYY-MM-DD")||"";
                val.op = items[i].op?items[i].op:"eq";
                values.push(val);
            }else{
                let val = {};
                val.key = i;
                val.value = this.state[i]||"";
                val.op = items[i].op?items[i].op:"eq";
                values.push(val);
            }
        }
        this.props['data-get'](values);
    }
    reset_data(e){
        let items = this.state['data-source'];
        let null_data = {}
        for(let i in items){
            if(!items[i].default&&(!this.state[i]||this.state[i].length<=0)){
                continue;
            }
            null_data[i] = "";
            if(items[i].type==="range_date"){
                console.log(items[i].default)
                null_data[i] = items[i].default;
            }else if(items[i].type==="multi_select"){
                null_data[i] = [];
            }else if(items[i].type==="select"){
                null_data[i] = "";
            }else{
                document.getElementById(i).value = "";
            }
        }
        this.setState(null_data)
    }
    render(){
        let items = this.state["data-source"];
        let filter_elements = [];
        for(let i in items){
            let ele = "";
            let label = (
                <Col key={i+"key"} span={2}>
                    <label className="f3">{items[i].name}</label>
                </Col>
            )
            if(items[i].type==="range_date"){
                ele = (
                    <Col key={i} span={4}>
                        <RangePicker value={this.state[i]} className={i} placeholder={items[i].placeHolder} onChange={(date,str)=>{ this.dateChange(date,str,i) }} />
                    </Col>)
            }else if(items[i].type==="text"){
                ele = (
                    <Col key={i} span={4}>
                        <input id={i} onChange={this.textChange.bind(this)} type="text" className="ipt-text" placeholder={items[i].placeHolder} />
                    </Col>)
            }else if(items[i].type==="select"){
                let values = items[i].values;
                let opt_ele = [];
                for(let v in values){
                    opt_ele.push(<Option key={v} value={values[v].val+""}>{values[v].name}</Option>)
                }
                let select = (<Select value={this.state[i]} id={i} placeholder={items[i].placeHolder} onChange={(val)=>{ this.selectChange(val,i)}}>{opt_ele}</Select>);
                ele = (
                    <Col key={i} span={4}>
                        {select}
                    </Col>)
            }else if(items[i].type==="multi_select"){
                let val_key = items[i].values;
                let ops = this.state[val_key];
                let opt_ele = [];
                for(let o in ops){
                    opt_ele.push(<Option key={ops[o].val}>{ops[o].name}</Option>)
                }
                ele = (
                    <Col key={i} span={4}>
                        <Select key={i} value={this.state[i]} mode="multiple" placeholder={items[i].placeHolder} onChange={(val)=>{ this.selectChange(val,i)}}>
                            {opt_ele}
                        </Select>
                    </Col>
                )
            }
            filter_elements.push(label,ele);
        }
        return (
            <Row className="filter">
                <Col span={20}>
                    <Row>
                        {filter_elements.slice(0,8)}
                    </Row>
                    <Row>
                        {filter_elements.slice(8,16)}
                    </Row>
                </Col>
                <Col span={1} className="line" />
                <Col span={3} className="btns">
                    <Btn type="success" onClick={this.get_data.bind(this)}>查&emsp;询</Btn><br />
                    <Btn type="default" onClick={this.reset_data.bind(this)}>重&emsp;置</Btn>
                </Col>
            </Row>
        )
    }
}

export default Filter;