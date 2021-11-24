import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import store from '@/redux';

export class PermissionAuth extends React.Component {
    render() {
        const {location,config} = this.props;
        const {pathname} = location;
        const isLogin = store.getState().user.data.token;

        const targetRouterConfig = config.find(v => v.path === pathname);
         if (targetRouterConfig && !targetRouterConfig.auth && !isLogin) {
             const { component } = targetRouterConfig;
             return <Route exact path={ pathname } component={ component } />
         }


         if(isLogin) {
            if(pathname === '/login') {
                return <Redirect tp='/'/>
            } else {
                if(targetRouterConfig) {
                    return <Route path={ pathname } component={ targetRouterConfig.component } />
                } else {
                    return <Redirect to='/404' />
                }
            }
        } else {
            if (targetRouterConfig && targetRouterConfig.auth) {
                return <Redirect to='/login' />
            } else {
                return <Redirect to='/404' />
            }
        }
 
    }
}