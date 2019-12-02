import React, { Component } from 'react';
import { Table, Typography, Modal, Form, Row, Col, Card, Icon } from 'antd';
import {
  FormRow,
  FormElement,
} from "@/library/components";
import {
  getNewTrasactions,
  getEmailDeatilByTxId
} from '@/services/home';



const { Title } = Typography;

@Form.create()
export default class RecentEmails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      showModal: false,
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
          const message = JSON.parse(data.message);
          console.log('message', message)
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
    const { dataSource, showModal } = this.state;
    const { form } = this.props;
    const formElements = {
      form,
    };
    const formElement = {
      form,
      style: { paddingLeft: 10 }
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
          <Form>
            <FormRow>
              <FormElement
                label='寄件人'
                field='sender'
                {...formElements}
              >
              </FormElement>
            </FormRow>
            <FormRow>
              <FormElement
                label='主题'
                field="title"
                {...formElement}
              >
              </FormElement>
            </FormRow>
            <FormRow>
              <FormElement
                {...formElement}
                label='正文'
                rows={12}
                type='textarea'
                field='content'
              />
            </FormRow>
          </Form>
        </Modal>
      </div>
    );
  }
}


