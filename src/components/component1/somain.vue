<template>
    <div>
        <el-button type="success" @click="addSomain" size='small' icon="el-icon-plus">新添销售单</el-button>

        <el-table :data="tableList" stripe width="100%" v-loading="loading" size="mini" height="420px">
            <el-table-column prop="soId" label="销售单编号" width="150px">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row,scope.$index)">{{scope.row.soId}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="客户名称"></el-table-column>
            <el-table-column prop="account" label="创建人" width="60px"></el-table-column>
            <el-table-column prop="tipFee" label="附加费用" width="70px"></el-table-column>
            <el-table-column prop="productTotal" label="产品总价"></el-table-column>
            <el-table-column prop="soTotal" label="销售总价"></el-table-column>
            <el-table-column prop="payType" label="付款方式">
                <template slot-scope="scope">
                    {{paytype(scope.row.payType)}}
                </template>
            </el-table-column>
            <el-table-column prop="prePayFee" label="最低预付款"></el-table-column>
            <el-table-column prop="status" label="销售单状态">
                <template slot-scope="scope">
                    {{scope.row.status='新增'}}
                </template>
            </el-table-column>
            <el-table-column width="100px" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit-outline" @click=""></el-button>
                    <el-button type="text" icon="el-icon-delete" @click="deletePomain(scope.row,scope.$index)">
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
        <!-- 打开明细的dialog -->
        <el-dialog title="销售单明细信息" :visible.sync="dialogMX">
            <el-table :data="tableListMX" stripe>
                <el-table-column prop="productCode" label="产品编号"></el-table-column>
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="unitPrice" label="销售单价"></el-table-column>
                <el-table-column prop="num" label="产品数量"></el-table-column>
                <el-table-column prop="unitName" label="数量单位"></el-table-column>
                <el-table-column  label="销售明细总价">
                    <template slot-scope="scope">
                        {{scope.row.num*scope.row.unitPrice}}    
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        data() {
            return {
                dialogMX: false,
                loading: true,
                tableList: [],
                currentPage: 1,
                currentPagePo: 1,
                total: 0,
                tableListMX: [],
                tableListEdit: [],
                dialogEdit: false,
            }
        },
        methods: {
            //增加销售单
            addSomain() {
                this.$router.push({ path: '/cell/somain/addsomain' })
            },

            //获取销售单信息
            getPomain() {
                this.$axios.get(`/api/main/sell/somain/show?page=${this.currentPage}&type=1`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.tableList = res.data.list
                        this.loading = false
                        this.total = res.data.total;
                    }

                })
            },
            //删除
            deletePomain(row, index) {
                if (row.account == Cookies.get('username')) {
                    this.$confirm('确认删除该销售单？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios.get(`/api/main/sell/somain/delete?page=${this.currentPage}&soId=${row.soId}`).then(resp => {
                            this.tableList = resp.data.data.list
                            this.total = resp.data.data.total;
                            this.currentPage = resp.data.data.pageNum
                            this.$message({
                                type: 'success',
                                message: '成功删除'
                            })
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '只能删除自己的销售单'
                    })
                }
            },

            //打开明细
            openDialog(row, index) {
                this.dialogMX = true;
                this.$axios.get(`/api/main/sell/somain/queryItem?soId=${row.soId}`).then(res => {
                    this.tableListMX = res.data
                })
            },
            paytype(payType) {
                switch (payType) {
                    case 1: return '货到付款'
                        break;
                    case 2: return '款到发货'
                        break;
                    case 3: return '预付款到发货'
                        break
                }
            },
            //分页
            current_change(currentPage) {
                this.currentPage = currentPage
                this.$axios.get(`/api/main/sell/somain/show?page=${this.currentPage}&type=1`).then(res => {
                    this.tableList = res.data.list;
                    this.total = res.data.total;
                    this.currentPage = res.data.pageNum
                })
            },
        },
        watch: {
            $route: {
                handler: function () {
                    this.getPomain()
                },
                immediate: true
            },
        },
    }
</script>

<style scoped>
    .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .poBtn {
        width: 100%
    }

    .el-table tr td {
        padding-top: 0;
        margin-top: 0;
    }
</style>