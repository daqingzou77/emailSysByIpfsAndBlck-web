import React, { Component } from 'react';
import { Table, Icon, Modal } from 'antd';
import PageContent from '@/layouts/page-content';
import { Operator } from "@/library/components";
import config from '@/commons/config-hoc';
import InboxDetail from './inboxDetail';
import {
  getReceivingMails,
  getRecivedMails,
  readMail,
} from '../../services/inbox';


@config({
  path: '/inbox',
  title: { text: '收件箱', icon: 'profile' },
  keepAlive: false,
})
export default class InBox extends Component {
  state = {
    roleId: void 0,
    visible: false,
    dataSource: [],     // 表格数据
    id: null,
  };

  columns = [
    { title: '文件读取状态', dataIndex: 'status', key: 'status', align: 'center', 
      render: (value, record) => {
        return   <Icon type='alert' style={{ color: record.noRead ?  'red': '' }} /> 
      }   
    },
    { title: '寄件人', dataIndex: 'sender', key: 'sender', align: 'center' },
    { title: '时间戳', dataIndex: 'timestamp', key: 'timestamp', align: 'center' },
    { title: 'IPFS文件哈希', dataIndex: 'c_index', key: 'c_inedx', align: 'center' },
    {
      title: '操作',
      align: 'center',
      render: (value, record) => {
        const items = [
          {
            label: '查看文件',
            onClick: () => this.handleOnRead(record.timestamp),
          },
        ];

        return record.noRead ? <Operator items={items} /> : null
      },
    }
  ];

  componentDidMount() {
    this.getReceivingMails()
  }

  // 获取未读文件列表
  getReceivingMails = () => {
    getReceivingMails({}, data => {
      console.log('getReceivingMails-data', data);
      if (data.success) {
        const parseArray1 = JSON.parse(data.message);
        const receivingArray = [];
        parseArray1.map(item => {
          item.value.noRead = true;
          item.value.timestamp = item.value.timestamp.replace('~', ' ');
          receivingArray.push(item.value);
        })
        const mailArray = [].concat(receivingArray ? receivingArray : []);
           // 获取已读文件列表
           getRecivedMails({}, datas => {
            if (datas.success) {
              const parseArray2 = JSON.parse(datas.message);
              const receivedArray = [];
              parseArray2.map(item => {
                item.value.timestamp = item.value.timestamp.replace('~', ' ');
                receivedArray.push(item.value)
              })
              const allMailArray = mailArray.concat(receivedArray ? receivedArray : []);
              this.setState({
                dataSource: allMailArray
              })
            }
          },
            e => console.log('getRecivedMails-error', e.toString()),
          )
      }
    },
      e => console.log('getReceivingMails-error', e.toString()),
    )
  };

  // 查看未读文件
  handleOnRead = timestamp => {
    const newTime = timestamp.replace(' ', '~');
    readMail({
      timestamp:  newTime,
    }, data => {
       console.log('handleOnRead-data', data);
       if (data) {
         if (data.success) {
          Modal.success({
            title: '邮件详情',
            content: JSON.parse(data.message).TxID,
            onOk: () =>  console.log('onOk'),
           })
         } else {
          Modal.error({
            title: '操作失败',
            content: data.message,
            onOk: () =>  console.log('onOk'),
           })
         }
         this.getReceivingMails();
       }
    }, e => console.log('handleOnRead-error', e.toString),
    )
  };

  handleClickRow = record => {
    console.log('record', record);
    const { timestamp } = record;
    if (!record.noRead) {
      Modal.error({
        title: '操作失败',
        content: '该文件已读取',
      });
      return;
    }
    this.handleOnRead(timestamp);
  }

  render() {
    const {
      dataSource,
      visible,
      id,
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
        <InboxDetail
          visible={visible}
          id={id}
          onOk={() => this.setState({ visible: false }, this.handleSearch)}
          onCancel={() => this.setState({ visible: false })}
        />
      </PageContent>
    );
  }
}
