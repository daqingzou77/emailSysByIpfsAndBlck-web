import React, {Component} from 'react';
import {Table, Modal} from 'antd';
import PageContent from '@/layouts/page-content';
import {Operator} from "@/library/components";
import config from '@/commons/config-hoc';
import InboxDetail from './inboxDetail';
import moment from 'moment';
import {
  getMailList,
  findMailById,
  deleteMailByuser,
} from '../../services/inbox';


@config({
  path: '/inbox',
})
export default class RoleList extends Component {
    state = {
     roleId: void 0,
     visible: false,
     dataSource: [],     // 表格数据
     id: null,
    };

    columns = [
        {title: '寄件人', dataIndex: 'sender', key: 'sender', align: 'center'},
        {title: '邮件主题', dataIndex: 'mailTheme', key: 'mailTheme', align: 'center'},
        {title: '邮件时间', dataIndex: 'mailTime', key: 'mailTime', align: 'center'},
        {
          title: '操作',
          align: 'center',
          render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '查看',
                        onClick: () => this.handleEdit(id),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleDelete(id),
                        },
                    }
                ];

                return <Operator items={items}/>
          },
        }
    ];

    componentDidMount() {
        this.handleSearch();
        this.getMailList();
    }

    // mock数据
    handleSearch = () => {
        const pageNum = 1;
        const pageSize = 10;
        const dataSource = [];
        for (let i = 0; i < pageSize; i++) {
            const id = pageSize * (pageNum - 1) + i + 1;
            dataSource.push({id: `${id}`, sender: `用户${id}`, mailTheme: `主题${id}`, mailTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')});
        }

        this.setState({dataSource});
    };
   
    // 获取收件箱数据
    getMailList = () => {
      getMailList({}, ({ data }) => {
        console.log('getMailList-data', data);
      },
      e => console.log('getMailList-error', e.toString()),
      )  
    };
   
    // 条件查询邮件详情
    findMailById = () => {
      findMailById({}, ({ data }) => {
        console.log('findMailById-data', data);
      },
      e => console.log('findMailById-error', e.toString()),
      )
    };

    // 删除邮件
    deleteMailByuser = () => {
      deleteMailByuser({}, ({ data }) => {
        console.log('deleteMailByuser-data', data);
      },
      e => console.log('deleteMailByuser-error', e.toString()),
      )
    };

    handleAdd = () => {
        this.setState({roleId: void 0, visible: true});
    };

    handleDelete = (id) => {
        // TODO
    };

    handleEdit = (roleId) => {
        this.setState({roleId, visible: true});
    };

    render() {
      const {
        dataSource,
        visible,
        id,
        roleId,
        } = this.state;
      console.log('render roles');
      return (
        <PageContent>
          <Table
            columns={this.columns}
            dataSource={dataSource}
            rowKey="id"
            pagination={true}
          />
          <InboxDetail 
            visible={visible}
            id={id}
            onOk={() => this.setState({visible: false}, this.handleSearch)}
            onCancel={() => this.setState({visible: false})}
          />
        </PageContent>
        );
    }
}
