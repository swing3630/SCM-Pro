<template>
    <div>
        <el-form :model="ruleForm" size="mini" :inline="true">
            <el-form-item>
                <el-input placeholder="请输入采购单编号" prefix-icon="el-icon-search" v-model="ruleForm.poId"
                    style="width: 150px">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="searchDate" type="daterange" range-separator="~" start-placeholder="开始日期"
                    end-placeholder="结束日期" style="width: 200px" clearable value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请选择供应商" v-model="ruleForm.venderCode" readonly style="width: 150px">
                    <el-button slot="append" icon="el-icon-search" @click="openSupp">
                    </el-button>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="ruleForm.payType" placeholder="请选择付款方式" style="width: 135px">
                    <el-option label="货到付款" value="1"></el-option>
                    <el-option label="款到发货" value="2"></el-option>
                    <el-option label="预付款到发货" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="ruleForm.status" placeholder="请选择采购单状态" style="width: 150px">
                    <el-option label="新增" value="1"></el-option>
                    <el-option label="已收货" value="2"></el-option>
                    <el-option label="已付款" value="3"></el-option>
                    <el-option label="已了结" value="4"></el-option>
                    <el-option label="已预付" value="5"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryPomian">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="pomainTable" stripe height="410px" @expand-change="expandRow" :row-key='getRowKeys'
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
            <el-table-column label="采购单编号" prop="poId" width="150px"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="100px"></el-table-column>
            <el-table-column label="供应商编号" prop="venderCode"></el-table-column>
            <el-table-column label="创建用户" prop="account"></el-table-column>
            <el-table-column label="附加费用" prop="tipFee"></el-table-column>
            <el-table-column label="采购产品总价" prop="productTotal"></el-table-column>
            <el-table-column label="采购单总价格" prop="poTotal"></el-table-column>
            <el-table-column label="付款方式" prop="payType">
                <template slot-scope="scope">
                    {{changePayType(scope.row.payType)}}
                </template>
            </el-table-column>
            <el-table-column label="处理状态" prop="status">
                <template slot-scope="scope">
                    {{changeStatus(scope.row.status)}}
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="totalPo"
                    @current-change="current_changePo">
                </el-pagination>
            </el-col>
        </el-row>

        <!-- 选择供应商的dialog -->
        <el-dialog title="供应商列表" :visible.sync="dialogTable">
            <el-row style="margin-top: 0">
                <el-col>
                    <el-button type="primary" @click="returnChoose" size='mini'>选 择</el-button>
                    <el-button type="info" @click="cancleChoose" size='mini'>取 消</el-button>
                </el-col>
            </el-row>
            <el-table :data="suppTable" @row-click="chooseSupp" :highlight-current-row="light" size="mini">
                <el-table-column property="venderCode" label="供应商编号"></el-table-column>
                <el-table-column property="name" label="供应商名"></el-table-column>
            </el-table>
            <el-row>
                <el-col>
                    <el-pagination background layout="prev, pager, next" :total="total"
                        @current-change="current_change">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>

    </div>
</template>
<script>
    const qs = require('querystring')
    export default {
        data() {
            return {
                pomainTable: [],
                searchDate: [],
                ruleForm: {
                    poId: '',
                    venderCode: '',
                    payType: '',
                    startDate: '',
                    endDate: '',
                    status: '',
                    page: '',
                },
                totalPo: 0,
                //供应商
                dialogTable: false,
                suppTable: [],
                currentPage: 1,
                total: 0,
                light: true,
                code: '',

                pomainList: [],
                expands: [],
                getRowKeys(row) {
                    return row.poId
                },
            }
        },
        methods: {
            //打开供应商对话框????
            openSupp() {
                // this.$method.openSupp()
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPage}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.dialogTable = true
                        this.suppTable = res.data.list;
                        this.total = res.data.total;
                    }
                })
            },
            //添加供应商--选中供应商相应的行
            chooseSupp(row) {
                this.code = row.venderCode
            },
            //添加供应商--赋值给ruleForm中
            returnChoose() {
                this.ruleForm.venderCode = this.code
                this.dialogTable = false
            },
            //添加供应商--取消选择不会改变编号的值
            cancleChoose() {
                this.dialogTable = false
                this.code = this.ruleForm.venderCode
            },
            //添加供应商--分页
            current_change(currentPage) {
                this.currentPage = currentPage
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPage}`).then(res => {
                    this.suppTable = res.data.list;
                    this.total = res.data.total;
                })
            },
            //打开明细的下拉表
            expandRow(row, expandedRows) {
                var that = this
                if (expandedRows.length) {
                    that.expands = []
                    if (row) {
                        that.expands.push(row.poId)
                        this.$axios.get(`/api/main/purchase/pomain/queryItem?poId=${row.poId}`).then(res => {
                            this.pomainList = res.data
                        })
                    }
                } else {
                    that.expands = []
                    this.$axios.get(`/api/main/purchase/pomain/queryItem?poId=${row.poId}`).then(res => {
                        this.pomainList = res.data
                    })
                }
            },
            //提交
            queryPomian() {
                if (this.searchDate) {
                    this.ruleForm.startDate = this.searchDate[0]
                    this.ruleForm.endDate = this.searchDate[1]
                } else {
                    this.ruleForm.startDate = ''
                    this.ruleForm.endDate = ''
                }
                this.$axios.post('/api/main/purchase/pomain/query', qs.stringify(this.ruleForm)).then(res => {
                    // console.log(res.data)
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        // console.log(res.data)
                        this.ruleForm.page = res.data.pageNum
                        this.pomainTable = res.data.list
                        this.totalPo = res.data.total
                    }
                }).catch()
            },
            changePayType(row) {
                switch (row) {
                    case 1: return '货到付款'; break;
                    case 2: return '款到发货'; break;
                    case 3: return '预付款到发货'; break;
                }
            },
            changeStatus(row) {
                switch (row) {
                    case 1: return '新增'; break;
                    case 2: return '已收货'; break;
                    case 3: return '已付款'; break;
                    case 4: return '已了结'; break;
                    case 5: return '已预付'; break;
                }
            },
            //查询分页
            current_changePo(currentPage) {
                this.ruleForm.page = currentPage
                this.queryPomian()
            },
        },
    }
</script>

<style scoped></style>