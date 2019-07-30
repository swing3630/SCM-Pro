<template>
    <div>
        <el-input v-model="searchid" placeholder="请输入客户编号" prefix-icon="el-icon-search" style="width: 150px">
        </el-input>
        <el-input v-model="searchname" placeholder="请输入客户名称" prefix-icon="el-icon-search" style="width: 150px">
        </el-input>
        <el-button type="primary" @click="openAdd" icon="el-icon-plus">添加客户</el-button>

        <el-table :data="tableList" border stripe height="415px">
            <el-table-column label="客户编号" prop="customerCode"></el-table-column>
            <el-table-column label="客户名称" prop="name"></el-table-column>
            <el-table-column label="联系人" prop="contactor"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column label="邮政编码" prop="postCode"></el-table-column>
            <el-table-column label="注册日期" prop="createDate"></el-table-column>
            <el-table-column label="电话" prop="tel"></el-table-column>
            <el-table-column label="传真" prop="fax"></el-table-column>
            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit-outline" @click="openEdit(scope.row)"></el-button>
                    <el-button type="text" icon="el-icon-delete" @click="deleteCustomer(scope.row,scope.$index)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="24" style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 添加的dialog -->
        <el-dialog title="添加客户" :visible.sync="dialogAdd" width="500px">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" :rules="rules" size="mini">
                <el-form-item label="客户编号" prop="customerCode">
                    <el-input v-model="ruleForm.customerCode"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="ruleForm.passWord"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactor">
                    <el-input v-model="ruleForm.contactor"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="邮编">
                    <el-input v-model="ruleForm.postCode"></el-input>
                </el-form-item>
                <el-form-item label="添加日期">
                    <el-input v-model="ruleForm.createDate" readonly></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="ruleForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="传真">
                    <el-input v-model="ruleForm.fax"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancelAdd('ruleForm')">取 消</el-button>
                    <el-button type="primary" @click="addCustomer('ruleForm')">添 加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改的dialog -->
        <el-dialog title="添加客户" :visible.sync="dialogEdit" width="500px">
                <el-form :model="ruleForm2" ref="ruleForm2" label-width="110px" :rules="rules" size="mini">
                    <el-form-item label="客户编号">
                        <el-input v-model="ruleForm2.customerCode" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm2.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passWord">
                        <el-input v-model="ruleForm2.passWord"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactor">
                        <el-input v-model="ruleForm2.contactor"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="ruleForm2.address"></el-input>
                    </el-form-item>
                    <el-form-item label="邮编">
                        <el-input v-model="ruleForm2.postCode"></el-input>
                    </el-form-item>
                    <el-form-item label="添加日期">
                        <el-input v-model="ruleForm2.createDate" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="tel">
                        <el-input v-model="ruleForm2.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="传真">
                        <el-input v-model="ruleForm2.fax"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="dialogEdit=false">取 消</el-button>
                        <el-button type="primary" @click="editCustomer('ruleForm2')">修 改</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

    </div>
</template>

<script>
    const qs = require('querystring')
    export default {
        data() {
            return {
                searchid: '',
                searchname: '',
                tableList: [],
                total: 0,
                currentPage: 1,
                dialogAdd: false,
                ruleForm: {
                    customerCode: '',
                    name: '',
                    passWord: '',
                    contactor: '',
                    address: '',
                    postCode: '',
                    createDate: this.$method.getDate(),
                    tel: '',
                    fax: ''
                },
                dialogEdit:false,
                ruleForm2: {
                    customerCode: '',
                    name: '',
                    passWord: '',
                    contactor: '',
                    address: '',
                    postCode: '',
                    createDate: '',
                    tel: '',
                    fax: ''
                },
                // date:'1',
                rules: {
                    customerCode: [{ required: true, message: '客户编号不能为空', triggle: 'blur' }],
                    name: [{ required: true, message: '客户名不能为空', triggle: 'blur' }],
                    passWord: [
                        { required: true, message: '密码不能为空', triggle: 'blur' },
                        { min: 4, max: 20, message: "密码长度为4到20位", triggle: 'blur' }
                    ],
                    contactor: [{ required: true, message: '联系人不能为空', triggle: 'blur' }],
                    tel: [{ required: true, message: '电话不能为空', triggle: 'blur' }],
                }
            }
        },
        methods: {
            getCustomer() {
                this.$axios.get(`/api/main/sell/customer/show?page=${this.currentPage}`).then(res => {
                    this.tableList = res.data.list
                    this.total = res.data.total
                })
            },
            current_change(current) {
                this.currentPage = current
                this.getCustomer()
            },
            openAdd() {
                this.dialogAdd = true
                // this.$method.getDate()
            },
            // 添加
            addCustomer(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定添加此客户信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //发送请求
                            this.$axios.post('/api/main/sell/customer/add', qs.stringify(this.ruleForm)).then(resp => {
                                // console.log(resp.data.status)
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.getCustomer()
                                    this.dialogAdd = false
                                } else {
                                    this.$message({
                                        message: '添加失败',
                                        type: 'error'
                                    });
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                message: '错误的请求',
                                type: 'info'
                            })
                            this.getCustomer()
                        })
                        //验证不通过时
                    } else {
                        this.$message.error('格式有误，请重新填写');
                    }
                })
            },
            cancelAdd(formName) {
                this.$refs[formName].resetFields()
                this.data = this.dialogAdd = false
            },
            // 修改
            openEdit(row){
                this.dialogEdit=true
                this.ruleForm2 = row
            },
            editCustomer(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定修改此客户信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //发送请求
                            this.$axios.post('/api/main/sell/customer/update', qs.stringify(this.ruleForm2)).then(resp => {
                                // console.log(resp.data.status)
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.getCustomer()
                                    this.dialogEdit = false
                                } else {
                                    this.$message({
                                        message: '修改失败',
                                        type: 'error'
                                    });
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                message: '错误的请求',
                                type: 'info'
                            })
                            this.getCustomer()
                        })
                        //验证不通过时
                    } else {
                        this.$message.error('格式有误，请重新填写');
                    }
                })
            },
            // 删除
            deleteCustomer(row, index) {
                this.$confirm('确定删除此客户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.$axios.get(`/api/main/sell/customer/delete?customerCode=${row.customerCode}`).then(resp => {
                        // console.log(resp.data)
                        if (resp.data.status == 2) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getCustomer()
                            this.tableList.splice(index, 1)
                        }
                    }).catch(() => {
                        this.$message({
                            message: '错误的请求',
                            type: 'warning'
                        })
                    })
                })
            },
            _search(a, b) {
                this.$axios.get(`/api/main/sell/customer/show?${a}=${b}`).then(res => {
                    this.tableList = res.data.list
                    this.total = res.data.total
                })
            },
        },
        watch: {
            $route: {
                handler: function () {
                    this.getCustomer()
                },
                immediate: true
            },
            'searchid': function () {
                this._search('customerCode', this.searchid)
            },
            'searchname': function () {
                this._search('name', this.searchname)
            },
        },
    }
</script>
<style scoped>
    .el-input {
        width: 300px;
    }
</style>