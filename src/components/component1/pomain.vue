<template>
    <div>
        <el-button type="success" @click="addPomain" size='small' icon="el-icon-plus">新添采购单</el-button>
        <el-table :data="tableList" stripe width="100%" v-loading="loading" size="mini" height="420px">
            <el-table-column prop="poId" label="采购单编号" width="150px">
                <template slot-scope="scope">
                    <el-button type="text" @click="openDialog(scope.row,scope.$index)">{{scope.row.poId}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="venderName" label="供应商名称"></el-table-column>
            <el-table-column prop="account" label="创建人" width="60px"></el-table-column>
            <el-table-column prop="tipFee" label="附加费用" width="70px"></el-table-column>
            <el-table-column prop="productTotal" label="产品总价"></el-table-column>
            <el-table-column prop="poTotal" label="采购总价"></el-table-column>
            <el-table-column prop="payType" label="付款方式">
                <template slot-scope="scope">
                    {{paytype(scope.row.payType)}}
                </template>
            </el-table-column>
            <el-table-column prop="prePayFee" label="最低预付款"></el-table-column>
            <el-table-column prop="status" label="采购单状态">
                <template slot-scope="scope">
                    {{scope.row.status==1?'新增':''}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
                <template slot-scope="scope">
                    {{scope.row.remark==''?'无':scope.row.remark}}
                </template>
            </el-table-column>
            <el-table-column width="100px" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit-outline" @click="openEdit(scope.row)"></el-button>
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
        <el-dialog title="采购单明细信息" :visible.sync="dialogMX">
            <el-table :data="tableListMX" stripe >
                <el-table-column prop="productCode" label="产品编号"></el-table-column>
                <el-table-column prop="productName" label="产品名称"></el-table-column>
                <el-table-column prop="unitPrice" label="采购单价"></el-table-column>
                <el-table-column prop="num" label="产品数量"></el-table-column>
                <el-table-column prop="unitName" label="数量单位"></el-table-column>
            </el-table>
        </el-dialog>

        <!-- 编辑的dialog -->
        <el-dialog title="编辑采购单" :visible.sync="dialogEdit" width="75%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="120px" size="mini" >
                <el-form-item class="poBtn">
                    <el-button type="primary" @click="addPoitem" size="small" icon="el-icon-plus">添加采购单明细
                    </el-button>
                    <el-button @click="submitform('ruleForm')" type="success" size="small" icon="el-icon-finished">保存
                    </el-button>
                </el-form-item>

                <el-form-item label="采购单编号" prop="poId">
                    <el-input :value='ruleForm.poId' readonly></el-input>
                </el-form-item>
                <el-form-item label="供应商编号" prop="venderCode">
                    <el-input v-model="ruleForm.venderCode" readonly></el-input>
                </el-form-item>
                <div style="width: 300px">
                    <el-button type="text" @click="openDialogS" size="small">
                        选择供应商
                    </el-button>
                </div>
                <el-form-item label="创建人" prop="account">
                    <el-input v-model="ruleForm.account" readonly></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-input :value='ruleForm.createTime' readonly></el-input>
                </el-form-item>
                <el-form-item label="附加费用" prop="tipFee">
                    <el-input v-model="ruleForm.tipFee" @input="changeTipFee"></el-input>
                </el-form-item>
                <el-form-item label="产品总价">
                    <el-input v-model="ruleForm.productTotal" readonly>
                    </el-input>
                </el-form-item>
                <el-form-item label="采购总价">
                    <el-input v-model="ruleForm.poTotal" readonly></el-input>
                </el-form-item>
                <el-form-item label="付款方式" prop="payType">
                    <el-select v-model="ruleForm.payType" placeholder="请选择付款方式" style="width: 177px"
                        @change="changePayType">
                        <el-option label="货到付款" value="1"></el-option>
                        <el-option label="款到发货" value="2"></el-option>
                        <el-option label="预付款到发货" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最低预付款" prop="prePayFee">
                    <el-input v-model="ruleForm.prePayFee" :readonly="read" @input="myPreFee(ruleForm.prePayFee)">
                    </el-input>
                </el-form-item>
                <el-form-item label="采购单状态">
                    <el-input placeholder="新增" v-model="ruleForm.status" readonly></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="ruleForm.remark"></el-input>
                </el-form-item>

                <el-form-item label="采购单明细" style="width: 95%" prop='poitems'>
                    <el-table :data="ruleForm.poitems" stripe size="mini">
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column prop="productCode" label="产品编号">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.productCode" readonly>
                                    <el-button slot="append" icon="el-icon-edit" @click="openProduct(scope.$index)">
                                    </el-button>
                                </el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="productName" label="产品名称">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.productName" readonly></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="unitPrice" label="产品单价">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.unitPrice"
                                    @input="changePrice(scope.row.unitPrice,scope.$index)"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="num" label="产品数量">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.num" @input="changeNum(scope.row.num,scope.$index)">
                                </el-input>
                            </template>
                        </el-table-column>

                        <el-table-column prop="unitName" label="数量单位">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.unitName" readonly></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="itemPrice" label="明细总价">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.itemPrice" readonly></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column width="50px" label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="deletePoitems(scope.row,scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 打开供应商的弹窗 -->
        <el-dialog title="供应商列表" :visible.sync="dialogTable">
            <el-input placeholder="请输入编号" prefix-icon="el-icon-search" v-model="searchid" style="width: 320px"
                size="mini">
            </el-input>
            <el-row style="margin-top: 5px">
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
                        @current-change="current_changePo">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 打开产品列表的弹窗 -->
        <el-dialog title="产品列表" :visible.sync="dialogProduct">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="returnChoosePro">选 择</el-button>
                    <el-button type="info" @click="cancleChoosePro">取 消</el-button>
                </el-col>
            </el-row>
            <el-table :data="productTable" @row-click="chooseProduct" :highlight-current-row="light" size="mini">
                <el-table-column property="productCode" label="产品编号">
                </el-table-column>
                <el-table-column property="name" label="产品名称">
                </el-table-column>
                <el-table-column property="price" label="产品单价">
                </el-table-column>
                <el-table-column property="unitName" label="数量单位"></el-table-column>
            </el-table>
            <el-row>
                <el-col :span="4" :offset="18">
                    <el-pagination background layout="prev, pager, next" :total="totalPro"
                        @current-change="current_changePro">
                    </el-pagination>
                </el-col>
            </el-row>
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

                ruleForm: {
                    poId: '',
                    venderCode: '',
                    account: Cookies.get('username'),
                    createTime: '',
                    tipFee: 0,
                    productTotal: '',
                    poTotal: '',
                    payType: '',
                    prePayFee: 0,
                    status: '',
                    remark: '',
                    poitems: []
                },
                read: true,
                light: true,
                //供应商部分
                code: '',
                dialogTable: false,
                total: 0,
                searchid: '',
                currentPage: 1,
                suppTable: [],
                //产品部分
                index: 0,
                dialogProduct: false,
                currentPagePro: 1,
                totalPro: 0,
                priceNum: [],
                productTable: [],
                productObj: {
                    productCode: '',
                    unitPrice: '',
                    unitName: '',
                    productName: '',
                    price: ''
                },
                rules: {
                    venderCode: [{ required: true, message: '请选择供应商', triggle: 'blur' }],
                    payType: [{ required: true, message: '请选择付款方式', triggle: 'change' }],
                    prePayFee: [{ required: true, message: '预付款不能为空', triggle: 'blur' }],
                    tipFee: [{ required: true, message: '附加费用不能为空', triggle: 'blur' }],
                    product: [{ required: true, message: '单价不能为空', triggle: 'blur' }],
                },
            }
        },
        methods: {
            //增加采购单
            addPomain() {
                this.$router.push({ path: '/buy/pomain/addpomain' })
            },
            //获取采购单信息
            getPomain() {
                this.$axios.get(`/api/main/purchase/pomain/show?page=${this.currentPage}&type=1`).then(res => {
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
                    this.$confirm('确认删除该采购单？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios.get(`/api/main/purchase/pomain/delete?page=${this.currentPage}&poId=${row.poId}`).then(resp => {
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
                        message: '只能删除自己的采购单'
                    })
                }
            },
            //修改
            openEdit(row) {
                this.ruleForm = row
                if (row.account == Cookies.get('username')) {
                    this.dialogEdit = true
                    this.$axios.get(`/api/main/purchase/pomain/queryItem?poId=${row.poId}`).then(res => {
                        this.ruleForm.poitems = res.data
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '只能编辑自己的采购单'
                    })
                    this.dialogEdit = false
                }
            },
            //打开明细
            openDialog(row, index) {
                this.dialogMX = true;
                this.$axios.get(`/api/main/purchase/pomain/queryItem?poId=${row.poId}`).then(res => {
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
                this.$axios.get(`/api/main/purchase/pomain/show?page=${this.currentPage}&type=1`).then(res => {
                    this.tableList = res.data.list;
                    this.total = res.data.total;
                    this.currentPage = res.data.pageNum
                })
            },


            //计算产品总价
            allTotal() {
                this.ruleForm.productTotal = 0
                this.ruleForm.poitems.forEach(element => {
                    this.ruleForm.productTotal += Number(element.itemPrice)
                });

            },
            //计算采购总价
            pomainTotal() {
                this.ruleForm.poTotal = 0
                this.ruleForm.poTotal = Number(this.ruleForm.productTotal) + Number(this.ruleForm.tipFee)
                // console.log(this.ruleForm.poitems.tipFee)
            },
            //附加费用改变，总价改变
            changeTipFee() {
                this.pomainTotal()
            },
            //数量、采购单价改变，总价格改变
            changeNum(num, index) {
                this.ruleForm.poitems[index].itemPrice = (num * this.ruleForm.poitems[index].unitPrice).toFixed(2)
                this.allTotal()
                this.pomainTotal()
            },
            changePrice(price, index) {
                this.ruleForm.poitems[index].itemPrice = (price * this.ruleForm.poitems[index].num).toFixed(2)
                this.allTotal()
                this.pomainTotal()
            },
            //添加产品明细
            addPoitem() {
                let newPoitem = {
                    poId: this.ruleForm.poId,
                    productCode: '',
                    unitPrice: '',
                    num: '',
                    unitName: '',
                    itemPrice: '',
                    productName: ''
                }
                this.ruleForm.poitems.push(newPoitem)
            },
            //改变付款方式。预付款发生改变
            changePayType() {
                if (this.ruleForm.payType == 3) {
                    this.read = false
                } else {
                    this.read = true
                    this.ruleForm.prePayFee = '0'
                }
            },
            //添加产品-打开dialog框
            openProduct(index) {
                this.$axios.get(`/api/main/sell/product/show?page=${this.currentPagePro}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.index = index;
                        this.productTable = res.data.list;
                        this.totalPro = res.data.total;
                        this.dialogProduct = true
                    }
                })
            },
            //选中某项产品时
            chooseProduct(row) {
                console.log(row)
                this.productObj.productCode = row.productCode;
                this.productObj.unitName = row.unitName
                this.productObj.productName = row.name
                this.productObj.price = row.price
            },
            //确认选择。并返回产品
            returnChoosePro() {
                this.ruleForm.poitems[this.index].productCode = this.productObj.productCode
                this.ruleForm.poitems[this.index].unitName = this.productObj.unitName
                this.ruleForm.poitems[this.index].productName = this.productObj.productName
                this.priceNum.push(this.productObj.price)
                this.dialogProduct = false
            },
            //预付款必须低于产品总价的20%
            myPreFee(preFee) {
                if (preFee > this.ruleForm.productTotal / 5) {
                    this.$message({
                        type: 'error',
                        message: '预付款不能超过20%'
                    })
                    this.ruleForm.prePayFee = 0;
                }
            },
            //删除产品明细
            deletePoitems(row, index) {
                this.ruleForm.poitems.splice(index, 1)
                this.priceNum.splice(index, 1)
            },
            //产品分页
            current_changePro(currentPagePro) {
                this.currentPagePro = currentPagePro
                this.$axios.get(`/api/main/sell/product/show?page=${this.currentPagePro}`).then(res => {
                    this.productTable = res.data.list;
                    this.totalPro = res.data.total;
                })
            },
            //取消选择
            cancleChoosePro() {
                this.productObj.productCode = this.ruleForm.poitems[this.index].productCode
                this.productObj.productName = this.ruleForm.poitems[this.index].productName
                this.productObj.unitName = this.ruleForm.poitems[this.index].unitName
                this.productObj.price = this.priceNum[this.index]
                this.dialogProduct = false
            },
            //提交保存
            submitform(formName) {
                this.ruleForm.poitems.forEach(item => {
                    if (item.unitPrice == '' || item.num == '') {
                        this.$message({
                            message: '产品数量或单价不能为空',
                            type: 'warning'
                        })
                    } else {
                        this.$refs[formName].validate(valid => {
                            if (valid) {
                                this.$confirm('确定修改此采购单?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'success'
                                }).then(() => {
                                    this.$axios({
                                        url: '/api/main/purchase/pomain/update',
                                        method: 'post',
                                        data: JSON.stringify(this.ruleForm),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(resp => {
                                        // console.log(resp.data)
                                        if (resp.data.status == 2) {
                                            this.$message({
                                                message: '修改成功',
                                                type: 'success'
                                            });
                                        }
                                        this.dialogEdit = false
                                        console.log(this.ruleForm)
                                    })
                                }).catch(() => {
                                    this.$message({
                                        message: '已取消',
                                        type: 'warning'
                                    })
                                })
                            } else {
                                this.$message.error('输入格式有误');
                            }
                        })
                    }
                })
            },
            //添加供应商
            openDialogS() {
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPagePo}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            message: '会话过期',
                            type: "error"
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.suppTable = res.data.list;
                        this.total = res.data.total;
                        this.dialogTable = true
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
            current_changePo(currentPage) {
                this.currentPagePo = currentPage
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPagePo}`).then(res => {
                    this.suppTable = res.data.list;
                    this.total = res.data.total;
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
            'searchid': function () {
                this.$axios.get(`/api/main/purchase/vender/show?venderCode=${this.searchid}&page=${this.currentPagePo}`).then(resp => {
                    this.suppTable = resp.data.list
                    this.total = resp.data.total
                })
            },
        },
        // created() {
        //     this.ruleForm.createTime = this.$method.getTime();
        //     this.ruleForm.poId = this.$method.timeId();
        // },
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