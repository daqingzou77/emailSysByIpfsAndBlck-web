import React, { Component } from 'react';
import { Table, Icon, Modal, Descriptions, notification } from 'antd';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import {
  getReceivingMails,
  getRecivedMails,
  readMail,
} from '../../services/inbox';
import { getAnnex } from '../../services/annex'; 
import { getEmailDeatilByTxId } from '../../services/home';
import { Base64 } from '@/utils/tool';
import {
  Tag,
  Popconfirm,
} from 'antd';
import './index.less';


@config({
  path: '/inbox',
  title: { text: '收件箱', icon: 'profile' },
  keepAlive: false,
})
export default class InBox extends Component {
  state = {
    roleId: void 0,
    ModalShow: false,
    visible: false,
    writesArray: [],
    dataSource: [],     // 表格数据
    id: null,
    inboxDetail: {
      cid: "",
      file_name: "",
      sender: "",
      text: "",
      timestamp: "",
      title: "",
      tx_id: "",
    },
  };

  columns = [
    {
      title: '文件读取状态', dataIndex: 'status', key: 'status', align: 'center',
      render: (value, record) => {
        return <Icon type='file' style={{ color: record.noRead ? 'red' : '' }} />
      }
    },
    { title: '寄件人', dataIndex: 'sender', key: 'sender', align: 'center' },
    {
      title: '主题', dataIndex: 'title', key: 'title', align: 'center',
      render: (value, record) => {
        return (<a onClick={() => this.handleClickRow(record)}>{record.title}</a>)
      }
    },
    {
      title: '交易哈希', dataIndex: 'tx_id', key: 'tx_id', align: 'center',
      render: (value, record) => {
        return (<a style={{ color: '#029EF5' }} onClick={() => this.handleClickTxId(record.tx_id)}>{record.tx_id}</a>)
      }
    },
    { title: '收件时间', dataIndex: 'timestamp', key: 'timestamp', align: 'center' },
    {
      title: '操作', dataIndex: 'operator', key: 'operator', align: 'center',
      render: (value, record) => {
        const { timestamp, noRead } = record;
        const text = '确认签收该公文？'
        return (
          <Popconfirm placement="top" title={text} onConfirm={() => this.handleOnRead(noRead, timestamp)} okText="确认" cancelText="取消">
            <Tag>签收公文</Tag>
          </Popconfirm>
        )
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
        const reverseReceivingArray = receivingArray.reverse();
        const mailArray = [].concat(reverseReceivingArray ? reverseReceivingArray : []);
        // 获取已读文件列表
        getRecivedMails({}, datas => {
          if (datas.success) {
            const parseArray2 = JSON.parse(datas.message);
            const receivedArray = [];
            parseArray2.map(item => {
              item.value.timestamp = item.value.timestamp.replace('~', ' ');
              receivedArray.push(item.value)
            })
            const reverseArray = receivedArray.reverse();
            const allMailArray = mailArray.concat(reverseArray ? reverseArray : []);
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
  handleOnRead = (noRead, timestamp) => {
    setTimeout(() => {
      if (!noRead) {
        notification.warning({
          message: '操作提示',
          description: '该文件已签收',
        })
        return;
      }
      const newTime = timestamp.replace(' ', '~');
      readMail({
        timestamp: newTime,
      }, data => {
        console.log('handleOnRead-data', data);
        if (data) {
          if (data.success) {
            notification.success({
              message: '操作提示',
              description: '文件签收成功',
            })
          } else {
            Modal.error({
              title: '操作失败',
              content: data.message,
              onOk: () => console.log('onOk'),
            })
          }
          this.getReceivingMails();
        }
      }, e => console.log('handleOnRead-error', e.toString),
      )
    }, 1000)
  };

  // 查看交易哈希详情
  handleClickTxId = txId => {
    getEmailDeatilByTxId({
      tx_id: txId
    },
      data => {
        console.log('getDetail-data', data);
        if (data.success) {
          const datas = JSON.parse(data.message)
          this.setState({
            writesArray: datas.writes,
            visible: true
          })
        }
      },
      e => console.log('getDetail-error', e.toString()),
    );
  }

  handleClickRow = record => {
    if (record) {
      this.setState({
        ModalShow: true,
        inboxDetail: record
      })
    }
  }

  handleOnOk = () => {
    this.setState({
      ModalShow: false
    });
  };

  handleCancel = () => {
    this.setState({
      ModalShow: false
    });
  };

  handleModalOk = () => {
    this.setState({
      visible: false
    });
  };

  handleModalCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleClick = (cid, filename) => {
    this.setState({
      ModalShow: false,
    });
    getAnnex(cid, filename);
  };

  handleOnAnnexContent = (cid, filename) => {
    this.setState({
      visible: false,
    })
    getAnnex(cid, filename);
  }

  render() {
    const {
      dataSource,
      inboxDetail,
      ModalShow,
      visible,
      writesArray,
    } = this.state;
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
      let filename = '';
      keyStore.map((item, index) => {
        if (item === 'file_name') {
          filename = valueStore[index];
        }
      })
      mailDetail = valueStore.map((item, index) => {
        if (keyStore[index] === 'cid') {
          return item ? <Descriptions.Item label={keyStore[index]} span={span}><a style={{ color: '#029EF5' }} onClick={() => this.handleOnAnnexContent(item, filename)}>{item}</a></Descriptions.Item> : null
        }
        return item ? <Descriptions.Item label={keyStore[index]} span={span}>{item}</Descriptions.Item> : null
      })
    }
    return (
      <PageContent>
        <Table
          columns={this.columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={true}
        />
        <Modal
          styleName="modalCotent"
          title='公文详情'
          visible={ModalShow}
          okText='确认'
          cancelText='取消'
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
        >
          <Descriptions bordered>
            {inboxDetail.sender ? <Descriptions.Item label="发送人" span={6}>{inboxDetail.sender}</Descriptions.Item> : null}
            {inboxDetail.title ? <Descriptions.Item label="主题" span={6}>{inboxDetail.title}</Descriptions.Item> : null}
            {inboxDetail.tx_id ? <Descriptions.Item label="公文哈希" span={6}>{inboxDetail.tx_id}</Descriptions.Item> : null}
            {inboxDetail.file_name ? <Descriptions.Item label="附件名" span={6}>{inboxDetail.file_name}</Descriptions.Item> : null}
            {inboxDetail.cid ? <Descriptions.Item label="cid" span={6}><a style={{ color: '#029EF5' }} onClick={() => this.handleClick(inboxDetail.cid, inboxDetail.file_name)}>{inboxDetail.cid}</a></Descriptions.Item> : null}
          </Descriptions>
        </Modal>

        <Modal
          styleName="modalCotent"
          title="交易详情"
          visible={visible}
          okText="确定"
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <Descriptions bordered>
            {mailDetail}
          </Descriptions>
        </Modal>
      </PageContent>
    );
  }
}