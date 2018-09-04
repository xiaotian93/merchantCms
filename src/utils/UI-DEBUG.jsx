import React , { Component } from 'react';
import { Row , Col , Card , Select , Table , Button , Modal , Upload , Input , message } from 'antd';

const Option = Select.Option;

class UI extends Component {
    constructor(props){
        super(props);
        this.state = {
            bdInvoiceStorageNoList:[],
            bdStorageNoList:[],
            supplement:{
                show:false
            }
        }
    }
    componentWillMount () {
        
    }
    componentDidMount(){
    }

    render() {
        return (
            <Row>
                <Col span={12}>
                    <Card title="Button(中)">
                        <Button type="primary">primary</Button>&emsp;
                        <Button type="default">default</Button>&emsp;
                        <Button type="success">success</Button>&emsp;
                        <Button type="danger">danger</Button>&emsp;
                    </Card>
                    <Card title="Button(小)">
                        <Button size="small" type="primary">primary</Button>&emsp;
                        <Button size="small" type="default">default</Button>&emsp;
                        <Button size="small" type="success">success</Button>&emsp;
                        <Button size="small" type="danger">danger</Button>&emsp;
                    </Card>
                    <Card title="Button(disabled)">
                        <Button disabled type="primary">primary</Button>&emsp;
                        <Button disabled type="default">default</Button>&emsp;
                        <Button disabled type="success">success</Button>&emsp;
                        <Button disabled type="danger">danger</Button>&emsp;
                    </Card>
                    <Card title="Input(默认)">
                        <Input placeholder="请输入" /><br /><br />
                        <Input disabled defaultValue="不可输入" /><br /><br />
                        <Select placeholder="请选择">
                            <Option value="1">待选项</Option>
                        </Select>
                    </Card>
                </Col>
            </Row>
        )
    }
}


export default UI;