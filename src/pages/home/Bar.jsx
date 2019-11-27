import React, { Component } from 'react';
import { Table, Typography, Modal, Form } from 'antd';
import {
  FormRow,
  FormElement,
  ToolBar,
} from "@/library/components";
import moment from 'moment';

const { Title } = Typography;

@Form.create()
export default class Bar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      showModal: false,
    };
    this.columns = [{
      title: '寄件人',
      dataIndex: 'sender',
      key: 'sender',
      align: 'center',
    }, {
      title: '文件主题',
      dataIndex: 'theme',
      key: 'theme',
      align: 'center',
    }, {
      title: '邮件时间',
      dataIndex: 'mailTime',
      key: 'mailTime',
      align: 'center',
    }, {
      title: '邮件哈希',
      dataIndex: 'mailHash',
      key: 'mailHash',
      align: 'center',
      render: record => {
        return (
          <a onClick={() => this.handleClickShow(record.mailHash)}>xsfwefadfhiuheuqf2312cewew</a>
        )
    }, 
    }, {
      title: 'CID',
      dataIndex: 'CID',
      key: 'CID',
      align: 'center',
      // render: record => {
      //   return (
      //     <a onClick={() => this.handleClickShow(record.CID)}>xsfwefadfhiuheuqf2312cewew</a>
      //   )
      // }
    }]
  }

  componentDidMount() {
    this.getDataSouce();
  }

  getDataSouce = () => {
    const dataArray = [];
    for (let i = 0; i < 10; i++) {
      const json = Object.assign({}, { sender: 'daqing' }, { theme: '你好吗' }, { mailTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss') }, { mailHash: 'wrwrewr3r3' })
      dataArray.push(json)
    }
    this.setState({
      dataSource: dataArray,
    })
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
        <Title level={4}>最新邮件</Title>
        <Table
          dataSource={dataSource}
          columns={this.columns}
        />
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


