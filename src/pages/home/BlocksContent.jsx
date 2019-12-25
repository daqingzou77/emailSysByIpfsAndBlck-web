import React, { Component } from 'react';
import { Table, Form, Icon, Row, Col, Card, Tag, Typography, Modal, Descriptions } from 'antd';
import {
    getBlockInfos
} from '@/services/home';
import './style.less';

const { Title } = Typography;
const { CheckableTag } = Tag;

@Form.create()
export default class BlockContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: {
                height: '',
                current_hash: '',
                prev_hash: '',
                data_hash: '',
                time_stamp: '',
                txs_info: [],
                txs_len: '',
            },
            dataSource: [],
            showModal: false,
            storeDataSource: [],
        };
        this.columns = [{
            title: '区块高度',
            dataIndex: 'height',
            key: 'height',
            align: 'center',
        }, {
            title: '前序区块哈希',
            dataIndex: 'prev_hash',
            key: 'prev_hash',
            align: 'center',
        }, {
            title: '当前区块哈希',
            dataIndex: 'current_hash',
            key: 'current_hash',
            align: 'center',
            render: (text, record) => {
                const that = this;
                return (
                    <a style={{ color: '#029EF5' }} onClick={() => that.handleClick(record)}>{record.current_hash}</a>
                )
            }
        }, {
            title: '区块数据哈希',
            dataIndex: 'data_hash',
            key: 'data_hash',
            align: 'center',
        }, {
            title: '区块时间戳',
            dataIndex: 'time_stamp',
            key: 'time_stamp',
            align: 'center',
        }, {
            title: '交易数量',
            dataIndex: 'txs_len',
            key: 'txs_len',
            align: 'center',
        }
        ]
    }

    componentDidMount() {
        this.getDataSouce();
    }

    getDataSouce = () => {
        getBlockInfos(
            {},
            data => {
                console.log('getBlockInfos-data', data);
                if (data.success) {
                    console.log('message', JSON.parse(data.message));
                    const message = JSON.parse(data.message);
                    const { blocks_infos } = message;
                    const dataSource = [];
                    blocks_infos.map((item, index) => {
                        item.time_stamp = item.time_stamp.replace('~', ' ');
                        dataSource.push(item);
                    });
                    console.log('dataSource', dataSource);
                    this.setState({
                        dataSource,
                    })
                }
            },
            e => console.log('getBlockInfos-error', e.toString())
        )
    };

    showAllBlocks = () => {
        this.props.showAllBlocks(true);
    }

    handleClick = value => {
        console.log('value', value);
        this.setState({
            showModal: true,
            detail: value
        })
    }

    handleOnOk = () => {
        this.setState({
            showModal: false
        })
    }

    handleOnCancel = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const style = {
            fontWeight: 'bold',
            fontSize: 14,
            lineHeight: 1.5,
        }
        const { dataSource, showModal, detail } = this.state;
        let transInfo = {};
        if (detail) {
            const details = detail.txs_info[0];
            if (details) {
                details.time_stamp = details.time_stamp.substring(0, details.time_stamp.indexOf('+') - 1);
                transInfo = Object.assign({}, details);
            }
        }
        return (
            <div style={{ marginTop: 10 }} >
                <Row>
                    <Col>
                        <Card
                            title={<Title level={4}><Icon type='mail' />&nbsp;区块详情</Title>}
                            extra={<CheckableTag checked onChange={this.showAllBlocks}>返回</CheckableTag>}
                            style={{ height: 750 }}
                        >
                            <Table
                                dataSource={dataSource}
                                columns={this.columns}
                            />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    styleName='blockContent'
                    visible={showModal}
                    title='区块详情'
                    onOk={this.handleOnOk}
                    onCancel={this.handleOnCancel}
                >
                    <p>区块高度：{detail.height}</p>
                    <p>前序区块哈希：{detail.prev_hash}</p>
                    <p>当前区块哈希：{detail.current_hash}</p>
                    <p>数据哈希：{detail.data_hash}</p>
                    <p>时间戳：{detail.time_stamp}</p>
                    <p>交易数量：{detail.txs_len}</p>
                    <Descriptions title="交易详情" bordered>
                        <Descriptions.Item label='交易哈希' span={3}>{transInfo.tx_id}</Descriptions.Item>
                        <Descriptions.Item label='所在区块' span={3}>{transInfo.position}</Descriptions.Item>
                        <Descriptions.Item label='时间戳' span={3}>{transInfo.time_stamp}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            </div>
        );
    }
}


