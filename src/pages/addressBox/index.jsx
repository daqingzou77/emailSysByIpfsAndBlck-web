import React, {Component, Fragment} from 'react';
import {Button, Form, Table, message} from 'antd';
import PageContent from '@/layouts/page-content';
import {
    QueryBar,
    Pagination,
    Operator,
    ToolBar,
    FormRow,
    FormElement,
} from "@/library/components";
import config from '@/commons/config-hoc';
import RowEdit from './RoleEdit';
import UserEditModal from './UserEditModal';
import moment from 'moment';
import {
    getAddressBooks,
    deletesAddressBookByName,
    postAddressBook,
} from '../../services/addressbook'
import {
    getLoginUser
} from '@/commons/index'

@config({
    path: '/list',
    title: {text: '通讯录', icon: 'usergroup'},
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
    };

    columns = [
        {title: '姓名', dataIndex: 'user_name', width: 100, align: 'center'},
        // {title: '年龄', dataIndex: 'age', width: 100},
        // {title: '工作', dataIndex: 'job', width: 100},
        // {title:'用户类型', dataIndex: 'userType', width:100, align: 'center'},
        // {title: '职位', dataIndex: 'position', width: 100, align: 'center'},
        // {title:'创建时间', dataIndex: 'createTime', width:100, align: 'center'},
        {
            title: '操作', dataIndex: 'operator', width: 100, align: 'center',
            render: (value, record) => {
                const {user_name} = record;
                const items = [
                    // {
                    //     label: '编辑',
                    //     onClick: () => this.setState({visible: true, id}),
                    // },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${user_name}"?`,
                            onConfirm: () => this.deletesAddressBookByName(user_name),
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
            if (data !== undefined) {
                const { contacts_list } = JSON.parse(data.message);
                console.log('contactList', contacts_list);
                this.setState({
                    dataSource: contacts_list,
                })
            }
          },
          e => console.log('getAddressBooks-error', e.toString()),
        )
    };
    
    // 删除人员
    deletesAddressBookByName = userName => {
        deletesAddressBookByName({
          userName,
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
                postAddressBook({
                   userName: name, 
                },
                data => {
                    console.log('postAddressBook-data', data);
                    if (data.success) {
                        message.success('添加成功');
                        this.getAddressBooks();
                    }
                    this.props.form.resetFields();
                },
                e => console.log('postAddressBook-error', e.toString()),
                )
            }
        });
    }

    render() {
        const {
            total,
            pageNum,
            pageSize,
            collapsed,
            dataSource,
            visible,
            id,
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
                        <FormRow>
                            <FormElement
                                {...formElementProps}
                                label="用户名"
                                field="name"
                                ref={node => this.nameDom = node}
                            />
                            {/* <FormElement
                                {...formElementProps}
                                type="select"
                                label="职位"
                                field="job"
                                options={[
                                    {value: 1, label: 1},
                                    {value: 2, label: 2},
                                ]}
                            /> */}
                            {/* {collapsed ? null : (
                                <Fragment>
                                    <FormElement
                                        {...formElementProps}
                                        type="date"
                                        label="入职时间"
                                        field="time"
                                    />
                                    <FormElement
                                        {...formElementProps}
                                        label="年龄"
                                        field="age"
                                    />
                                </Fragment>
                            )} */}
                            <FormElement layout>
                                <Button type="primary" onClick={this.handleOnSubmit}>添加用户</Button>
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

                {/* <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={pageNum => this.setState({pageNum}, this.handleSearch)}
                    onPageSizeChange={pageSize => this.setState({pageSize, pageNum: 1}, this.handleSearch)}
                /> */}
                <RowEdit 
                  visible={visible}
                  id={id}
                  onOk={() => this.setState({visible: false}, this.handleSearch)}
                  onCancel={() => this.setState({visible: false})}
                />
                {/* <UserEditModal
                    visible={visible}
                    id={id}
                    onOk={() => this.setState({visible: false}, this.handleSearch)}
                    onCancel={() => this.setState({visible: false})}
                /> */}
            </PageContent>
        );
    }
}
