<template>
    <div>
        <el-date-picker v-model="searchDate" type="month" placeholder="选择日期" value-format="yyyy-MM"
            style="width: 120px">
        </el-date-picker>
        <el-button type="primary" @click="queryRP">查询</el-button>

        <el-table :data="tableList" stripe>
            <el-table-column label="收款总金额" prop="recePrice"></el-table-column>
            <el-table-column label="收款交易次数" prop="receCount"></el-table-column>
            <el-table-column label="付款总金额" prop="payPrice"></el-table-column>
            <el-table-column label="付款交易次数" prop="payCount"></el-table-column>
        </el-table>

        <el-tabs type="border-card">
            <el-tab-pane label="收款明细">
                <el-table :data="tableListIn" border stripe height="400px" size="mini">
                    <el-table-column prop="soid" label="销售单编号"></el-table-column>
                    <el-table-column prop="createTime" label="销售单日期"></el-table-column>
                    <el-table-column prop="pay_time" label="收款日期"></el-table-column>
                    <el-table-column prop="account" label="经手人"></el-table-column>
                    <el-table-column prop="pay_price" label="收款金额"></el-table-column>
                    <el-table-column prop="status" label="处理状态">
                        <template slot-scope="scope">
                            {{statusFn(scope.row.status)}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-col :span="24" style="text-align: right">
                        <el-pagination background layout="prev, pager, next" :total="totalIn"
                            @current-change="current_changeIn">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="付款明细">
                <el-table :data="tableListOut" border stripe height="400px" size="mini">
                    <el-table-column prop="poid" label="采购单编号"></el-table-column>
                    <el-table-column prop="createTime" label="采购日期"></el-table-column>
                    <el-table-column prop="pay_time" label="付款日期"></el-table-column>
                    <el-table-column prop="account" label="经手人"></el-table-column>
                    <el-table-column prop="pay_price" label="付款金额"></el-table-column>
                    <el-table-column prop="status" label="处理状态">
                        <template slot-scope="scope">
                            {{statusFn(scope.row.status)}}
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                    <el-col :span="24" style="text-align: right">
                        <el-pagination background layout="prev, pager, next" :total="totalOut"
                            @current-change="current_changeOut">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchDate: '',
                totalIn: 0,
                totalOut: 0,
                currentPageIn: 1,
                currentPageOut: 1,
                tableList: [],
                tableListIn: [],
                tableListOut: [],

            }
        },
        methods: {
            statusFn(row) {
                switch (row) {
                    case 1: return '新增'; break;
                    case 2: return '已收货'; break;
                    case 3: return '已付款'; break;
                    case 4: return '已了结'; break;
                    case 5: return '已预付'; break;
                }
            },
            queryRP() {
                this.$axios.get(`/api/main/report/payment/main?time=${this.searchDate}`).then(res => {
                    this.tableList = [],
                    this.tableList.push(res.data)
                })
                this.IN()
                this.OUT()
            },
            current_changeIn(current){
                this.currentPageIn =current
                this.IN()
            },
            current_changeOut(current){
                this.currentPageOut = current
                this.OUT()
            },

            //收
            IN(){
                this.$axios.get(`/api/main/report/payment/detail/receipt?time=${this.searchDate}&page=${this.currentPageIn}`).then(res => {
                    // console.log(res.data)
                    this.tableListIn = res.data.list
                    this.totalIn = res.data.total
                })
            },
            //付
            OUT(){
                this.$axios.get(`/api/main/report/payment/detail/pay?time=${this.searchDate}&page=${this.currentPageIn}`).then(res => {
                    // console.log(res.data)
                    this.tableListOut = res.data.list
                    this.totalOut = res.data.total
                })
            }
        },
    }
</script>

<style></style>