import * as React from 'react';
import { Input, Button,Checkbox,message } from 'antd';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import logo from "@/assets/uu.jpg";

import {login,register} from '@/redux/actions';
import '@/layout/login.less';
import { validNumber, validPass } from '@/utils/valid';
import DocumentTitle from 'react-document-title';


interface IProps {
    login:any,
    register: any,
    history:any
}
interface IState {
    formLogin: {
        userName: string,
        userPwd: string
    },
    formRegister: {
        userName?: string,
        userPwd2?: string,
        userPwd?: string,
        userAge?: string,
        userSchool?: string,
        userInterest?: string
    },
    typeView: number,
    checked: boolean,
    isLoading: boolean
}

class Login extends React.Component<IProps,IState>{
    constructor(props:any) {
        super(props);
        this.state = {
            formLogin:{
                userName : '',
                userPwd : '',
            },

            formRegister: {
                userName:'',
                userPwd2:'',
                userPwd:'',
                userAge:'',
                userSchool:'',
                userInterest:''

            },
            typeView:0,
            checked:false,
            isLoading:false,
            
        }
    }



    setCookie= (user_name:string, user_pwd:string, exdays:number)=> {
        let exdate = new Date();
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
        document.cookie = `userName=${user_name};path=/;expires=${exdate.toUTCString()}`;
        document.cookie = `userPwd=${user_pwd};path=/;expires=${exdate.toUTCString()}`;
    }
    getCookie=()=>{
        const {formLogin} = this.state;
        if(document.cookie.length > 0) {
            let arr = document.cookie.split('; '); 
            console.log(arr) 
            for(let i=0;i<arr.length;i++) {
                let arr2=arr[i].split('=')

                if(arr2[0] === 'userName') {
                    this.setState({
                        formLogin: {
                            userName:arr2[1],
                            userPwd: formLogin.userPwd
                        }
                    })
                } else if(arr2[0] === 'userPwd') {
                    this.setState({
                        formLogin:{
                            userName : formLogin.userName,
                            userPwd:arr2[1]
                        }
                    })
                }
            }
        }
    }

    clearCookie=() =>{
        this.setCookie('','',-1);
    }

    handleLogin = () => {
        const {login,history} = this.props;
        const{formLogin,checked}=this.state;



        if(!validPass(formLogin.userPwd)) {
            message.error('plz input correct pwd');
            return false;
        }

        if(checked) {
            this.setCookie(formLogin.userName,formLogin.userPwd,7)
        } else {
            this.clearCookie();
        }

        login(formLogin.userName, formLogin.userPwd)
        .then((res:any)=>{
            console.log('login===',res);
            if(res.code === 0) {
                this.clearInput();
                message.success('login success');
                history.push('/');
            }
        })
        .catch((error:any)=>{
            message.error(error);
        })
    }

    handleRegister = () => {
        console.log(this.props);
        const {register,history} = this.props;
        const {formRegister} = this.state;

        if(!validPass(formRegister.userPwd)) {
            message.error('plz input pwd greater than 8 characters');
            return false;
        } else if(!validPass(formRegister.userPwd2) || (formRegister.userPwd2 !== formRegister.userPwd)) {
            message.error("pwd unmatch");
            return false;
        }

        if(!validNumber(formRegister.userAge)) {
            message.error('age should be number');
            return false;
        }
        register(
            formRegister.userName,
            formRegister.userPwd2,
            formRegister.userAge,
            formRegister.userSchool,
            formRegister.userInterest,
        ) 
        .then((res:any) =>{
            if(res.code === 0) {
                this.clearInput();
                message.success('sign up ok');
                history.push('/');
            }
            else {
                this.clearInput();
                message.error(res.msg);
            }
        })
        .catch((error:any)=>{
            message.error(error);
        })
    }

    handleTab=(type : number) => {
        this.setState({
            typeView:type
        })
        this.clearInput();

    }

    checkChange = (e:any) => {
        console.log (e.target.checked);
        this.setState({
            checked: e.target.checked
        })
    }

    clearInput = ()=> {
        this.setState({
            formLogin: {
                userName:'',
                userPwd:''
            },
            formRegister:{
                userName:'',
                userPwd:'',
                userPwd2:'',
                userAge:'',
                userInterest:'',
                userSchool:''
                
                
            }
        })
    }


    forgetPwd = ()=>{
        message.info('just..tell any of TEAM_U');
    }
    handleChangeInput = (e:any, type:number) => {
        const { formLogin } = this.state;
        this.setState ({
            formLogin:{
                userName:type ===1 ? e.target.value : formLogin.userName,
                userPwd:type ===2 ? e.target.value : formLogin.userPwd,
            }
        })
    }
    handleChangeRegister = (e:any, type:number) => {
        const { formRegister } = this.state;
        this.setState ({
            formRegister:{
                userName:type ===1 ? e.target.value : formRegister.userName,
                userPwd:type ===2 ? e.target.value : formRegister.userPwd,
                userPwd2:type ===3 ? e.target.value : formRegister.userPwd2,
                userAge:type ===4 ? e.target.value : formRegister.userAge,
                userSchool:type ===5 ? e.target.value : formRegister.userSchool,
                userInterest:type ===6 ? e.target.value : formRegister.userInterest

            }
        })
    }
    handleEnterKey = (e: any, type: number) => {
        const { formLogin, formRegister } = this.state;
        if (type === 1) {
            if (!formLogin.userName || !formLogin.userPwd) {
                return;
            } else {
                if(e.nativeEvent.keyCode === 13){ 
                    this.handleLogin();
                }
            }
        } else {
            if (!formRegister.userName || !formRegister.userPwd || !formRegister.userPwd2) {
                return;
            } else {
                if(e.nativeEvent.keyCode === 13){
                    this.handleRegister();
                }
            } 
        }
    }

    render() {
        const{ formLogin, formRegister,typeView,checked} = this.state;
        return (
            <DocumentTitle title={'Unicorn'}>
                <div className="login-container">
                    <div className="pageHeader">
                        <img src={ logo } alt="logo" />
                        <span>Unicorn</span>
                    </div>
                    <div className="login-box">
                        <div className="login-text">
                            <span className={ typeView === 0 ? 'active' : '' } onClick={ () => this.handleTab(0) }>Sign In</span>
                            <b>·</b>
                            <span className={ typeView === 1 ? 'active' : '' } onClick={ () => this.handleTab(1) }>Sign Up</span>
                        </div>
                        {typeView === 0?
                            <div className="right-content">
                                <div className="input-box">
                                    <Input
                                        type="text"
                                        className="input"
                                        value={formLogin.userName}
                                        onChange={(e:any)=>this.handleChangeInput(e,1)}
                                        placeholder="input username"
                                    />
                                    <Input
                                    type="password"
                                    className="input"
                                    maxLength={20}
                                    value={formLogin.userPwd}
                                    onChange={(e:any)=>this.handleChangeInput(e,2)}
                                    onPressEnter={(e:any)=>this.handleEnterKey(e,1)}
                                    placeholder='input password'
                                    />
                                </div>
                                <Button className="loginBtn" type="primary" onClick={ this.handleLogin } disabled={ !formLogin.userName || !formLogin.userPwd }>Login</Button>
                                <div className="option">
                                    <Checkbox className="remember" checked={ checked } onChange={ this.checkChange }>
                                        <span className="checked">Remember me</span>
                                    </Checkbox>
                                    <span className="forget-pwd" onClick={ this.forgetPwd }>Forget password?</span>
                                </div>
                            </div>
                            :
                            <div className="right_content">
                                <div className="input-box">
                                    <Input
                                        type="text"
                                        className="input"
                                        value={ formRegister.userName }
                                        onChange={ (e: any) => this.handleChangeRegister(e, 1) }
                                        placeholder="input username"
                                    />
                                    

                                    <Input
                                        type="text"
                                        className="input"
                                        value={ formRegister.userAge }
                                        onChange={ (e: any) => this.handleChangeRegister(e, 4) }
                                        placeholder="input age"
                                    />
                                    <Input
                                        type="text"
                                        className="input"
                                        value={ formRegister.userSchool }
                                        onChange={ (e: any) => this.handleChangeRegister(e, 5) }
                                        placeholder="input school"
                                    />
                                    <Input
                                        type="text"
                                        className="input"
                                        value={ formRegister.userInterest }
                                        onChange={ (e: any) => this.handleChangeRegister(e, 6) }
                                        placeholder="input interests, use space to divide"
                                    />
                                    <Input
                                        type="password"
                                        className="input"
                                        maxLength={ 20 }
                                        value={ formRegister.userPwd }
                                        onChange={ (e: any) => this.handleChangeRegister(e, 2) }
                                        placeholder="input password"
                                    />
                                    <Input
                                        type="password"
                                        className="input"
                                        maxLength={ 20 }
                                        value={ formRegister.userPwd2 }
                                        onChange={ (e: any) => this.handleChangeRegister(e, 3) }
                                        onPressEnter={ (e: any) => this.handleEnterKey(e, 2) }
                                        placeholder="password again"
                                    />
                                </div>
                            <Button className="loginBtn" type="primary" onClick={ this.handleRegister } disabled={ !formRegister.userName || !formRegister.userPwd || !formRegister.userPwd2 }>Register</Button>
                            </div>
                        }

                    </div>
            </div>
            </DocumentTitle>
        )
    }

}

export default withRouter(connect((state: any) => state.user, { login, register })(Login))





