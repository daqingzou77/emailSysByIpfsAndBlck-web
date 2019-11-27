import React, { Component } from 'react';
import { Row, Col } from 'antd';
import Bar from './Bar';
import { DataBlock } from '@/library/components';
import PageContent from "@/layouts/page-content";
import {
  getChainInfo,
  getNewTrasactions,
  getEmailDeatilByHash
} from '@/services/home'
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
        users: 0,
        nodes: 0,
        heights: 0,
        transactions: 0,
    };

    componentDidMount() {
      this.getChainInfo();
    }

    // 获取链上信息
    getChainInfo = () => {
       getChainInfo({}, data => {
         console.log('getChainInfo-data', data);
         const { user_nums, node_nums, block_height, transactions } = JSON.parse(data.message);
         this.setState({
            users: user_nums,
            nodes: node_nums,
            heights: block_height,
            transactions,
         })
       },
       e => console.log('getChainInfo-error', e.toString()),
       )
    }

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
            nodes,
            heights,
            transactions,
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
                        count={nodes}
                        tip="节点数"
                        icon="area-chart"
                    />
                    <DataBlock
                        color="#fbae52"
                        color2='#fda33a'
                        count={heights}
                        tip="区块高度"
                        icon="column-height"
                    />
                    <DataBlock
                        color="#b7a0f9"
                        color2="#7c69ff"
                        count={transactions}
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
