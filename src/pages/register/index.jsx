import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import { Form, Icon, Input, Button, message } from 'antd';
import { setLoginUser } from '@/commons';
import config from '@/commons/config-hoc';
import { ROUTE_BASE_NAME } from '@/router/AppRouter';
import Banner from './banner/index';
import './style.less'
import {
    userRegister
} from '@/services/login'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@config({
    path: '/register',
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
        this.props.history.push('/login');
    }

    validateNextPasswd = (rule, value, callback) => {
        const { form } = this.props;
        if (value) {
            form.validateFields(['confirmPassword'], { force: true })
        }
        callback();
    };

    validatorComfirmPasswd = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致');
        } else {
            callback();
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ loading: true, errMessage: '' });
                const { userName, password } = values;

                setTimeout(() => {
                    this.setState({ loading: false });
                    userRegister({
                        user_name: userName,
                        org_name: 'org1',
                        password: password
                    },
                        data => {
                            console.log('userLogin-data', data);
                            if (data.success) {
                                message.success('用户注册成功');
                                setLoginUser({
                                    id: 'tempUserId1',
                                    name: userName,
                                })
                            } else {
                                this.setState({ errMessage: '当前用户已存在' })
                            }
                            this.props.form.resetFields();
                        },
                        e => console.log('userLogin-error', e.toString()),
                    )
                }, 1000)
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
            },
        } = this.props;
        const { loading, errMessage } = this.state;

        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const comfirmPasswdError = isFieldTouched('confirmPassword') && getFieldError('confirmPassword');

        const { isMount } = this.state;
        const formItemStyleName = isMount ? 'form-item active' : 'form-item';

        return (
            <div styleName="root" className="login-bg">

                <Helmet title="欢迎注册" />
                <div styleName="left">
                    <Banner />
                </div>
                <div styleName="right">
                    <div styleName="box">
                        <Form onSubmit={this.handleSubmit} className='inputLine' autoComplete="off">
                            <div styleName={formItemStyleName}>
                                <div styleName="header">用户注册</div>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={userNameError ? 'error' : ''}
                                    help={userNameError || ''}
                                    hasFeedback
                                >
                                    {getFieldDecorator('userName', {
                                        rules: [{ required: true, message: '请输入用户名' }],
                                    })(
                                        <Input
                                            placeholder='用户名'
                                            allowClear
                                            autoFocus
                                            prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={passwordError ? 'error' : ''}
                                    help={passwordError || ''}
                                    hasFeedback
                                >
                                    {getFieldDecorator('password', {
                                        rules: [{
                                            required: true, message: '请输入密码'
                                        }, {
                                            validator: this.validateNextPasswd
                                        }
                                        ],
                                    })(
                                        <Input.Password
                                            placeholder="用户密码"
                                            // prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                                        />
                                    )}
                                </Form.Item>
                            </div>
                            <div styleName={formItemStyleName}>
                                <Form.Item
                                    validateStatus={comfirmPasswdError ? 'error' : ''}
                                    help={comfirmPasswdError || ''}
                                    hasFeedback
                                >
                                    {getFieldDecorator('confirmPassword', {
                                        rules: [{
                                            required: true,
                                            message: '请输入确认密码'
                                        }, {
                                            validator: this.validatorComfirmPasswd
                                        }
                                        ],
                                    })(
                                        <Input.Password
                                            placeholder="确认密码"
                                            // prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
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
                                    注册
                                </Button>
                            </div>
                        </Form>
                        <div styleName="error-tip">{errMessage}</div>

                        <div styleName="tip">
                            <span ><a style={{ color: 'white' }} onClick={this.handleGoBack}>返回登录</a></span>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

