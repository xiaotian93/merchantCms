import React, { Component } from 'react';
import { Layout } from 'antd';
import './style/style.less';

import { add_event } from './ajax/tool';
import HeaderCustom from './components/pages/HeaderCustom';
import SiderCustom from './components/pages/SiderCustom';
import Login from './components/pages/Login'

window.Number.prototype.money = function(num=2){
    return parseFloat(this/100).toFixed(num);
}
window.String.prototype.money = function(num=2){
    return parseFloat(this/100).toFixed(num);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view_height: window.innerHeight,
        };
    }
    componentWillMount () {
        
    }
    componentDidMount(){
        window.onresize = () => {
            this.setState({
                view_height:window.innerHeight
            })
        }
        let page = document.getElementById("page-content");
        add_event(this.page_scroll.bind(this),page);
    }
    page_scroll(e){
        // let page = document.getElementById("page-content");
        // let calendar_picker = document.querySelectorAll(".ant-calendar-picker-container")[0];
        // let select_dropdown = document.querySelectorAll(".ant-select-dropdown")[0];
        // let popY = e.deltaY;
        // if(e.wheelDeltaY>0&&page.scrollTop===0){
        //     return;
        // }
        // console.log(popY)
        // if(calendar_picker){
        //     let top = calendar_picker.offsetTop;
        //     calendar_picker.style.top = top - popY + "px";
        // }
        // if(select_dropdown){
        //     let top = select_dropdown.offsetTop;
        //     select_dropdown.style.top = top - popY + "px";
        // }
    }
    render() {
        if(localStorage.getItem("isLogin")!=="true"){
            return <Login />
        }
        return (
            <Layout className="bmd">
                <SiderCustom />
                <Layout>
                    <HeaderCustom />
                    <div id="page-content" style={{paddingTop:"50px",paddingLeft:"200px",minHeight:this.state.view_height+'px'}}>
                    {/*<div id="page-content" style={{height:this.state.view_height+'px',overflowY:"auto"}}>*/}
                        {this.props.children}
                    </div>
                </Layout>
            </Layout>
        );
    }
}

export default App;