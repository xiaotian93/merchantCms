import React, { Component } from 'react';
import { Layout, Menu , Icon } from 'antd';
import { Link } from 'react-router';

import axios from '../../ajax/request';
import { logout } from '../../ajax/api';
import { set_logstate } from '../../ajax/tool';
import logo from '../../style/imgs/logo.png'

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    constructor(props){
        super(props);
        let keys = document.location.pathname
        let openKeys = keys.split("/").splice(0,2);
        this.state = {
            collapsed:true,
            openKeys:[openKeys.join('/')]
        };
    }
    onOpenChange(openKeys){
        this.setState({
            openKeys
        });
    }
    onSelect(data){
        let keys = data.key.split("/");
        let openKeys = keys.splice(0,2);
        this.onOpenChange([openKeys.join("/")]);
    }
    logout(){
        axios.get(logout).then(data=>{
            set_logstate(false);
        })
    }
    render() {
        let keys = document.location.pathname
        keys = keys.split("/").splice(0,3);
        let selectKeys = [keys.join('/')]
        return (
            <Sider className="side-sh" style={{position:"fixed",left:"0px",top:"0px",zIndex:2100,height:"100%"}}>
                <div className="logo">
                    <img src={logo} alt="白猫贷" />
                </div>
                <Menu theme="dark" defaultSelectedKeys={selectKeys} selectedKeys={selectKeys} onOpenChange={this.onOpenChange.bind(this)} openKeys={this.state.openKeys} onSelect={this.onSelect.bind(this)} onClick={this.handleClick} mode="inline">
                    {/*<Menu.Item key={'/index'}>
                        {<Link to={'/index'}><Icon type="home" /><span>首页</span></Link>}
                    </Menu.Item>*/}
                    <SubMenu key={'/fq'} title={<span><Icon type="fork" />&nbsp;分期管理</span>}>
                        <Menu.Item key={"/fq/apply"}>
                            <Link to={'/fq/apply'}><span>分期申请</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/fq/audit"}>
                            <Link to={'/fq/audit'}><span>待审核申请</span></Link>
                        </Menu.Item>
                        <Menu.Item key={"/fq/query"}>
                            <Link to={'/fq/query'}><span>分期申请查询</span></Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                <div className="side-foot">
                    <a className="foot-item" target="_blank" href={"http://www.baimaodai.com"}>关于我们</a>
                    <a className="foot-item" onClick={this.logout.bind(this)}>退出账户</a>
                </div>
            </Sider>
        )
    }
}

export default SiderCustom;