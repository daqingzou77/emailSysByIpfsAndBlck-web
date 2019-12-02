import React, { Component } from 'react';
import { Table, Form, Icon, Row, Col, Card, Tag, Typography } from 'antd';
import {
  getBlockInfos
} from '@/services/home';
const { Title } = Typography;
const { CheckableTag } = Tag;


@Form.create()
export default class BlockDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      storeDataSource: [],
    };
    this.columns = [{
      title: '区块高度',
      dataIndex: 'height',
      key: 'height',
      align: 'center',
    }, {
      title: '当前区块哈希',
      dataIndex: 'current_hash',
      key: 'current_hash',
      align: 'center',
    }, {
      title: '前序区块哈希',
      dataIndex: 'prev_hash',
      key: 'prev_hash',
      align: 'center',
    },
    // {
    //   title: '区块数据哈希',
    //   dataIndex: 'data_hash',
    //   key: 'data_hash',
    //   align: 'center',
    // }, 
    {
      title: '区块时间戳',
      dataIndex: 'time_stamp',
      key: 'time_stamp',
      align: 'center',
    },
      // {
      //   title: '交易数量',
      //   dataIndex: 'txs_len',
      //   key: 'txs_len',
      //   align: 'center',
      // }
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
            item.time_stamp = item.time_stamp.substring(0, item.time_stamp.indexOf('+') - 1);
            // item.current_hash = Base64.decode(item.current_hash);
            // item.prev_hash = Base64.decode(item.prev_hash);
            // item.data_hash = Base64.decode(item.data_hash);
            dataSource.push(item);
          });
          const sliceArray = dataSource.slice(0, 5);

          console.log('dataSource', dataSource);
          this.setState({
            dataSource,
            storeDataSource: sliceArray
          })
        }
      },
      e => console.log('getBlockInfos-error', e.toString())
    )
  };

  handleClickShow = fileHash => {
    console.log('fileHash', fileHash);
    this.setState({
      showModal: true
    })
  };

  handleOnOk = () => {
    this.setState({
      showModal: false,
    })
  };

  handleCancel = () => {
    this.setState({
      showModal: false,
    })
  };

  showAllBlocks = () => {
    this.props.showAllBlocks(false)
  }

  render() {
    const { storeDataSource, dataSource } = this.state;

    return (
      <div>
        <Row style={{ marginTop: 10 }}>
          <Col span={18} offset={3}>
            <Card
              title={<Title level={4}><Icon type='mail' />&nbsp;区块信息</Title>}
              extra={<CheckableTag checked onChange={this.showAllBlocks}>查看全部</CheckableTag>}
            >
              <Table
                dataSource={storeDataSource}
                columns={this.columns}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}


