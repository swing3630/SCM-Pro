<template>
    <div>
        <el-row>
            <el-col :span="6" v-show="account">
                <h4>{{account}}您好 欢迎使用本系统</h4>
                <p>登录时间:{{loginTime}}</p>
            </el-col>
            <el-col :span="6" v-show="!account">
                <router-link to="/">请先登录</router-link>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        computed: {
            ...mapState(['account', 'loginTime'])
        },
    }
</script>