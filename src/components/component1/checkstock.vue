<template>
    <div>
        <el-table :data="tableList" stripe size="mini" max-height="450px">
            <el-table-column prop="productCode" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="num" label="当前库存"></el-table-column>
            <el-table-column prop="poNum" label="采购在途数"></el-table-column>
            <el-table-column prop="soNum" label="预销售数"></el-table-column>
            <el-table-column width="100px" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="openDialog(scope.row)" size="mini">盘点</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-row>
            <el-col :span="24" style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- dialog -->
        <el-dialog title="库存盘点" :visible.sync="dialogCheck" width="500px">
            <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
                <el-form-item label="变化数量" prop="num">
                    <el-input v-model="ruleForm.num" style="width: 300px"></el-input>
                </el-form-item>
                <el-form-item label="变化类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择变化类型">
                        <el-option value="损耗" label="损耗"></el-option>
                        <el-option value="盘余" label="盘余"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="变化原因" prop="description">
                    <el-input v-model="ruleForm.description" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="dialogChe('ruleForm')">取 消</el-button>
                    <el-button type="primary" @click="addCheck('ruleForm')">添 加</el-button>
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
                tableList: [],
                currentPage: 1,
                total: 0,
                dialogCheck: false,
                ruleForm: {
                    productCode: '',
                    originNum: '',
                    num: '',
                    type: '',
                    description: ''
                },
                rules: {
                    num: [{ required: true, message: '变化量不能为空', triggle: 'blur' }],
                    type: [{ required: true, message: '请选择变化类型', triggle: 'change' }],
                    description: [{ required: true, message: '变化原因不能为空', triggle: 'blur' }],
                }
            }
        },
        methods: {
            //~~~~~~~~~~~~~~~~~~~~~~~~~
            getProduct() {
                this.$axios.get(`/api/main/sell/product/show?page=${this.currentPage}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.tableList = res.data.list
                        this.total = res.data.total
                    }
                })
            },
            current_change(current) {
                this.currentPage = current
                this.getProduct()
            },
            // 打开模态框
            openDialog(row) {
                this.ruleForm.productCode = row.productCode
                this.ruleForm.originNum = row.num
                this.dialogCheck = true
            },
            addCheck(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定改变库存?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            this.$axios.post('/api/main/stock/checkstock', qs.stringify(this.ruleForm)).then(resp => {
                                console.log(resp.data, this.ruleForm, 12121)
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    this.$refs[formName].resetFields();
                                    this.getProduct()
                                    this.dialogCheck = false
                                } else {
                                    this.$message({
                                        message: resp.data.statusInfo,
                                        type: 'error'
                                    })
                                }
                            }).catch()
                        }).catch(() => {
                            this.$message({
                                message: '已取消',
                                type: 'info'
                            })
                            this.$refs[formName].resetFields();
                        })
                    }
                })
            },
            dialogChe(formName){
                this.dialogCheck = false
                this.$refs[formName].resetFields();
            }
        },
        watch: {
            $route: {
                handler: function () {
                    this.getProduct()
                },
                immediate: true
            }
        },
    }
</script>

<style>
</style>