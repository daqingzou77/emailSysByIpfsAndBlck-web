import React, { Component } from 'react';
import { Form, Icon, Card, Row, Col, List, Avatar, Upload, message } from 'antd';
import {
  FormRow,
  FormElement,
  ToolBar,
} from "@/library/components";
import {
  submitEmail,
  getAddressBook
} from '../../services/writeEmail';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import {
  getLoginUser
} from '@/commons/index';
import InfiniteScroll from 'react-infinite-scroller';

// 上传文件配置
const uploadProps = {
  name: 'file',
  action: '/add',
  method: 'POST',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    console.log('info', info);
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  },
};

@config({
  path: '/writeEmail',
  title: {text: '写邮件', icon: 'edit'},
  keepAlive: false,
})

@Form.create()
export default class writeEmail extends Component {

  constructor() {
    super();
    this.state = {
      content: '',
      hash: '',
      dataSource: [],
    };
  }

  componentDidMount() {
    this.getAddressBook();
  };


  // 获取通信录人员
  getAddressBook = () => {
    let userName = '';
    if (getLoginUser) {
      userName = getLoginUser.userName;
    }
    getAddressBook({
      userName,
    }, data => {
      console.log('getAddressBook-data', data);
      const { contacts_list } = JSON.parse(data.message);
      this.setState({
        dataSource: contacts_list,
      })
    },
      e => console.log('getAddressBook-error', e.toString()),
    )
  }

  handleChange = value => {
    this.setState({
      content: value,
    })
  }

  // 提交邮件
  handleOnSubmit = e => {
    const { hash } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('hash', hash);
        const { receiver, title, text } = values;
        submitEmail({
          receiver,
          title,
          text 
        },
          data => {
            console.log('submitEmail-data', data);
            if (data.success) {
              message.success('文件发送成功');
            } else {
              message.warning('文件发送失败');
            }
          },
          e => console.log('submitEmail-error', e.toString()),
        )
      }
    })
  };

  // 通讯录选择成员

  handleOnClick = userName => {
    this.props.form.setFieldsValue({ receiver: userName });
  };

  render() {
    const { form } = this.props;
    const { dataSource } = this.state;
    const formElements = {
      form,
      width: '100%',
      style: { paddingLeft: 16 },
    };
    const formElement = {
      form,
      width: '100%',
      style: { paddingLeft: 5 }
    }

    return (
      <PageContent>
        <Row>
          <Col span={18} >
            <Form autoComplete='off'>
              <FormRow>
                <FormElement
                  {...formElement}
                  label='收件人'
                  field='receiver'
                />
              </FormRow>
              <FormRow>
                <FormElement
                  {...formElements}
                  label='主题'
                  field='title'
                />
              </FormRow>
              <FormRow>
                <FormElement
                  style={{ marginLeft: 60 }}
                >
                  <Upload {...uploadProps}>
                    <Icon type='upload' /> 添加附件至IPFS系统
                  </Upload>
                </FormElement>
              </FormRow>
              <FormRow>
                <FormElement
                  {...formElements}
                  label='正文'
                  rows={12}
                  type='textarea'
                  field='text'
                />
              </FormRow>
            </Form>
            <ToolBar
              onClick={this.handleOnSubmit}
              style={{ float: 'left', marginLeft: 60 }}
              items={[
                { type: 'primary', text: '发送文件' }
              ]}
            />
            <ToolBar
              style={{ float: 'left', marginLeft: 10 }}
              onClick={() => { this.props.form.resetFields() }}
              items={[
                { type: '', text: '重置' }
              ]}
            />
          </Col>
          <Col span={5} offset={1} >
            <Card
              title="通讯录"
              style={{ height: 400, marginTop: 6, marginRight: 16 }}
              hoverable={true}
            >
              <div style={{ height: 300, overflow: 'auto'}}>
              <InfiniteScroll>
                <List
                  itemLayout
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        onClick={() => this.handleOnClick(item.user_name)}
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={item.user_name}
                      />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
              </div>

            </Card>
          </Col>
        </Row>
      </PageContent>
    )
  }
}
