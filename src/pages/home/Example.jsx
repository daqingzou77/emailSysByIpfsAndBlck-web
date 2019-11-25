import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Bar from './Bar';
import { DataBlock } from '@/library/components';
import PageContent from "@/layouts/page-content";
import {
    getUsers,
    getNodes,
    getBlocksHeight,
    getTrasactions,
    getNewTrasactions,
    getEmailDeatilByHash
} from '../../services/home'
import './style.less';

export default class Home extends Component {
    // constructor(...props) {
    //     super(...props);
    //     this.props.onComponentWillShow(() => {
    //         this.setState({
    //             users: 868,
    //             read: 1869,
    //             like: 666,
    //             warning: 28,
    //             start: 168,
    //         });
    //     });
    //
    //     this.props.onComponentWillHide(() => {
    //         this.setState({
    //             users: 0,
    //             read: 0,
    //             like: 0,
    //             warning: 0,
    //             start: 0,
    //         });
    //     });
    // }

    state = {
        users: 868,
        read: 1869,
        like: 666,
        warning: 28,
        start: 168,
    };

    componentDidMount() {
        this.getUsers();
        this.getNodes();
        this.getBlocksHeight();
        this.getTrasactions();
    }

    // 获取用户数
    getUsers = () => {
        getUsers({}, ({ data }) => {
            console.log('getUsers-data', data);
        },
            e => console.log('getUsers-error', e.toString()),
        );
    };

    // 获取节点数 
    getNodes = () => {
        getNodes({}, ({ data }) => {
            console.log('getNodes-data', data);
        },
            e => console.log('getNodes-error', e.toString()),
        );
    };

    // 获取区块高度
    getBlocksHeight = () => {
        getBlocksHeight({}, ({ data }) => {
            console.log('getBlocksHeight-data', data);
        },
            e => console.log('getBlocksHeight-error', e.toString()),
        );
    };

    // 获取交易数
    getTrasactions = () => {
        getTrasactions({}, ({ data }) => {
            console.log('getTrasactions-data', data);
        },
            e => console.log('getTrasactions-error', e.toString()),
        );
    };
    
    // 获取最新几笔交易
    getNewTrasactions = () => {
        getNewTrasactions({}, ({ data }) => {
            console.log('getNewTrasactions-data', data);
        },
            e => console.log('getNewTrasactions-error', e.toString()),
        );
    }

    // 获取邮件详情
    getEmailDeatilByHash = () => {
        getEmailDeatilByHash({}, ({ data }) => {
            console.log('getEmailDeatilByHash-data', data);
        },
            e => console.log('getEmailDeatilByHash-error', e.toString()),
        );
    }

    render() {
        const {
            users,
            read,
            like,
            warning,
            start,
        } = this.state;

        const colStyle = {
            border: '1px solid #e8e8e8',
            borderRadius: '5px',
            padding: 8,
            background: '#fff'
        };
        return (
            <PageContent>
                <div styleName="statistics">
                    <DataBlock
                        color="#00dffe"
                        color2='#029cf5'
                        count={users}
                        tip="用户数"
                        icon="user"
                    />
                    <DataBlock
                        color="#ff8a85"
                        color2='#ff6086'
                        count={read}
                        tip="节点数"
                        icon="area-chart"
                    />
                    <DataBlock
                        color="#fbae52"
                        color2='#fda33a'
                        count={like}
                        tip="区块高度"
                        icon="column-height"
                    />
                    <DataBlock
                        color="#b7a0f9"
                        color2="#7c69ff"
                        count={warning}
                        tip="交易数"
                        icon="block"
                    />
                </div>
                <Row style={{ marginTop: 10 }}>
                    <Col>
                        <div style={colStyle}>
                            <Bar />
                        </div>
                    </Col>
                </Row>
            </PageContent>
        );
    }
}
