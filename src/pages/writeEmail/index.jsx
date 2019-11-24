import React, { Component } from 'react';
import { Form, Icon, Card, Row, Col, List, Avatar, Upload, message } from 'antd';
import {
  FormRow,
  FormElement,
  ToolBar,
} from "@/library/components";
import {
  getPost
} from '../../services/writeEmail';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';

const dataSource = [{
  title: '985162',
}, {
  title: '无心'
}, {
  title: 'ymlin'
}, {
  title: 'hexm'
}, {
  title: '631798393'
}]


const uploadProps = {
  name: 'file',
  // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  action: 'http://localhost:5000/fileupload',
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
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

@config({
  path: '/writeEmail',
})

@Form.create()
export default class writeEmail extends Component {

  constructor() {
    super();
    this.state = {
      content: ''
    };
  }

  handleChange = value => {
    this.setState({
      content: value,
    })
  }

  render() {
    const { form } = this.props;
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
            <Form>
              <FormRow>
                <FormElement
                  {...formElement}
                  label='收件人'
                  field='Recipient'
                />
              </FormRow>
              <FormRow>
                <FormElement
                  {...formElements}
                  label='主题'
                  field='mailTheme'
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
                  field='content'
                />
              </FormRow>
            </Form>
            <ToolBar
              style={{ float: 'left', marginLeft: 60 }}
              items={[
                { type: 'primary', text: '发送邮件' }
              ]}
            />
            <ToolBar
              style={{ float: 'left', marginLeft: 10 }}
              onClick={()=>{ this.props.form.resetFields()}}
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
              <List
                itemLayout
                dataSource={dataSource}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={item.title}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </PageContent>
    )
  }
}
