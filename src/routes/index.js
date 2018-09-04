import React, { Component } from 'react';
import { Router, Route, hashHistory, browserHistory, IndexRedirect } from 'react-router';
import App from '../App';

import index from '../components/index';
import fq_query from '../components/installment/query';
import fq_audit from '../components/installment/audit';
import fq_detail from '../components/installment/detail/index';
import fq_pay from '../components/installment/pay/payment';
import fq_repay from '../components/installment/pay/repayment';

import version from '../components/pages/version'
import UI from '../utils/UI-DEBUG';
import NotFound from '../components/pages/NotFound';
import applySecond from '../components/installment/applyNew/indexSecond';


export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const { store } = this.props;
        const { auth } = store.getState().httpData;
        if (!auth || !auth.data.permissions.includes(permission)) hashHistory.replace('/404');
        return component;
    };
    render() {
        return (
            <Router history={browserHistory} location="hash">
                <Route path={'/'} components={App}>
                    <IndexRedirect to={'fq/query'} />
                    <Route path={'index'} component={index} />
                    <Route path={'fq/apply'} component={applySecond} />
                        <Route path={'fq/query'} component={fq_query} />
                        <Route path={'fq/query/pay'} component={fq_pay} />
                        <Route path={'fq/query/repay'} component={fq_repay} />
                        <Route path={'fq/query/detail'} component={fq_detail} />
                        <Route path={'fq/audit'} component={fq_audit} />
                        <Route path={'fq/audit/detail'} component={fq_detail} />
                        <Route path={'fq/apply/detail'} component={fq_detail} />
                        <Route path={'fq/detail'} component={fq_detail} />

                    {/*</Route>*/}
                    <Route path="/v" component={ version } />
                    <Route path="/UI" component={ UI } />
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        )
    }
}