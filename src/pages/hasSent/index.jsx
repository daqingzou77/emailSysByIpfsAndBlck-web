import React, { Component } from 'react';
import { Table, Icon, Modal } from 'antd';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import {
  querySent
} from '@/services/hasSent';

@config({
  path: '/hasSent',
  title: { text: '已发送', icon: 'to-top' },
  keepAlive: false,
})
export default class HasSent extends Component {
  state = {
    roleId: void 0,
    visible: false,
    dataSource: [],     // 表格数据
    id: null,
  };

  columns = [
    { title: '收件人', dataIndex: 'receiver', key:'receiver', align: 'center' },
    { title: '文件hash', dataIndex: 'timestamp', key: 'timestamp', align: 'center' },
    { title: '时间戳', dataIndex: 'c_index', key: 'c_index', align: 'center' },
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

  render() {
    const {
      dataSource,
    } = this.state;
    return (
      <PageContent>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={true}
        />
      </PageContent>
    );
  }
}
