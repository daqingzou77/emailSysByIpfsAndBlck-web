import React, { Component } from 'react';
import { Table, Typography, Modal, Form, Row, Col, Card, Icon, Descriptions } from 'antd';
import {
  getNewTrasactions,
  getEmailDeatilByTxId
} from '@/services/home';
import { Base64 } from '@/utils/tool';
import { withReducer } from 'recompose';
import './style.less';


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
    console.log('writesArray', writesArray);
    let mailDetail = '';
    if (writesArray.length > 0) {
      const mailDetails = JSON.parse(Base64.decode(writesArray[0].value));
      const keyStore = [];
      const valueStore = [];
      for (let i in mailDetails) {
        keyStore.push(i);
        valueStore.push(mailDetails[i])
      }
      const span = keyStore.length;
      mailDetail = valueStore.map((item, index) => {
        return <Descriptions.Item label={keyStore[index]} span={span}>{item}</Descriptions.Item>
      })
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
          styleName="modalShow"
          title="邮件详情"
          visible={showModal}
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
        >
          <Descriptions bordered> 
            {mailDetail}
          </Descriptions> 
        </Modal>
      </div>
    );
  }
}


