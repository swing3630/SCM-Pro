<template>
    <div>
        <el-button type="primary" @click="addUser" size='small' icon="el-icon-plus">添加用户</el-button>
        <el-table border stripe :data="userList" height="425px">
            <el-table-column prop="account" label="用户名"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="createDate" label="创建时间"></el-table-column>
            <el-table-column prop="status" label="锁定状态">
                <template slot-scope='scope'>
                    {{ scope.row.status==0?'否':'是'}}
                </template>
            </el-table-column>
            <el-table-column prop="models" label="权限" :formatter="formatModels"></el-table-column>

            <el-table-column width="200px" label="操作">
                <template slot-scope="scope">

                    <!-- 编辑用户信息的dialog -->
                    <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)"
                        icon="el-icon-edit-outline">编辑
                    </el-button>
                    <!-- scope.row传出表格内容，v-model绑定初始值 -->
                    <el-dialog title="修改用户信息" :visible.sync="dialogForm">

                        <el-form :model="ruleForm" ref="ruleForm" label-width="80px" :rules="rules">
                            <el-form-item label="用户名" prop="account" >
                                <el-input v-model="ruleForm.account" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码">
                                <el-input v-model="ruleForm.passWord" :show-passwoed="true">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="添加日期">
                                <el-input :value='ruleForm.createDate' readonly></el-input>
                            </el-form-item>
                            <el-form-item label="锁定状态">
                                <el-radio-group v-model="ruleForm.status">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="权限" >
                                <el-checkbox-group v-model="ruleForm.modelcodes">
                                    <el-checkbox :label="1">采购管理</el-checkbox>
                                    <el-checkbox :label="2">销售管理</el-checkbox>
                                    <el-checkbox :label="3">系统管理</el-checkbox>
                                    <el-checkbox :label="4">财务管理</el-checkbox>
                                    <el-checkbox :label="5">仓库管理</el-checkbox>
                                    <el-checkbox :label="6">业务报表</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="dialogForm= false">取 消</el-button>
                                <el-button type="primary" @click="editUser('ruleForm')">修 改</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>

                    <el-button type="danger" @click="deleteRow(scope.$index, scope.row)" size="small"
                        icon="el-icon-delete">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- //分页 -->
        <el-row>
            <el-col :span="4" :offset="20">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    const qs = require('querystring')
    export default {
        data() {
            return {
                // loading:true,
                userList: [],
                //总数
                total: 0,
                //当前页
                currentPage: 1,
                ruleForm: {
                    account:'',
                    name:'',
                    passWord:'',
                    status: '',
                    createDate:'',
                    modelcodes:[]
                },
                rules: {
                    account: [{ required: true, message: '用户名不能为空', triggle: 'blur' }],
                },
                dialogForm: false
            }
        },

        methods: {
            //打开修改框并附上原始值
            handleEdit(index, row) {
                //提取models中的modelCode，并放入ruleForm中
                let models = row.models.map(item=>{
                    return item.modelCode
                })
                this.ruleForm.modelcodes = models;
                this.ruleForm.account = row.account
                this.ruleForm.name = row.name
                this.ruleForm.passWord = row.passWord
                this.ruleForm.createDate = row.createDate
                this.ruleForm.status = row.status
                this.dialogForm = true
            },
            //提交修改信息
            editUser(formName) {
                this.$refs[formName].validate(valid => {
                    //提交通过时触发
                    if (valid) {
                        this.$confirm('确定修改此用户信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //发送请求
                            this.$axios.post('/api/main/system/user/update', qs.stringify(this.ruleForm)).then(resp => {
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.getUser()
                                } else {
                                    this.$message({
                                        message: '修改失败',
                                        type: 'error'
                                    });
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                message: '已取消',
                                type: 'info'
                            })
                        })
                        //验证不通过时
                    } else {
                        this.$message.error('修改格式有误，请重新填写');
                    }
                })
            },
            //删除用户
            deleteRow(index, row) {
                this.$confirm('确定删除此用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.$axios.get(`/api/main/system/user/delete?account=${row.account}&page=${this.currentPage}`).then(resp => {
                        // console.log(resp.data.statusInfo)
                        if (resp.data.status == 2) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getUser()
                        }
                    }).catch(() => {
                        this.$message({
                            message: '已取消',
                            type: 'warning'
                        })
                    })
                })
            },
            //获取用户信息
            getUser() {
                this.$axios.get(`/api/main/system/user/show?page=${this. currentPage}`).then(res => {
                    this.userList = res.data.list;
                    this.total = res.data.total
                    this.currentPage = res.data.pageNum
                })
            },
            //格式化权限 转化为字符串
            formatModels(row, column) {
                let m = row.models.map(item => item.modelName)
                return m.join(' ')
            },
            //分页请求
            current_change(currentPage) {
                this.currentPage = currentPage
                this.$axios.get(`/api/main/system/user/show?page=${this.currentPage}`).then(res => {
                    this.userList = res.data.list;
                    this.currentPage = res.data.pageNum
                })
            },

            addUser() {
                this.$router.push({ path: '/user/adduser' })
            }
        },

        watch: {
            $route:{
                handler:function(){
                    this.getUser()
                },
                immediate:true
            },
        },
        // created() {
        //     this.getUser()
        // },
    }
</script>

<style scoped>
    .el-input{
        width: 60%
    }
</style>