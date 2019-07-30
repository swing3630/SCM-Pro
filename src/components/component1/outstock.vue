<template>
    <div>
        <el-tabs type="border-card" @tab-click="handleTab" v-model="activeName">
            <el-tab-pane v-for="(item , index) in paneList" :key="index" :label="item.label" :name="item.name">
                <el-table :data="tabelList" stripe size="mini" @expand-change="expandRow" :row-key='getRowKeys'
                    :expand-row-keys="expands">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="pomainList" stripe size="mini">
                                <el-table-column prop="productCode" label="产品编号"></el-table-column>
                                <el-table-column prop="productName" label="产品名称"></el-table-column>
                                <el-table-column prop="unitName" label="数量单位"></el-table-column>
                                <el-table-column prop="num" label="产品数量"></el-table-column>
                                <el-table-column prop="unitPrice" label="采购单价"></el-table-column>
                                <el-table-column prop="itemPrice" label="产品明细总价"></el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>

                    <el-table-column v-for="(col,index) in tabelHeader" :key="index" :prop="col.value"
                        :label="col.label" :width="col.width" :formatter = "formatType">
                    </el-table-column>
                    <el-table-column width="100px" label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="instockPro(scope.row)" size="mini">出库</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row>
                    <el-col :span="24" style="text-align: right">
                        <el-pagination background layout="prev, pager, next" :total="total"
                            @current-change="current_change">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        data() {
            return {
                total: 0,
                currentPage: 1,
                activeName: '1',
                paneList: [
                    { label: '货到付款', name: '1' },
                    { label: '款到发货', name: '2' },
                    { label: '预付款到发货', name: '3' },
                ],
                tabelHeader: [
                    { value: 'soId', label: '销售单编号', width: '120px' },
                    { value: 'createTime', label: '创建时间', width: '140px'},
                    { value: 'customerName', label: '客户名称', width: '70px' },
                    { value: 'account', label: '创建用户', width: '70px' },
                    { value: 'tipFee', label: '附加费用' , width: '70px'},
                    { value: 'productTotal', label: '采购产品总价', width: '100px' },
                    { value: 'soTotal', label: '销售单总价' },
                    { value: 'payType', label: '付款方式' , width: '100px'},
                    { value: 'prePayFee', label: '最低预付款' },
                    { value: 'status', label: '处理状态' },
                ],
                tabelList: [],
                pomainList: [],
                payType: 1,
                expands: [],
                getRowKeys(row) {
                    return row.soId
                },
            }
        },
        methods: {
            //格式化
            formatType(row,column){
                if(column.property == 'payType'){
                    return this.$method.payFun(row[column.property])
                }
                if(column.property == 'status'){
                    return this.$method.statusFun(row[column.property])
                }
                return row[column.property]
            },
            handleTab(row, event) {
                this.payType = row.name
                this.getInstock()
            },
            //获取可chu库
            getInstock() {
                this.$axios.get(`/api/main/sell/somain/show?type=3&payType=${this.payType}&page=1`).then(resp => {
                    if (resp.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        console.log(resp.data)
                        this.tabelList = resp.data.list
                        this.total = resp.data.total
                    }
                })
            },
            current_change(current) {
                this.currentPage = current
                this.$axios.get(`/api/main/sell/somain/show?type=3&payType=${this.payType}&page=${this.currentPage}`).then(resp => {
                    if (resp.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.tabelList = resp.data.list
                        this.total = resp.data.total
                    }
                })
            },
            //打开明细的下拉表
            expandRow(row, expandedRows) {
                var that = this
                if (expandedRows.length) {
                    that.expands = []
                    if (row) {
                        that.expands.push(row.soId)
                        this.$axios.get(`/api/main/sell/somain/queryItem?soId=${row.soId}`).then(res => {
                            this.pomainList = res.data
                        })
                    }
                } else {
                    that.expands = []
                    this.$axios.get(`/api/main/sell/somain/queryItem?soId=${row.soId}`).then(res => {
                        this.pomainList = res.data
                    })
                }
            },
            //出库
            instockPro(row) {
                this.$confirm('确认出库？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get(`/api/main/stock/outstock?soId=${row.soId}&type=${row.status}&payType=${row.payType}`).then(res => {
                        if (res.data.status == 2) {
                            // console.log(res.data)
                            this.tabelList = res.data.data.list
                            this.$message({
                                type: 'success',
                                message: res.data.statusInfo
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.statusInfo
                            })
                        }
                    }).catch()
                })
            }
        },
        watch: {
            $route: {
                handler: function () {
                    this.getInstock()
                },
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>