<template>
    <div>
        <el-date-picker v-model="searchDate" type="daterange" range-separator="~" start-placeholder="开始日期"
            end-placeholder="结束日期" style="width: 200px" clearable value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-select v-model="ruleForm.type" style="width:100px">
            <el-option value="收入"></el-option>
            <el-option value="支出"></el-option>
        </el-select>
        <el-select v-model="ruleForm.payType" placeholder="选择付款方式" style="width:150px">
            <el-option value="1" label="货到付款"></el-option>
            <el-option value="2" label="款到发货"></el-option>
            <el-option value="3" label="预付款到发货"></el-option>
        </el-select>
        <el-input v-model="ruleForm.no" placeholder="请输入单据号" prefix-icon="el-icon-search" style="width: 150px">
        </el-input>
        <el-button type="primary" @click="getPR" icon="el-icon-search">查询</el-button>

        <el-table :data="tableList" stripe size="mini" height='410px'>
            <el-table-column prop="payTime" label="收(付)款日期"></el-table-column>
            <el-table-column prop="ordercode" label="相关单据号"></el-table-column>
            <el-table-column prop="payPrice" label="收(付)款金额"></el-table-column>
            <el-table-column prop="account" label="经手人"></el-table-column>
            <el-table-column prop="payType" label="单据付款方式">
                <template slot-scope="scope">
                    {{typeFun(scope.row.payType)}}
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
    const qs = require('querystring')
    export default {
        data() {
            return {
                searchDate: '',
                ruleForm: {
                    startDate: '',
                    endDate: '',
                    type: '收入',
                    payType: '',
                    no: '',
                    page: 1,
                },
                tableList:[],
                total:0,
            }
        },
        methods: {
            typeFun(val){
                switch(val){
                    case 1 : return '货到付款'
                    case 2 : return '款到发货'
                    case 3 : return '预付款到发货'
                }
            },
            getPR(){
                this.ruleForm.startDate = this.searchDate[0]
                this.ruleForm.endDate = this.searchDate[1]
                this.$axios.post('/api/main/finance/query',qs.stringify(this.ruleForm)).then(res=>{
                    console.log(res.data)
                    this.tableList = res.data.list
                    this.total = res.data.total
                })
            },
            current_change(current){
                this.ruleForm.page = current
                this.getPR()
            },

        },
        // watch: {
        //     $route:{
        //         handler:function(){
        //             this.getPR()
        //         }   
        //     },
        //     immediate:true
        // },
    }
</script>

<style>
</style>