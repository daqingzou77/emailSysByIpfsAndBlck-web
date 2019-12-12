import React, { Component } from 'react';
import { Table, Icon, Modal, Descriptions } from 'antd';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import {
  querySent
} from '@/services/hasSent';
import './index.less';

@config({
  path: '/hasSent',
  title: { text: '已发送', icon: 'to-top' },
  keepAlive: false,
})
export default class HasSent extends Component {
  state = {
    roleId: void 0,
    visible: false,
    hasSentDetail: {},
    dataSource: [],     // 表格数据
    id: null,
  };

  columns = [
    { title: '收件人', dataIndex: 'receiver', key:'receiver', align: 'center' },
    { title: '主题', dataIndex: 'title', key: 'title', align: 'center' },
    { title: '发送时间', dataIndex: 'timestamp', key: 'timestamp', align: 'center' },
  ];

 
  componentDidMount() {
    this.querySent();
  }

  querySent = () => {
    querySent({}, data=> {
      console.log('querySent-data', data);
      if (data.success) {
        const sendArray = JSON.parse(data.message);
        const dataSource = [];
        sendArray.map(item => {
          item.value.timestamp = item.value.timestamp.replace('~', ' ');
          dataSource.push(item.value)
        })
        this.setState({
          dataSource,
        })
      }
    },
    e => console.log('querySent-error', e.toString())
    )
  };

  handleClickRow = record => {
    if (record) {
      this.setState({
        visible: true,
        hasSentDetail: record
      })
    }
  };

  handleOnOk = () => {
    this.setState({
      visible: false
    })
  };

  handleCancel = () => {
    this.setState({
      visible: false
    })
  };

  render() {
    const {
      dataSource,
      visible,
      hasSentDetail
    } = this.state;
    return (
      <PageContent>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={true}
          onRow={record => {
            return {
              onClick: () => this.handleClickRow(record)
            }
          }}
        />
         <Modal
          styleName="modalCotent"
          title='文件详情'
          visible={visible}
          okText='确认'
          cancelText='取消'
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
        >
          <Descriptions bordered>
            {hasSentDetail.sender ? <Descriptions.Item label="发送人" span={6}>{hasSentDetail.sender}</Descriptions.Item> : null}
            {hasSentDetail.receiver ? <Descriptions.Item label="收件人" span={6}>{hasSentDetail.receiver}</Descriptions.Item> : null}
            {hasSentDetail.title ? <Descriptions.Item label="主题" span={6}>{hasSentDetail.title}</Descriptions.Item> : null}
            {hasSentDetail.text ? <Descriptions.Item label="正文" span={6}>{hasSentDetail.text}</Descriptions.Item> : null}
            {hasSentDetail.tx_id ? <Descriptions.Item label="公文哈希" span={6}>{hasSentDetail.tx_id}</Descriptions.Item>: null}
            {hasSentDetail.file_name ? <Descriptions.Item label="附件名" span={6}>{hasSentDetail.file_name}</Descriptions.Item>: null}
            {hasSentDetail.cid ? <Descriptions.Item label="cid" span={6}><a style={{ color: '#029EF5' }}>{hasSentDetail.cid}</a></Descriptions.Item> : null}
          </Descriptions>
        </Modal>
      </PageContent> 
    );
  }
}
