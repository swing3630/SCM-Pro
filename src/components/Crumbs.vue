<template>
    <div style="display: flex;height: 35px;box-shadow: 3px 3px 8px rgb(196, 193, 193);margin-bottom: 10px;">
        <span class="el-icon-location-information" style="padding-top: 15px;padding-left: 5px;font-size: 1em">当前位置：</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for ="item in crumbList" :key="item.path" :to="item.path" style="line-height: 45px">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                crumbList:null
            }
        },
        methods: {
            getCrumb(){
                const routeList=this.$route.name
                this.crumbList = routeList
            }
        },
        watch: {
            $route(){
                this.getCrumb()
            }
        },
        created() {
            this.getCrumb()
        },
    }
</script>