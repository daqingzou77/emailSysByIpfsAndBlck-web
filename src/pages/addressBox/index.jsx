import React, {Component, Fragment} from 'react';
import {Button, Form, Table, message, Modal,Upload, Icon} from 'antd';
import PageContent from '@/layouts/page-content';
import {
    QueryBar,
    Pagination,
    Operator,
    FormRow,
    FormElement,
} from "@/library/components";
import config from '@/commons/config-hoc';
import RowEdit from './RoleEdit';
import {
    getAddressBooks,
    deletesAddressBookByName,
    postAddressBook,
} from '../../services/addressbook'
import {
    getLoginUser
} from '@/commons/index';


@config({
    path: '/list',
    title: {text: '通讯录', icon: 'usergroup-add'},
    keepAlive: false,
})
@Form.create()

export default class addressBook extends Component {
    state = {
        dataSource: [],     // 表格数据
        total: 0,           // 分页中条数
        pageSize: 10,       // 分页每页显示条数
        pageNum: 1,         // 分页当前页
        collapsed: true,    // 是否收起
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
        loading: false,
    };

    columns = [
        {title: '姓名', dataIndex: 'user_name', width: 100, align: 'center'},
        {title: '部门', dataIndex: 'depart', width: 100, align:'center'},
        {title: '电话', dataIndex: 'phone', width: 100, align: 'center'},
        {title: '时间戳', dataIndex: 'Timestamp', width: 100, align: 'center'},
        {
            title: '操作', dataIndex: 'operator', width: 100, align: 'center',
            render: (value, record) => {
                const {user_name, Timestamp} = record;
                const items = [
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${user_name}"?`,
                            onConfirm: () => this.deletesAddressBookByName(user_name, Timestamp),
                        },
                    }
                ];

                return <Operator items={items}/>
            },
        }
    ];

    componentDidMount() {
        this.getAddressBooks();
    }
    
    // 获取通讯录信息
    getAddressBooks = () => {
        let userName = '';
        const loginUser = getLoginUser();
        if (loginUser) {
           userName = loginUser.userName;
        }
        getAddressBooks({
           userName,
        }, data  => {
            console.log('data', data);
            if (data !== undefined) {
               const messageArray = JSON.parse(data.message);
               const dataArray = [];
               messageArray.map(item => {
                const { user_name, depart, phone, Timestamp } = item.value;
                const newTime = Timestamp.replace('~', ' ');
                const items = Object.assign({}, {user_name, depart, phone, Timestamp: newTime});
                dataArray.push(items)
               })
               this.setState({
                  dataSource: dataArray,
               })
            }
        },
          e => console.log('getAddressBooks-error', e.toString()),
        )
    };
    
    // 删除人员
    deletesAddressBookByName = (userName, timeStamp) => {
        const newTime = timeStamp.replace(' ', '~');
        deletesAddressBookByName({
          userName,
          index: newTime
        }, data => {
            console.log('deletesAddressBookByName-data', data);
            if (data.success) {
               message.success('删除成功');
               this.getAddressBooks();
            }
          },
          e => console.log('deletesAddressBookByName-error', e.toString()),
        )
    };
    
    // 添加通讯录成员
    handleOnSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { name } = values;
                this.setState({ loading: true })
                setTimeout(()=> {
                    postAddressBook({
                        userName: name, 
                     },
                     data => {
                         console.log('postAddressBook-data', data);
                         if (data.success) {
                            message.success('添加成功');
                            this.getAddressBooks();
                         } else if (!data.success){
                            Modal.error({
                               title: '操作提示',
                               content: data.message
                            })
                         }
                         this.props.form.resetFields();
                         this.setState({
                            loading: false,
                         })
                     },
                     e => console.log('postAddressBook-error', e.toString()),
                     )
                }, 1000)
            }
        });
    }
    render() {
        const {
            collapsed,
            dataSource,
            visible,
            id,
            loading,
        } = this.state;
        const {form} = this.props;

        const formElementProps = {
            form,
            width: 300,
            style: {paddingLeft: 16},
        };
        return (
            <PageContent>
                <QueryBar
                    collapsed={collapsed}
                    onCollapsedChange={collapsed => this.setState({collapsed})}
                >
                    <Form autoComplete="off">
                        <FormRow >
                            <FormElement
                                {...formElementProps}
                                showMessage={true}
                                label="用户名"
                                field="name"
                                required={true}
                                ref={node => this.nameDom = node}
                            />
                            <FormElement layout>
                                <Button type="primary" onClick={this.handleOnSubmit} loading={loading}>添加用户</Button>
                                <Button onClick={() => this.props.form.resetFields()}>重置</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>

                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={true}
                />
                <RowEdit 
                  visible={visible}
                  id={id}
                  onOk={() => this.setState({visible: false}, this.handleSearch)}
                  onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
