// import * as React from 'react';
import { message } from 'antd';
import axios from 'axios';
import store from '@/redux';
import { logout } from '@/redux/actions';

axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
const service = axios.create({
    baseURL: " https://unicorn-server.herokuapp.com/",
    //baseURL: "http://localhost:4567",
    headers: {
        token: window.token
      }
});

service.interceptors.request.use(
    config => {
        // console.log('store.getState()===',store.getState().user)
        if (store.getState().user.data.token) {
            config.headers['Authorization'] = store.getState().user.data.token;
        }
        return config;
    }, 
    error => {
        return Promise.reject(error);
    }
)

service.interceptors.response.use(
    response => {
        console.log("response.data====",response.data);
        if (response.data.code === 401 || response.data.code === 403) {
            console.log('log out');
            store.dispatch(logout());
            message.error('token lost. login again');
        }

        return response.data;
    },
    error => {
        console.log('error===', error.response)
        const { status } = error.response;

        if (status === 401 || status === 403) {
            store.dispatch(logout());
            message.error('token lost. login again');
        } else {
            message.error('network error. try again');
        }
        
        return Promise.reject(error);
    }
)

export default service;
