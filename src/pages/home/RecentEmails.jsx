import React, { Component } from 'react';
import { Table, Typography, Modal, Form, Row, Col, Card, Icon, Descriptions } from 'antd';
import {
  getNewTrasactions,
  getEmailDeatilByTxId
} from '@/services/home';
import { Base64 } from '@/utils/tool';



const { Title } = Typography;

@Form.create()
export default class RecentEmails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      showModal: false,
      writesArray: [],
    };
    this.columns = [{
      title: '所在区块高度',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
    }, {
      title: '存证哈希',
      dataIndex: 'tx_id',
      key: 'tx_id',
      align: 'center',
      render: (value, record) => {
        const that = this;
        return (
          <a style={{ color: '#029EF5' }} onClick={() => that.handleOnClick(record.tx_id)}>{record.tx_id}</a>
        )
      }
    }, {
      title: '时间',
      dataIndex: 'time_stamp',
      key: 'time_stamp',
      align: 'center'
    }
    ]
  }

  componentDidMount() {
    this.getDataSouce();
  }

  getDataSouce = () => {
    getNewTrasactions(
      {
        number: 5  //查询最新的8笔交易
      },
      data => {
        console.log('getNewTrasactions-data', data);
        if (data.success) {
          const message = JSON.parse(data.message);
          console.log('message', data.message);
          message.txID_list.map(item => {
            item.time_stamp = item.time_stamp.substring(0, item.time_stamp.indexOf('+') - 1);
          })
          this.setState({
            dataSource: message.txID_list,
          })
          console.log('message', message)
        }
      },
      e => console.log('getNewTrasactions-error', e.toString())
    )
  };

  handleClickShow = fileHash => {
    console.log('fileHash', fileHash);
    this.setState({
      showModal: true
    })
  };

  handleOnClick = txId => {
    getEmailDeatilByTxId({
      tx_id: txId
    },
      data => {
        console.log('getDetail-data', data);
        if (data.success) {
          const datas = JSON.parse(data.message)
          this.setState({
            writesArray: datas.writes,
            showModal: true
          })
        }
      },
      e => console.log('getDetail-error', e.toString()),

    );
  }

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

  render() {
    const { dataSource, showModal, writesArray } = this.state;
    let sentKey, sentValue, receiveKey, receiveValue = '';
    let sender, senderTimestamp, senderC_index, receiver, receiverTimestamp, receiverC_index =''; 
    if (writesArray.length > 0) {
      [sentKey, sentValue, receiveKey, receiveValue] = [writesArray[0].key.replace('~', ' '), Base64.decode(writesArray[0].value), writesArray[1].key.replace('~', ' '), Base64.decode(writesArray[1].value)];
      sentValue = JSON.parse(sentValue);
      receiveValue = JSON.parse(receiveValue);
      [receiver, receiverTimestamp, receiverC_index] = [sentValue.receiver, sentValue.timestamp.replace('~', ' '), sentValue.c_index];
      [sender, senderTimestamp, senderC_index] = [receiveValue.sender, receiveValue.timestamp.replace('~', ' '), receiveValue.c_index];
    }

    return (
      <div>
        <Row style={{ marginTop: 10 }}>
          <Col span={18} offset={3}>
            <Card
              title={<Title level={4}><Icon type='mail' />&nbsp;最新交易</Title>}
            >
              <Table
                dataSource={dataSource}
                columns={this.columns}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
        <Modal
          title="邮件详情"
          visible={showModal}
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
        >
          <Descriptions title="写集" bordered>
            <Descriptions.Item label="key" span={4}>{sentKey}</Descriptions.Item>
            <Descriptions.Item label="接收人" span={4}>{receiver}</Descriptions.Item>
            <Descriptions.Item label="时间戳" span={4}>{receiverTimestamp}</Descriptions.Item>
            <Descriptions.Item label="文件哈希" span={4}>{receiverC_index}</Descriptions.Item>
          </Descriptions>
          <Descriptions title="读集" bordered>
            <Descriptions.Item label="key" span={4}>{receiveKey}</Descriptions.Item>
            <Descriptions.Item label="发送人" span={4}>{sender}</Descriptions.Item>
            <Descriptions.Item label="时间戳" span={4}>{senderTimestamp}</Descriptions.Item>
            <Descriptions.Item label="文件哈希" span={4}>{senderC_index}</Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    );
  }
}


