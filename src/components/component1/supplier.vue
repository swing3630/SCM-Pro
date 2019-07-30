<template>
    <div>
        <el-input placeholder="请输入编号" prefix-icon="el-icon-search" v-model="searchid" style="width: 150px">
        </el-input>
        <el-input placeholder="请输入供应商名称" prefix-icon="el-icon-search" v-model="searchname" style="width: 160px">
        </el-input>
        <el-button type="primary" size='small' icon="el-icon-plus" @click="addSupp">添加供货商</el-button>

        <el-table stripe :data="supplierList" width="100%" v-loading="loading" height="415px">
            <el-table-column prop="venderCode" label="编号"></el-table-column>
            <el-table-column prop="name" label="供应商名"></el-table-column>
            <el-table-column prop="contactor" label="联系人"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="postCode" label="邮编"></el-table-column>
            <el-table-column prop="createDate" label="添加日期"></el-table-column>
            <el-table-column prop="tel" label="联系电话"></el-table-column>
            <el-table-column prop="fax" label="传真"></el-table-column>

            <el-table-column width="200px" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)"
                        icon="el-icon-edit-outline">编辑
                    </el-button>

                    <el-button type="danger" @click="deleteRow(scope.$index, scope.row)" size="small"
                        icon="el-icon-delete">
                        移除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row>
            <el-col :span="4" :offset="20">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>

        <!-- 编辑供应商信息的dialog -->
        <!-- scope.row传出表格内容，v-model绑定初始值 -->
        <el-dialog title="修改供应商信息" :visible.sync="dialogForm" width="500px">

            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" :rules="rules" size="mini">
                <el-form-item label="编号" prop="venderCode">
                    <el-input v-model="ruleForm.venderCode" readonly></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passWord">
                    <el-input v-model="ruleForm.passWord" :show-passwoed="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactor">
                    <el-input v-model="ruleForm.contactor"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="ruleForm.tel">
                    </el-input>
                </el-form-item>
                <el-form-item label="添加日期">
                    <el-input :value='ruleForm.createDate' readonly></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="邮编">
                    <el-input v-model="ruleForm.postCode"></el-input>
                </el-form-item>
                <el-form-item label="传真">
                    <el-input v-model="ruleForm.fax"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="cancleEdit">取 消</el-button>
                    <el-button type="primary" @click="editSupp('ruleForm')">修 改</el-button>
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
                loading: true,
                searchid: '',
                searchname: '',
                supplierList: [],
                total: 0,
                currentPage: 1,
                search: '',
                ruleForm: {
                    venderCode: '',
                    name: '',
                    passWord: '',
                    contactor: '',
                    createDate: '',
                    tel: '',
                    address: '',
                    fax: '',
                    postCode: ''
                },
                rules: {
                    venderCode: [{ required: true, message: '供应商编号不能为空', triggle: 'blur' }],
                    name: [{ required: true, message: '用户名不能为空', triggle: 'blur' }],
                    passWord: [
                        { required: true, message: '密码不能为空', triggle: 'blur' },
                        { min: 4, max: 20, message: "密码长度为4到20位", triggle: 'blur' }
                    ],
                    contactor: [{ required: true, message: '联系人不能为空', triggle: 'blur' }],
                    tel: [{ required: true, message: '电话不能为空', triggle: 'blur' }],
                },
                dialogForm: false
            }
        },
        methods: {

            //添加供货商
            addSupp() {
                this.$router.push({ path: '/buy/supplier/addsupp' })
            },
            //获取供应商信息
            getSupplier() {
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPage}`).then(resp => {
                    this.supplierList = resp.data.list
                    this.total = resp.data.total
                    this.currentPage = resp.data.pageNum
                    this.loading = false
                })
            },
            //分页请求
            current_change(currentPage) {
                this.currentPage = currentPage
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPage}`).then(res => {
                    this.supplierList = res.data.list;
                    this.currentPage = res.data.pageNum
                })
            },
            //打开修改框并附上原始值
            handleEdit(index, row) {
                this.ruleForm = row
                // console.log(this.ruleForm)
                this.dialogForm = true
            },
            //取消修改
            cancleEdit() {
                this.dialogForm = false
                this.getSupplier()
            },
            //修改
            editSupp(formName) {
                this.$refs[formName].validate(valid => {
                    //提交通过时触发
                    if (valid) {
                        this.$confirm('确定修改此供货商信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //发送请求
                            this.$axios.post('/api/main/purchase/vender/update', qs.stringify(this.ruleForm)).then(resp => {
                                console.log(resp.data.status)
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.getSupplier()
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
                            this.getSupplier()
                        })
                        //验证不通过时
                    } else {
                        this.$message.error('修改格式有误，请重新填写');
                    }
                })
            },
            //删除用户
            deleteRow(index, row) {
                this.$confirm('确定删除此供货商?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.$axios.get(`/api/main/purchase/vender/delete?venderCode=${row.venderCode}&page=${this.currentPage}`).then(resp => {
                        if (resp.data.status == 2) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getSupplier()
                        }
                    }).catch(() => {
                        this.$message({
                            message: '错误的请求',
                            type: 'warning'
                        })
                    })
                })
            },
            //封装搜索过滤的方法
            _search(a, b) {
                this.$axios.get(`/api/main/purchase/vender/show?${a}=${b}&page=${this.currentPage}`).then(res => {
                    this.supplierList = res.data.list
                    this.total = res.data.total
                })
            },
        },
        //计算属性监听（有bug）
        // computed: {
        //     supplier: function () {
        //         const searchid = this.searchid;
        //         const searchname = this.searchname;
        //         if (searchid) {
        //             this.$axios.get(`/api/main/purchase/vender/show?venderCode=${searchid}&page=${this.currentPage}`).then(res => {
        //                 console.log(res.data, 1111)
        //                 return this.tableDate = res.data.list
        //                 console.log(this.tableDate)
        //             })
        //         } else if (searchname) {
        //             this.$axios.get(`/api/main/purchase/vender/show?name=${searchname}&page=${this.currentPage}`).then(res => {
        //                 console.log(2222)
        //                 return this.tableDate = res.data.list
        //             })
        //         } else {
        //             return this.supplierList
        //         }
        //     }
        // },
        watch: {
            $route: {
                handler: function () {
                    this.getSupplier()
                },
                immediate: true
            },
            'searchid': function () {
                this._search('venderCode', this.searchid)
            },
            'searchname': function () {
                this._search('name', this.searchname)
            }
        },
    }
</script>

<style scoped>
.el-input{
    width: 300px
}
</style>