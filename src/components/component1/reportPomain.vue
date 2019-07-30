<template>
    <div>
        <el-date-picker v-model="searchDate" type="month" placeholder="选择日期" value-format="yyyy-MM"
            style="width: 120px">
        </el-date-picker>
        <el-button type="primary" @click="queryPomain">查询</el-button>

        <el-table :data="tableList" stripe>
            <el-table-column label="采购单总数" prop="totalnum"></el-table-column>
            <el-table-column label="已了结数" prop="endtotalnum"></el-table-column>
            <el-table-column label="采购单总金额" prop="pototal"></el-table-column>
            <el-table-column label="已付款金额" prop="totalpay"></el-table-column>
        </el-table>

        <el-table :data="secondList" border stripe height="400px" size="mini">
            <el-table-column prop="poId" label="采购单编号"></el-table-column>
            <el-table-column prop="venderName" label="供应商名称"></el-table-column>
            <el-table-column prop="createTime" label="创建日期"></el-table-column>
            <el-table-column prop="account" label="创建用户"></el-table-column>
            <el-table-column prop="poTotal" label="采购单总金额"></el-table-column>
            <el-table-column prop="lastMoney" label="未付款金额">
                <template slot-scope="scope">
                    {{lastMoneyFn(scope.row.payType,scope.row.status,scope.$index)}}
                </template>
            </el-table-column>
            <el-table-column prop="payType" label="付款方式">
                <template slot-scope="scope">
                    {{payTypeFn(scope.row.payType)}}
                </template>
            </el-table-column>
            <el-table-column prop="prePayFee" label="最低预付款"></el-table-column>
            <el-table-column prop="status" label="采购单状态">
                <template slot-scope="scope">
                    {{statusFn(scope.row.status)}}
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="24" style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchDate: '',
                tableList: [
                    {totalnum:'',endtotalnum:'',pototal:'',totalpay:''}
                ],
                secondList: [],
                currentPage: 1,
                total: 0,
            }
        },
        methods: {
            queryPomain() {
                this.$axios.get(`/api/main/report/pomain/main?time=${this.searchDate}&page=${this.currentPage}`).then(res => {
                    console.log(res.data)
                    res.data.details.list.map(item => {
                        item.lastMoney = 0
                    })
                    this.secondList = res.data.details.list
                    this.total = res.data.details.total

                    this.tableList[0].totalnum = res.data.totalnum
                    this.tableList[0].endtotalnum = res.data.endtotalnum
                    this.tableList[0].pototal = (res.data.pototal).toFixed(2)
                    this.tableList[0].totalpay = (res.data.totalpay).toFixed(2)
                    console.log(this.tableList)
                })
            },
            current_change(current) {
                this.currentPage = current
                this.queryPomain()
                this.currentPage = 1
            },
            payTypeFn(row) {
                switch (row) {
                    case 1: return '货到付款'; break;
                    case 2: return '款到发货'; break;
                    case 3: return '预付款到发货'; break;
                }
            },
            statusFn(row) {
                switch (row) {
                    case 1: return '新增'; break;
                    case 2: return '已收货'; break;
                    case 3: return '已付款'; break;
                    case 4: return '已了结'; break;
                    case 5: return '已预付'; break;
                }
            },
            lastMoneyFn(payType, status, index) {
                if (status == 4 || status == 3) {
                    return this.secondList[index].lastMoney = 0
                } else if (status == 5) {
                    return this.secondList[index].lastMoney = this.secondList[index].poTotal - this.secondList[index].prePayFee
                } else if (status == 1) {
                    return this.secondList[index].lastMoney = this.secondList[index].poTotal
                } else if (status == 2) {
                    if (payType == 1) {
                        return this.secondList[index].lastMoney = this.secondList[index].poTotal
                    }else if(payType ==2 ){
                        return this.secondList[index].lastMoney = 0
                    }else{
                        return this.secondList[index].lastMoney = this.secondList[index].poTotal - this.secondList[index].prePayFee
                    }
                }
            }
        },
    }
</script>

<style></style>