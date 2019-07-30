<template>
    <div>
        <el-button type="primary" @click="openDialog">添加产品分类</el-button>

        <el-table :data="categoryList" stripe max-height="520px" size="mini">
            <el-table-column prop="categoryId" label="分类序列号"></el-table-column>
            <el-table-column prop="name" label="分类名称"></el-table-column>
            <el-table-column prop="remark" label="描述"></el-table-column>

            <el-table-column width="190px" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="editCategory(scope.row)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" circle
                        @click="deleteCategory(scope.row,scope.$index)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>

        <!-- 添加的dialog -->
        <el-dialog title="添加产品分类" :visible.sync="dialogcate" width="500px">
            <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="ruleForm.name" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="ruleForm.remark" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogcate=false">取 消</el-button>
                    <el-button type="primary" @click="addCate('ruleForm')">添 加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 修改的dialog -->
        <el-dialog title="修改产品分类" :visible.sync="dialogedit" width="500px">
            <el-form :model="ruleForm2" label-width="100px" :rules="rules" ref="ruleForm2">
                <el-form-item label="产品分类序号">
                    <el-input v-model="ruleForm2.categoryId" readonly></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="ruleForm2.name" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="ruleForm2.remark" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="cancleEdit">取 消</el-button>
                    <el-button type="primary" @click="editCate('ruleForm2')">修 改</el-button>
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
                categoryList: [],
                currentPage: 1,
                total: 0,
                dialogcate: false,
                dialogedit: false,
                ruleForm: {
                    name: '',
                    remark: '',
                },
                ruleForm2: {
                    categoryId: '',
                    name: '',
                    remark: '',
                },
                rules: {
                    name: [{ required: true, message: '分类名不能为空', triggle: 'blur' }],
                }
            }
        },
        methods: {
            //获取
            getCategory() {
                this.$axios.get(`/api/main/sell/category/show?page=${this.currentPage}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.total = res.data.total
                        this.currentPage = res.data.pageNum
                        this.categoryList = res.data.list
                    }
                })
            },
            current_change(currentPage) {
                this.currentPage = currentPage;
                this.getCategory();
            },
            openDialog() {
                this.dialogcate = true
            },
            //添加分类
            addCate(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定添加此信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            this.$axios.post('/api/main/sell/category/add', qs.stringify(this.ruleForm)).then(resp => {
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.getCategory()
                                    this.dialogcate = false
                                } else {
                                    this.$message({
                                        message: resp.data.statusInfo,
                                        type: 'error'
                                    });
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                message: '已取消',
                                type: 'info'
                            })
                            this.dialogcate = false
                        })
                    } else {
                        this.$message.error('修改格式有误，请重新填写');
                    }
                })

            },
            //修改dialog
            editCategory(row) {
                this.dialogedit = true
                this.ruleForm2 = row
            },
            //确认修改
            editCate(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定修改此信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            this.$axios.post('/api/main/sell/category/update', qs.stringify(this.ruleForm2)).then(resp => {
                                if (resp.data.status == 2) {
                                    this.categoryList = resp.data.list
                                    this.getCategory()
                                    this.dialogedit = false
                                    this.$message({
                                        type: 'success',
                                        message: resp.data.statusInfo
                                    })
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: '提交错误，请确认提交内容'
                                    })
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            })
                            this.dialogedit = false
                        })
                    }
                })
            },
            cancleEdit() {
                this.dialogedit = false
                this.getCategory()
            },
            //删除
            deleteCategory(row, index) {
                this.$confirm('确定删除此分类?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.$axios.get(`/api/main/sell/category/delete?categoryId=${row.categoryId}`).then(resp => {
                        if (resp.data.status == 2) {
                            // console.log(resp)
                            this.categoryList = resp.data.data
                            // this.getCategory()
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '无法删除此分类'
                            })
                        }
                    })
                })
            },

        },
        created() {
            this.getCategory()
        },
    }
</script>

<style>

</style>