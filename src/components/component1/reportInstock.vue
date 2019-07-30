<template>
    <div>
        <el-date-picker v-model="searchDate" type="month" placeholder="选择日期" value-format="yyyy-MM"
            style="width: 120px">
        </el-date-picker>
        <el-button type="primary" @click="queryInstock">查询</el-button>

        <el-table :data="tableList" stripe>
            <el-table-column label="入库单据数" prop="total"></el-table-column>
            <el-table-column label="产品总数量" prop="totalNum"></el-table-column>
            <el-table-column label="产品总金额" prop="productTotal"></el-table-column>
        </el-table>

        <el-table :data="tableListIn" border stripe height="400px" size="mini">
            <el-table-column prop="poId" label="采购单编号"></el-table-column>
            <el-table-column prop="stockTime" label="入库日期"></el-table-column>
            <el-table-column prop="productCode" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="stockNum" label="产品数"></el-table-column>
            <el-table-column prop="productTotal" label="产品总金额"></el-table-column>
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
                tableList: [{ productTotal: '', total: '', totalNum: '' }],
                currentPage: 1,
                total: 0,
                tableListIn: [],
            }
        },
        methods: {
            queryInstock() {
                this.$axios.get(`/api/main/report/instock/main?time=${this.searchDate}&page=${this.currentPage}`).then(res => {
                    // console.log(res.data)
                    if (res.data.total == 0) {
                        this.tableList[0].productTotal = this.tableList[0].total = this.tableList[0].totalNum = '无记录'
                    } else {
                        this.tableList[0].productTotal = (res.data.productTotal).toFixed(2)
                        this.tableList[0].total = res.data.total
                        this.tableList[0].totalNum = res.data.totalNum
                        this.tableListIn = res.data.details.list
                        this.total = res.data.details.total
                    }
                })
            },
            current_change(current) {
                this.currentPage = current
                this.queryInstock()
            }
        },
    }
</script>

<style></style>