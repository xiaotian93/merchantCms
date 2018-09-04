import React, { Component } from 'react';
import axios from '../../ajax/request';

import { get_me } from '../../ajax/api';

class HeaderCustom extends Component {
    constructor(props){
        super(props);
        this.state = {
            select:[document.location.pathname.split("/")[1]],
            name:""
        }
    }
    componentDidMount(){
        axios.get(get_me).then(data=>{
            localStorage.setItem("businessType",data.data.businessInfo.businessType);
            this.setState({
                name:data.data.name
            })
        })
    }
    go_to(item){
        this.state.select.shift();
        this.state.select.push(item.key);
    }
    render() {
        return (
            <div className="nav-sh" style={{position:"fixed",left:"0px",top:"0px",width:"100%",zIndex:2000}}>
                <div className="nav-item">{this.state.name}</div>
                {/*<div className="nav-item"><Icon type="bell" /></div>*/}
            </div>
        )
    }
}


export default HeaderCustom;
