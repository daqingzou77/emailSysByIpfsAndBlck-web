import React, {Component, Fragment} from 'react';
import {Button, Form} from 'antd';
import PageContent from '@/layouts/page-content';
import {
    QueryBar,
    Pagination,
    Operator,
    ToolBar,
    FormRow,
    FormElement,
    Table,
} from "@/library/components";
import config from '@/commons/config-hoc';
import RowEdit from './RoleEdit';
import UserEditModal from './UserEditModal';
import moment from 'moment';

@config({
    path: '/users',
    ajax: true,
})
@Form.create()

export default class UserCenter extends Component {
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
        {title: '姓名', dataIndex: 'username', width: 100, align: 'center'},
        // {title: '年龄', dataIndex: 'age', width: 100},
        // {title: '工作', dataIndex: 'job', width: 100},
        // {title:'用户类型', dataIndex: 'userType', width:100, align: 'center'},
        // {title: '职位', dataIndex: 'position', width: 100, align: 'center'},
        {title:'创建时间', dataIndex: 'createTime', width:100, align: 'center'},
        {
            title: '操作', dataIndex: 'operator', width: 100, align: 'center',
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => this.setState({visible: true, id}),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleSearch(),
                        },
                    }
                ];

                return <Operator items={items}/>
            },
        }
    ];

    componentDidMount() {
        this.handleSearch();
        console.log(this.nameDom);
    }

    handleSearch = (e) => {
        e && e.preventDefault();
        /*
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;

            const {pageNum, pageSize} = this.state;
            const params = {
                ...values,
                pageNum,
                pageSize,
            };

            this.props.ajax.get('/xxx', params)
                .then(res => {
                    const dataSource = res?.list || [];
                    const total = res?.total || 0;

                    this.setState({dataSource, total});
                });
        });

        */

        const dataSource = Array.from({length: 20})
            .map((item, index) => {
                const n = index + 1;
                return {
                    id: n,
                    username: `用户${n}`,
                    createTime: moment(new Date()).format('YYYY/MM/DD hh:mm:ss'),
                    // age: n,
                    // job: n,
                    // position: ``,
                };
            });

        this.setState({dataSource});
    };

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
                    <Form onSubmit={this.handleSearch}>
                        <FormRow>
                            <FormElement
                                {...formElementProps}
                                label="名称"
                                field="name"
                                ref={node => this.nameDom = node}
                            />
                            <FormElement
                                {...formElementProps}
                                type="select"
                                label="职位"
                                field="job"
                                options={[
                                    {value: 1, label: 1},
                                    {value: 2, label: 2},
                                ]}
                            />
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
                                <Button type="primary" htmlType="submit">添加用户</Button>
                                <Button onClick={() => this.props.form.resetFields()}>重置</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>

                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                    // pagination={true}
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
