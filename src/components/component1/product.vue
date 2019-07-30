<template>
    <div>
        <el-input placeholder="请输入产品编号" prefix-icon="el-icon-search" v-model="searchid" style="width: 150px">
        </el-input>
        <el-input placeholder="请输入产品名称" prefix-icon="el-icon-search" v-model="searchname" style="width: 150px">
        </el-input>
        <el-input v-model="searchcategoryId" readonly placeholder="选择产品分类" style="width: 180px">
            <el-button slot="append" icon="el-icon-edit" @click="openNewCategroy">
            </el-button>
        </el-input>

        <el-button type="primary" @click="openAdd">添加产品</el-button>

        <el-table :data="productList" stripe max-height="520px" size="mini">
            <el-table-column prop="productCode" label="产品编号"></el-table-column>
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="unitName" label="数量单位"></el-table-column>
            <el-table-column prop="categoryName" label="分类名称"></el-table-column>
            <el-table-column prop="createDate" label="添加日期"></el-table-column>
            <el-table-column prop="price" label="销售价"></el-table-column>
            <el-table-column prop="remark" label="产品描述" width="100px">
                <template slot-scope="scope">
                    {{scope.row.remark ==''? '无':scope.row.remark}}
                </template>
            </el-table-column>
            <el-table-column width="190px" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="editProduct(scope.row)">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" circle
                        @click="deleteProduct(scope.row,scope.$index)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col style="text-align: right">
                <el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 编辑的dialog -->
        <el-dialog title="编辑产品信息" :visible.sync="dialogsell" width="500px">
            <el-form :model="ruleForm" label-width="100px" ref="ruleForm" size="mini">
                <el-form-item label="产品编号">
                    <el-input v-model="ruleForm.productCode" readonly></el-input>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="产品分类">
                    <el-input v-model="ruleForm.categoryId" readonly>
                        <el-button slot="append" icon="el-icon-edit" @click="openCategroy">
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价">
                    <el-input v-model="ruleForm.price"></el-input>
                </el-form-item>
                <el-form-item label="数量单位">
                    <el-input v-model="ruleForm.unitName"></el-input>
                </el-form-item>
                <el-form-item label="添加日期">
                    <el-input v-model="ruleForm.createDate" readonly></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="ruleForm.remark"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="cancelEdit">取 消</el-button>
                    <el-button type="primary" @click="edit('ruleForm')">修 改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 选择产品分类的dialog -->
        <el-dialog title="产品分类列表" :visible.sync="dialogCate" width="500px">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="editCate" size="mini">选 择</el-button>
                    <el-button type="info" @click="defaCate" size="mini">取 消</el-button>
                </el-col>
            </el-row>
            <el-table :data="categoryTable" @row-click="chooseRow" :highlight-current-row="light=true" size="mini"
                height="300px">
                <el-table-column property="name" label="产品分类名称">
                </el-table-column>
                <el-table-column property="categoryId" label="产品分类编号">
                </el-table-column>
            </el-table>
            <el-row>
                <el-col>
                    <el-pagination background layout="prev, pager, next" :total="totalCate"
                        @current-change="current_changeCate">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 筛选dialog -->
        <el-dialog title="产品分类列表" :visible.sync="dialogNewCate" width="500px">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="editNewCate" size="mini">选 择</el-button>
                    <el-button type="info" @click="defaNewCate" size="mini">取 消</el-button>
                </el-col>
            </el-row>
            <el-table :data="categoryTable" @row-click="chooseNewRow" :highlight-current-row="light=true" size="mini"
                height="300px">
                <el-table-column property="name" label="产品分类名称">
                </el-table-column>
                <el-table-column property="categoryId" label="产品分类编号">
                </el-table-column>
            </el-table>
            <el-row>
                <el-col>
                    <el-pagination background layout="prev, pager, next" :total="totalCate"
                        @current-change="current_changeCate">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-dialog>
        <!-- 添加产品 -->
        <el-dialog title="添加产品信息" :visible.sync="dialogAdd" width="500px">
            <el-form :model="ruleForm2" label-width="100px" ref="ruleForm2" size="mini">
                <el-form-item label="产品编号">
                    <el-input v-model="ruleForm2.productCode"></el-input>
                </el-form-item>
                <el-form-item label="产品名称">
                    <el-input v-model="ruleForm2.name"></el-input>
                </el-form-item>
                <el-form-item label="产品分类">
                    <el-input v-model="ruleForm2.categoryId" readonly>
                        <el-button slot="append" icon="el-icon-edit" @click="openCategroy">
                        </el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价">
                    <el-input v-model="ruleForm2.price"></el-input>
                </el-form-item>
                <el-form-item label="数量单位">
                    <el-input v-model="ruleForm2.unitName"></el-input>
                </el-form-item>
                <el-form-item label="添加日期">
                    <el-input v-model="ruleForm2.createDate" readonly></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="ruleForm2.remark"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button @click="cancelAdd">取 消</el-button>
                    <el-button type="primary" @click="add('ruleForm2')">添 加</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    const qs = require('querystring')
    export default {
        data() {
            return {
                searchid: '',
                searchname: '',
                searchcategoryId: '',
                productList: [],
                categoryTable: [],
                currentPage: 1,
                total: 0,
                dialogsell: false,
                dialogCate: false,
                dialogNewCate: false,
                dialogAdd: false,
                ruleForm: {
                    productCode: '',
                    name: '',
                    unitPrice: '',
                    categoryId: '',
                    createDate: '',
                    unitName: '',
                    remark: '',
                },
                ruleForm2: {
                    productCode: '',
                    name: '',
                    unitPrice: '',
                    categoryId: '',
                    createDate: '',
                    unitName: '',
                    remark: '',
                },
                caId: '',
                //产品分类
                totalCate: 0,
                pageCate: 1,
            }
        },
        methods: {
            //获取产品
            getProduct() {
                this.$axios.get(`/api/main/sell/product/show?page=${this.currentPage}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        this.total = res.data.total
                        this.productList = res.data.list
                        // console.log(this.productList)
                    }
                })
            },
            //分页
            current_change(currentPage) {
                this.currentPage = currentPage;
                this.getProduct();
            },
            //删除产品
            deleteProduct(row, index) {
                this.$confirm('确定删除此产品?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    this.$axios.get(`/api/main/sell/product/delete?productCode=${row.productCode}`).then(resp => {
                        if (resp.data.status == 2) {
                            this.productList = resp.data.data
                            // this.getCategory()
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '无法删除此产品'
                            })
                        }
                    })
                })
            },
            // 修改产品
            editProduct(row) {
                this.dialogsell = true
                this.ruleForm = row
            },
            //打开添加产品的dialog
            openAdd() {
                this.dialogAdd = true
                this.ruleForm2.createDate = this.$method.getDate()
            },
            //分类-打开分类的dialog
            openCategroy() {
                this.dialogCate = true
                this.$axios.get(`/api/main/sell/category/show?page=${this.pageCate}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        console.log(res.data)
                        this.categoryTable = res.data.list
                        this.pageCate = res.data.pageNum
                        this.totalCate = res.data.total
                    }
                })
            },
            //分类-产品分类的分页
            current_changeCate(currentPage) {
                this.pageCate = currentPage
                this.openCategroy()
            },
            //分类-选中行
            chooseRow(row) {
                this.caId = row.categoryId
            },
            //分类-选中
            editCate() {
                this.ruleForm.categoryId = this.caId
                this.ruleForm2.categoryId = this.caId
                this.dialogCate = false
            },
            //分类-取消
            defaCate() {
                this.caId = this.ruleForm.categoryId
                this.caId = this.ruleForm2.categoryId
                this.dialogCate = false
            },
            //筛选-打开分类的dialog
            openNewCategroy() {
                this.dialogNewCate = true
                this.$axios.get(`/api/main/sell/category/show?page=${this.pageCate}`).then(res => {
                    if (res.data.status == 1) {
                        this.$message({
                            type: 'error',
                            message: res.data.statusInfo
                        })
                        this.$router.push({ path: '/' })
                    } else {
                        console.log(res.data)
                        this.categoryTable = res.data.list
                        this.pageCate = res.data.pageNum
                        this.totalCate = res.data.total
                    }
                })
            },
            //筛选-产品分类的分页
            current_changeCate(currentPage) {
                this.pageCate = currentPage
                this.openCategroy()
            },
            //筛选-选中行
            chooseNewRow(row) {
                this.caId = row.categoryId
            },
            //筛选-选中
            editNewCate() {
                this.searchcategoryId = this.caId
                this.dialogNewCate = false
            },
            //筛选-取消
            defaNewCate() {
                this.caId = this.searchcategoryId
                this.dialogNewCate = false
            },

            //提交修改
            edit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定修改此信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            this.$axios.post('/api/main/sell/product/update', qs.stringify(this.ruleForm)).then(resp => {
                                if (resp.data.status == 2) {
                                    this.productList = resp.data.list
                                    this.getProduct()
                                    this.dialogsell = false
                                    this.$message({
                                        type: 'success',
                                        message: resp.data.statusInfo
                                    })
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: resp.data.statusInfo
                                    })
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            })
                        })
                    }
                })
            },
            cancelEdit() {
                this.dialogsell = false
                this.getProduct()
            },
            // 提交添加
            add(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$confirm('确定添加此信息?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            this.$axios.post('/api/main/sell/product/add', qs.stringify(this.ruleForm2)).then(resp => {
                                if (resp.data.status == 2) {
                                    this.productList = resp.data.list
                                    this.getProduct()
                                    this.dialogAdd = false
                                    this.$message({
                                        type: 'success',
                                        message: resp.data.statusInfo
                                    })

                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: '请确认提交的内容是否合规'
                                    })
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            })
                        })
                    }
                })
            },
            cancelAdd() {
                this.dialogAdd = false
                this.getProduct()
            },
            _search(a, b) {
                this.$axios.get(`/api/main/sell/product/show?${a}=${b}`).then(res => {
                    this.productList = res.data.list
                    this.total = res.data.total
                })
            },

        },
        watch: {
            'searchid': function () {
                this._search('productCode', this.searchid)
            },
            'searchname': function () {
                this._search('name', this.searchname)
            },
            'searchcategoryId': function () {
                this._search('categoryId', this.searchcategoryId)
            },
        },
        created() {
            this.getProduct()
        },
    }
</script>

<style></style>