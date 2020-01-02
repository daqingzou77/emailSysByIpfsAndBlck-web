import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import { Form, Icon, Input, Button, message } from 'antd';
import { setLoginUser } from '@/commons';


import config from '@/commons/config-hoc';
import { ROUTE_BASE_NAME } from '@/router/AppRouter';
import Banner from './banner/index';
import './style.less'
import {
    userLogin
} from '../../services/login';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@config({
    path: '/login',
    noFrame: true,
    noAuth: true,
    keepAlive: false,
})
export default class extends Component {
    state = {
        loading: false,
        errMessage: '',
        isMount: true,
    };

    componentDidMount() {
        const { form: { validateFields } } = this.props;
        // 一开始禁用提交按钮
        validateFields(() => void 0);

        setTimeout(() => this.setState({ isMount: true }), 200);

    }

    handleGoBack = () => {
        this.props.history.push('/register');
    }

    handleSubmit = (e) => {
        const { form } = this.props;
        e.preventDefault(); // 取消事件的默认动作。
        form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true, errMessage: '' });
                
                const { userName, password } = values;

                setTimeout(() => {
                    this.setState({ loading: false });
                    userLogin({
                        user_name: userName,
                        org_name: 'org1',
                        password: password
                    },
                        data => {
                            console.log('userLogin-data', data);
                            if (data.success) {
                                message.success('登录成功');
                                setLoginUser({
                                    id: 'tempUserId1',
                                    name: userName,
                                    token: data.token,
                                })
                                console.log('token', data.token);
                                // // 跳转页面，优先跳转上次登出页面
                                // const lastHref = window.sessionStorage.getItem('last-href');

                                // // // 强制跳转 进入系统之后，需要一些初始化工作，需要所有的js重新加载
                                // window.location.href = lastHref || `${ROUTE_BASE_NAME}/`;
                                this.props.history.push('/');
                            } else {
                                this.setState({ errMessage: '用户名或密码错误！' })
                            }
                        },
                        e => console.log('userLogin-error', e.toString()),
                    )
                }, 1000);
            }
        });
    };



    render() {
        const {
            form: {
                getFieldDecorator,
                getFieldsError,
                getFieldError,
                isFieldTouched,
            }
        } = this.props;

        const { loading, errMessage, isMount } = this.state;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        const formItemStyleName = isMount ? 'form-item active' : 'form-item';


        return (
            <div styleName="root" className="login-bg">

                <Helmet title="欢迎登陆" />
                {/*<div style={{position: 'fixed', bottom: -1000}}><Color/></div>*/}
                <div styleName="left">
                    <Banner />
                </div>
                <div styleName="right">
                    <div styleName="box">
                        <Form onSubmit={this.handleSubmit} className='inputLine' autoComplete="off">
                            {/* <div styleName={formItemStyleName}> */}
                            <div styleName="header">欢迎登录</div>
                            {/* </div> */}
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={userNameError ? 'error' : ''}
                                    help={userNameError || ''}
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入用户名' }],
                                        initialValue: '',
                                    })(
                                        <Input
                                            allowClear
                                            autoFocus
                                            prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                            placeholder="用户名"
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={passwordError ? 'error' : ''}
                                    help={passwordError || ''}
                                >
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: '请输入密码' }],
                                        initialValue: '',
                                    })(
                                        <Input.Password
                                            prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                            placeholder="密码"
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Button
                                    styleName="submit-btn"
                                    loading={loading}
                                    type="primary"
                                    htmlType="submit"
                                    disabled={hasErrors(getFieldsError())}
                                >
                                    登录
                                </Button>
                            </div>
                        </Form>
                        <div styleName="error-tip">{errMessage}</div>
                        <div styleName="tip">
                            <span><a style={{ color: 'white' }} onClick={this.handleGoBack}>用户注册</a></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

