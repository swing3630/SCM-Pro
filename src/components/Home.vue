<template>
    <div>
        <el-container>
            <el-aside style="max-width: 200px">

                <el-menu router :collapse="isCollapse" background-color="#545c64" text-color="#fff"
                    active-text-color="#ffd04b" style="height: 100%;max-width: 199px;min-height: 700px"
                    :default-active="$route.path">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-user"></i>
                            <span slot="title">系统管理</span>
                        </template>
                        <el-menu-item index="/user">用户管理</el-menu-item>
                        <el-menu-item index="/" @click="removeCookie">退出系统</el-menu-item>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-truck"></i>
                            <span slot="title">采购管理</span>
                        </template>
                        <el-menu-item index="/buy/supplier">供应商管理</el-menu-item>
                        <el-menu-item index="/buy/pomain">新添采购单</el-menu-item>
                        <el-menu-item index="/buy/pomainover">采购单了结</el-menu-item>
                        <el-menu-item index="/buy/pomainsearch">采购单查询</el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-shopping-cart-full"></i>
                            <span slot="title">仓储管理</span>
                        </template>
                        <el-menu-item index="/goods/instock">入库登记</el-menu-item>
                        <el-menu-item index="/goods/outstock">出库登记</el-menu-item>
                        <el-menu-item index="/goods/checkstock">库存盘点</el-menu-item>
                        <el-menu-item index="/goods/querystock">库存查询</el-menu-item>
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-coin"></i>
                            <span slot="title">财务收支</span>
                        </template>
                        <el-menu-item index="/money/receipt">收款登记</el-menu-item>
                        <el-menu-item index="/money/pay">付款登记</el-menu-item>
                        <el-menu-item index="/money/querypr">收支查询</el-menu-item>
                    </el-submenu>

                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-s-shop"></i>
                            <span slot="title">销售管理</span>
                        </template>
                        <el-menu-item index="/cell/category">产品分类管理</el-menu-item>
                        <el-menu-item index="/cell/product">产品管理</el-menu-item>
                        <el-menu-item index="/cell/customer">客户管理</el-menu-item>
                        <el-menu-item index="/cell/somain">新添销售单</el-menu-item>
                        <el-menu-item index="/cell/somainover">销售单了结</el-menu-item>
                        <el-menu-item index="/cell/somainsearch">销售单查询</el-menu-item>
                    </el-submenu>

                    <el-submenu index="6">
                        <template slot="title">
                            <i class="el-icon-notebook-2"></i>
                            <span slot="title">业务报表</span>
                        </template>
                        <el-menu-item index="/report/pomain">月度采购报表</el-menu-item>
                        <el-menu-item index="/report/payment">月度收支登记表</el-menu-item>
                        <el-menu-item index="/report/instock">月度入库报表</el-menu-item>
                        <el-menu-item index="/report/outstock">月度出库报表</el-menu-item>
                        <el-menu-item index="/report/stock">产品库存报表</el-menu-item>
                        <el-menu-item index="/report/somain">月度销售报表</el-menu-item>
                    </el-submenu>

                    <el-submenu index="7">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span slot="title">网上销售</span>
                        </template>
                        <el-menu-item index="">客户注册</el-menu-item>
                        <el-menu-item index="">商品展示</el-menu-item>
                        <el-menu-item index="">网上下单</el-menu-item>
                    </el-submenu>
                </el-menu>

            </el-aside>
            <el-container>
                <el-header height="80px" style="background-color:#409EFF">
                    <div class="header-left">
                        <div @click="setCollapse">
                            <el-button v-if="!isCollapse" style="padding: 5px">
                                <i class="el-icon-s-fold"></i>
                            </el-button>
                            <el-button v-else style="padding: 5px">
                                <i class="el-icon-s-unfold"></i>
                            </el-button>
                        </div>
                        <img src="../assets/logo.png" height="80px" style="vertical-align: middle;padding-left: 10px;">
                    </div>

                    <div class="header-right">
                        <span class="el-icon-timer">系统时间:{{sysTime}}</span>
                        <span v-show="account" style="font-weight:500">{{account}}</span>
                        <el-dropdown>
                            <span class="el-icon-caret-bottom" style="font-size: 16px"></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <router-link to="/index" class="router-a">
                                        首页
                                    </router-link>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <router-link to="/" class="router-a" v-show="account" @click.native="removeCookie">
                                        退出登录
                                    </router-link>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                </el-header>
                <el-main style="padding:5px 0 0 5px">
                    <div class="crumbs">
                        <Crumbs></Crumbs>
                    </div>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import Crumbs from './Crumbs'
    export default {
        components: {
            Crumbs
        },
        data() {
            return {
                isCollapse: false,
                sysTime: null,
            }
        },
        computed: {
            ...mapState(['account'])
        },
        methods: {
            ...mapActions(['removeCookie']),
            //展开收起导航
            setCollapse() {
                this.isCollapse = !this.isCollapse
            },
        },
        //第一次登陆则有数据
        beforeCreate() {
            this.$axios.defaults.headers.common['Authorization'] = this.$store.state.account
        },
        created() {
            const that = this
            setInterval(function () {
                that.sysTime = that.$method.getTime()
            }, 1000)
        },
    }
</script>

<style scoped>
    .el-header {
        display: flex;
        justify-content: space-between;
        padding-left: 2px;
        color: rgb(219, 217, 217);
    }

    .header-left {
        height: 70px;
        line-height: 70px;
        display: flex;
    }

    .header-right {
        margin-top: 35px;
        height: 30px;
        line-height: 30px;
        font-size: 1em;
        padding-left: 5px;
    }

    .router-a {
        text-decoration: none;
    }
</style>