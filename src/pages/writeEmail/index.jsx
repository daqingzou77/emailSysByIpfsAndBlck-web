import React, { Component } from 'react';
import { Form, Icon, Card, Row, Col, List, Avatar } from 'antd';
import {
  FormRow,
  FormElement,
  ToolBar,
} from "@/library/components";
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

                  field='name'
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
                  <Icon type='link' /> 添加附件
              <Icon type='picture' style={{ marginLeft: 10 }} /> 上传图片
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
                { type: 'primary', text: '清空邮件' }
              ]}
            />
            <ToolBar
              style={{ float: 'left', marginLeft: 10 }}
              items={[
                { type: 'primary', text: '发送邮件' }
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
