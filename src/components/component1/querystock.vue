<template>
    <div>
        <el-input v-model="ruleForm.productCode" placeholder="请输入产品编号" prefix-icon="el-icon-search"
            style="width: 150px">
        </el-input>
        <el-input v-model="ruleForm.name" placeholder="请输入产品名称" prefix-icon="el-icon-search" style="width: 150px">
        </el-input>
        <el-input placeholder="库存最小值" v-model="ruleForm.min" style="width: 150px"></el-input>
        <el-input placeholder="库存最大值" v-model="ruleForm.max" style="width: 150px"></el-input>
        <el-button type="primary" @click="searchStock" icon="el-icon-search">查询</el-button>

        <el-table :data="tableList" stripe size="mini" max-height="410px">
            <el-table-column prop="productCode" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="num" label="当前库存"></el-table-column>
            <el-table-column prop="poNum" label="采购在途数"></el-table-column>
            <el-table-column prop="soNum" label="预销售数"></el-table-column>
            <el-table-column width="150px" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="queryCheck(scope.row)">查看变更记录</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row v-show='first'>
            <el-col :span="24" style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 搜索后的分页 -->
        <el-row v-show="next">
            <el-col :span="24" style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="totalNext"
                    @current-change="current_changeNext">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 变更记录的dialog -->
        <el-dialog title="库存变更信息" :visible.sync="dialogForm" >
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="入库信息" name="one">
                    <el-table :data="tableListNext" stripe :inline="true" size="mini" height="300px">
                        <el-table-column prop="stockTime" label="入库时间" width="150px"></el-table-column>
                        <el-table-column prop="orderCode" label="采购单编号" width="150px"></el-table-column>
                        <el-table-column prop="createUser" label="经手人"></el-table-column>
                        <el-table-column prop="stockNum" label="入库数"></el-table-column>
                        <el-table-column prop="stockType" label="入库类型">
                            <template slot-scope="scope">
                                {{typeFun(scope.row.stockType)}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-col>
                            <el-pagination background layout="prev, pager, next" :total="totalNextOne"
                                @current-change="current_changeNextOne" :current-page="cur">
                            </el-pagination>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="出库信息" name="two">
                    <el-table :data="tableListNextTwo" stripe :inline="true" size="mini" height="300px">
                        <el-table-column prop="stockTime" label="出库时间" width="150px"></el-table-column>
                        <el-table-column prop="orderCode" label="销售单编号" width="150px"></el-table-column>
                        <el-table-column prop="createUser" label="经手人"></el-table-column>
                        <el-table-column prop="stockNum" label="出库数"></el-table-column>
                        <el-table-column prop="stockType" label="出库类型">
                            <template slot-scope="scope">
                                {{typeFun(scope.row.stockType)}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-col>
                            <el-pagination background layout="prev, pager, next" :total="totalNextTwo"
                                @current-change="current_changeNextTwo" :current-page="curr">
                            </el-pagination>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
    const qs = require('querystring')
    export default {
        data() {
            return {
                first: true,
                next: false,
                dialogForm: false,
                activeName: 'one',
                tableListNext: [],
                tableListNextTwo: [],
                tableList: [],
                total: 0,
                totalNext: 0,
                totalNextOne: 0,
                totalNextTwo: 0,
                currentPage: 1,
                row: '',
                cur:1,
                curr:1,
                ruleForm: {
                    productCode: '',
                    name: '',
                    min: '',
                    max: '',
                    page: '',
                }
            }
        },
        methods: {
            typeFun(val) {
                switch (val) {
                    case 1: return '采购入库'
                    case 2: return '销售出库'
                    case 3: return '盘点入库'
                    case 4: return '盘点出库'
                }
            },
            //获取初始数据
            getStock() {
                this.$axios.get(`/api/main/sell/product/show?page=${this.currentPage}`).then(res => {
                    // console.log(res.data)
                    if (res.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        // console.log(res.data)
                        this.tableList = res.data.list
                        this.total = res.data.total
                    }
                })
            },
            current_change(current) {
                this.currentPage = current
                this.getStock()
            },
            //盘点记录
            queryCheck(row) {
                this.dialogForm = true
                this.row = row
                this.$axios.get(`/api/main/stock/alterRecord?productCode=${this.row.productCode}&stockType=1&page=${this.cur}`).then(res => {
                    this.tableListNext = res.data.data.list
                    this.totalNextOne = res.data.data.total
                })
                this.$axios.get(`/api/main/stock/alterRecord?productCode=${this.row.productCode}&stockType=2&page=${this.curr}`).then(res => {
                    this.tableListNextTwo = res.data.data.list
                    this.totalNextTwo = res.data.data.total
                })
            },
            current_changeNextOne(current) {
                this.cur = current
                this.queryCheck(this.row)
            },
            current_changeNextTwo(current) {
                this.curr = current
                this.queryCheck(this.row)
            },
            // 搜索后的结果
            searchStock() {
                this.first = false
                this.next = true
                if (this.ruleForm.min == '') {
                    this.ruleForm.min = 0
                }
                this.$axios.post('/api/main/stock/query', qs.stringify(this.ruleForm)).then(res => {
                    if (res.data.status == 1) {
                        this.message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.tableList = res.data.list
                        this.totalNext = res.data.total
                    }
                });
            },
            current_changeNext(current) {
                this.ruleForm.page = current
                this.searchStock()
                //页码原始值回归1
                this.ruleForm.page = 1
            },
        },
        watch: {
            $route: {
                handler: function () {
                    this.getStock()
                },
                immediate: true
            }
        },
    }
</script>
<style></style>