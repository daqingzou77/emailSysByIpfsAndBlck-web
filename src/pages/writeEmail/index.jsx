import React, { Component } from 'react';
import { Form, Icon, Card, Row, Col, List, Avatar, Upload, message, Modal } from 'antd';
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

@config({
  path: '/writeEmail',
  title: { text: '写邮件', icon: 'edit' },
  keepAlive: false,
})

@Form.create()
export default class writeEmail extends Component {

  constructor() {
    super();
    this.state = {
      content: '',
      loading: false,
      hash: '',
      file_name: '',
      fileList: [],
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
      const messageArray = JSON.parse(data.message);
      console.log('messageArray', messageArray);
      const dataArray =[];
      messageArray.map(item => {
        const { user_name } = item.value; 
        const items = Object.assign({}, {user_name})
        dataArray.push(items)
      })
      this.setState({
        dataSource: dataArray,
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

 // 上传文件回调
 handleOnChange = info => {
    const { file } = info;
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    console.log('fileList', fileList);
    if (file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (file.status ==='done') {
      Modal.success({
        title: `${file.name}上传成功，文件哈希为：`,
        content: file.response,
      })
      this.setState({
        hash: file.response,
        file_name: file.name
      })
    } else if (file.status === 'error') {
      Modal.error({
        title: '上传失败',
        content: '文件上传IPFS系统失败',
      })
    }
    this.setState({
      fileList
    })
 }
  // 提交邮件
  handleOnSubmit = e => {
    const { hash, file_name } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { receiver, title, text } = values;
        this.setState({ loading: true })
        setTimeout(()=> {
          submitEmail({
            receiver,
            title,
            cid: hash,
            text,
            file_name,
          },
            data => {
              console.log('submitEmail-data', data);
              if (data.success) {
                Modal.success({
                  title: '发送成功, 链上Hash值:',
                  content: `${JSON.parse(data.message).TxID}`,
                })
              } else {
                Modal.error({
                  title: '发送失败',
                  content: data.message,
                })
              }
              this.props.form.resetFields();
              this.setState({
                file: '',
                fileList: [],
                loading: false,
              })
            },
            e => console.log('submitEmail-error', e.toString()),
          )
        }, 1000)
      }
    })
  };

  // 通讯录选择成员

  handleOnClick = userName => {
    this.props.form.setFieldsValue({ receiver: userName });
  };

  render() {
    const { form } = this.props;
    const { dataSource, fileList, loading } = this.state;
    const props = {
      action: '/add',
      method: 'POST',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.handleOnChange
    }
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
                  required={true}
                />
              </FormRow>
              <FormRow>
                <FormElement
                  {...formElements}
                  label='主题'
                  field='title'
                  required={true}
                />
              </FormRow>
              <FormRow>
                <FormElement
                  style={{ marginLeft: 60 }}
                >
                  <Upload
                    fileList={fileList}
                    {...props}
                  >
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
                  required={true}
                />
              </FormRow>
            </Form>
            <ToolBar
              onClick={this.handleOnSubmit}
              style={{ float: 'left', marginLeft: 60 }}
              items={[
                { type: 'primary', text: '发送文件', loading: loading },
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
              <div style={{ height: 300, overflow: 'auto' }}>
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
