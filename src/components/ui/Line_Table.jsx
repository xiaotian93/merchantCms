import React , { Component } from 'react';
import { Row , Col } from 'antd';
// import moment from 'moment';

class Line_Table extends Component{
	constructor(props){
		super(props);
        this.state = { ...props.dataSource }
        this.columns = props.columns;
        this.line = props.line;
	}
    get_obj_key(obj,dataIndex){
        let res = "";
        let keys = dataIndex.split(".");
        if(keys.length<=1){
            return obj[keys[0]]||"";
        }
        res = JSON.stringify(obj[keys[0]])
        for(let k=1;k<keys.length;k++){
            res = JSON.parse(res)[keys[k]];
        }
        return res
    }
	render(){
        let columns = this.columns;
        let line = this.line;
        let count = 1,trs = [],tds = [];
        for(let c in columns){
            tds.push(
                <td className={columns[c].className||""} key={"key"+c}>{columns[c].title}</td>
            )
            let value = "";
            if(columns[c].dataIndex){
                // value = this.state[columns[c].dataIndex]||"";
                value = this.get_obj_key(this.state,columns[c].dataIndex);
            }else{
                value = columns[c].render(this.state);
            }
            tds.push(
                <td className={columns[c].className||""} key={"value"+c}>{value}</td>
            )
            if(count%line===0){
                trs.push(
                    <tr className={tds[0].props.className} key={"tr"+c}>
                        {tds.splice(0,line*2)}
                    </tr>
                )
            }
            count ++;
        }

		return (
			<Row>
                <Col span={24}>
                    <table className="line-table">
                        <tbody>
                            { trs }
                        </tbody>
                    </table>
                </Col>
            </Row>
		)
	}
}

export default Line_Table;