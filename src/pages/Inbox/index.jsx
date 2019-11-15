import React, {Component} from 'react';
import {Table, Modal} from 'antd';
import PageContent from '@/layouts/page-content';
import {Operator} from "@/library/components";
import config from '@/commons/config-hoc';
import InboxDetail from './inboxDetail';


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
        {title: '寄件人', dataIndex: 'name', key: 'name'},
        {title: '邮件主题', dataIndex: 'description', key: 'description', align: 'center'},
        {
            title: '操作', dataIndex: 'operator', key: 'operator', align: 'center',
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
    }

    handleSearch = () => {
        const pageNum = 1;
        const pageSize = 10;
        const dataSource = [];
        for (let i = 0; i < pageSize; i++) {
            const id = pageSize * (pageNum - 1) + i + 1;
            dataSource.push({id: `${id}`, name: `用户${id}`, description: `主题${id}`});
        }

        this.setState({dataSource});
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
            pagination={false}
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
