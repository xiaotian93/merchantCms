import React, { Component } from 'react';
import { Form ,Layout } from 'antd';
import SiderCustom from './SiderCustom';
const { Content } = Layout;

class BasicForms extends Component {
    render() {
        return (
        <Layout className="ant-layout-has-sider">
            <SiderCustom />
          <Layout>
            <Content>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
        )
    }
}

const BasicForm = Form.create()(BasicForms);

export default BasicForm;