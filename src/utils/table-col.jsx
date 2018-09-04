// name width render data_index key_span val_span 
import React , { Component } from 'react';


class Table extends Component{
	constructor(props){
        super(props);
        this.state = {
        	...props["data-source"]
        }
    }
    update_data(){
        let columns = this.props['data-columns'];
        let data = this.props['data-source'];
        let num = parseInt(this.props['data-row'],10)||8;
        let trs = [],temp = [],count=0;
        if(data){
            for(let c in columns){
                let item = columns[c];
                temp.push(<td key={c+"key"} colSpan={item.span_key} style={{width:item.width_key}} className={"key "+ (item.className_key||"")}>{item.name}</td>);
                if(item.render){
                    temp.push(<td key={c+"val"} colSpan={item.span_val} style={{width:item.width_val}} className={item.className_val}>{ item.render(data) }</td>);
                }else{
                    temp.push(<td key={c+"val"} colSpan={item.span_val} style={{width:item.width_val}} className={item.className_val}>{data[c]}</td>);
                }
                count += parseInt(item.span_val||1,10) + parseInt(item.span_key||1,10);
                if(count%num===0){
                    trs.push(<tr key={"tr"+c}>{temp}</tr>);
                    temp = [];
                    count = 0;
                }
            }
        }
        return trs;
    }
    render(){
        let trs = this.update_data()
    	return (
    		<table className="bmd-tableCol">
    			<tbody>{ trs }</tbody>
    		</table>
    	)
    }
}

export default Table;