<template>
    <div>
        <el-date-picker v-model="searchDate" type="month" placeholder="选择日期" value-format="yyyy-MM"
            style="width: 120px">
        </el-date-picker>
        <el-button type="primary" @click="queryStock">查询</el-button>
        <p v-show="totalNum != ''">总库存数：<span>{{totalNum}}</span></p>

        <el-table :data="tableList" border stripe height="400px" size="mini">
            <el-table-column prop="ProductCode" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="num" label="库存数"></el-table-column>
        </el-table>
        <el-row>
            <el-col :span="24" style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total"
                    @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                searchDate:'',
                currentPage:1,
                total:0,
                totalNum:'',
                tableList:[],
            }
        },
        methods: {
            queryStock(){
                this.$axios.get(`/api/main/report/stock/main?time=${this.searchDate}&page=${this.currentPage}`).then(res=>{
                    console.log(res.data)
                    this.totalNum = res.data.totalNum
                    this.tableList = res.data.details.list
                    this.total = res.data.details.total
                })
            },
            current_change(current){
                this.currentPage = current 
                this.queryStock()
            }
        },
    }
</script>

<style></style>