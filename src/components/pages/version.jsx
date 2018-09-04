import React , { Component } from 'react';
import { Card , Table } from 'antd';
import versions from '../../version';
import { format_table_data } from '../../ajax/tool';


class Version extends Component {
    constructor(props){
        super(props);
        this.state = {
            min_height:window.innerHeight
        }
    }
    componentWillMount(){
        this.columns = [
            {
                title:"序号",
                dataIndex:"key"
            },
            {
                title:"版本号",
                dataIndex:"version"
            },
            {
                title:"日期",
                dataIndex:"date"
            },
            {
                title:"更新内容",
                dataIndex:"content"
            }
        ]
    }
    render() {
        let table_props = {
            columns : this.columns,
            className : "table-sh",
            pagination : false,
            rowKey : "key",
            dataSource : format_table_data(versions).reverse()
        }
        return (
            <Card title="版本信息">
                <Table {...table_props} bordered />
            </Card>
        );
    }
}


export default Version;