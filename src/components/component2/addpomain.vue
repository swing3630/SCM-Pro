<template>
    <div>
        <div style="margin-top: 10px">
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 采购单信息</span>
                    <el-form :model="ruleForm" ref="ruleForm" label-width="120px" size="mini" :rules="rules">

                        <el-form-item class="poBtn">
                            <el-button type="primary" @click="addPoitem" size="small" icon="el-icon-plus">添加采购单明细
                            </el-button>
                            <el-button @click="submitform('ruleForm')" type="success" size="small"
                                icon="el-icon-finished">保存</el-button>
                        </el-form-item>

                        <el-form-item label="采购单编号" prop="poId">
                            <el-input :value='ruleForm.poId' readonly></el-input>
                        </el-form-item>
                        <el-form-item label="供应商编号" prop="venderCode">
                            <el-input v-model="ruleForm.venderCode" readonly></el-input>
                        </el-form-item>
                        <div style="width: 300px">
                            <el-button type="text" @click="openDialog" size="small">
                                选择供应商
                            </el-button>
                        </div>

                        <!-- 打开供应商的弹窗 -->
                        <el-dialog title="供应商列表" :visible.sync="dialogTable">
                            <el-input placeholder="请输入编号" prefix-icon="el-icon-search" v-model="searchid"
                                style="width: 320px" size="mini">
                            </el-input>
                            <el-row style="margin-top: 5px">
                                <el-col>
                                    <el-button type="primary" @click="returnChoose" size='mini'>选 择</el-button>
                                    <el-button type="info" @click="cancleChoose" size='mini'>取 消</el-button>
                                </el-col>
                            </el-row>
                            <el-table :data="suppTable" @row-click="chooseSupp" :highlight-current-row="light"
                                size="mini">
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
                            <el-input v-model="ruleForm.prePayFee" :readonly="read"
                                @input="myPreFee(ruleForm.prePayFee)"></el-input>
                        </el-form-item>
                        <el-form-item label="采购单状态">
                            <el-input placeholder="新增" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="ruleForm.remark"></el-input>
                        </el-form-item>

                        <el-form-item label="采购单明细" style="width: 90%" prop='poitems'>
                            <el-table :data="ruleForm.poitems" stripe size="mini">
                                <el-table-column type="index" width="50" label="序号"></el-table-column>
                                <el-table-column prop="productCode" label="产品编号">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.productCode" readonly>
                                            <el-button slot="append" icon="el-icon-edit"
                                                @click="openProduct(scope.$index)">
                                            </el-button>
                                        </el-input>
                                        <!-- 打开产品列表的弹窗 -->
                                        <el-dialog title="产品列表" :visible.sync="dialogProduct">
                                            <el-row>
                                                <el-col>
                                                    <el-button type="primary" @click="returnChoosePro">选 择</el-button>
                                                    <el-button type="info" @click="cancleChoosePro">取 消</el-button>
                                                </el-col>
                                            </el-row>
                                            <el-table :data="productTable" @row-click="chooseProduct"
                                                :highlight-current-row="light" size="mini">
                                                <el-table-column property="productCode" label="产品编号">
                                                </el-table-column>
                                                <el-table-column property="name" label="产品名称">
                                                </el-table-column>
                                                <el-table-column property="price" label="产品单价">
                                                </el-table-column>
                                                <el-table-column property="unitName" label="数量单位"></el-table-column>
                                            </el-table>
                                            <el-row>
                                                <el-col>
                                                    <el-pagination background layout="prev, pager, next"
                                                        :total="totalPro" @current-change="current_changePro">
                                                    </el-pagination>
                                                </el-col>
                                            </el-row>
                                        </el-dialog>
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
                                        <el-input v-model="scope.row.num"
                                            @input="changeNum(scope.row.num,scope.$index)">
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
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    const qs = require('querystring')
    export default {
        data() {
            return {
                ruleForm: {
                    poId: '',
                    venderCode: '',
                    account: Cookies.get('username'),
                    createTime: '',
                    tipFee: '0',
                    productTotal: '',
                    poTotal: '',
                    payType: '',
                    prePayFee: '0',
                    status: '1',
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
                                this.$confirm('确定添加此采购单?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'success'
                                }).then(() => {
                                    this.$axios({
                                        url: '/api/main/purchase/pomain/add',
                                        method: 'post',
                                        data: JSON.stringify(this.ruleForm),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    }).then(resp => {
                                        // console.log(resp.data)
                                        if (resp.data.status == 2) {
                                            this.$message({
                                                message: '添加成功',
                                                type: 'success'
                                            });
                                        }
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
            openDialog() {
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPage}`).then(res => {
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
            current_change(currentPage) {
                this.currentPage = currentPage
                this.$axios.get(`/api/main/purchase/vender/show?page=${this.currentPage}`).then(res => {
                    this.suppTable = res.data.list;
                    this.total = res.data.total;
                })
            },
        },
        watch: {
            'searchid': function () {
                this.$axios.get(`/api/main/purchase/vender/show?venderCode=${this.searchid}&page=${this.currentPage}`).then(resp => {
                    this.suppTable = resp.data.list
                    this.total = resp.data.total
                })
            },
        },
        created() {
            this.ruleForm.createTime = this.$method.getTime();
            this.ruleForm.poId = this.$method.timeId();
        },
    }
</script>

<style scoped>
    .el-tabs {
        margin: 10px auto;
    }

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