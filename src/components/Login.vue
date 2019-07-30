<template>
    <div>
        <div id="login">
            <el-row>
                <el-col :span="6" :offset="9" class="log">
                    <h3 style="width: 100%;text-align: center">Login From</h3>

                    <el-form :model="user" label-width="80px">
                        <el-form-item label="用户名:" prop="username" style="color: white">
                            <el-input v-model="user.username"></el-input>
                        </el-form-item>

                        <el-form-item label="密码:" prop="userpwd">
                            <el-input type='password' v-model="user.userpwd"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="onsubmit" style="width: 100%">登录</el-button>
                        </el-form-item>

                    </el-form>

                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    export default {
        data() {
            return {
                user: { username: '', userpwd: '' ,logTime: ''},     
            }        
        },
        methods: {
            
            onsubmit() {
                this.user.logTime = this.$method.getTime()
                //将user对象的值传给actions，若接收到成功的返回值，跳转路由
                this.$store.dispatch('check', this.user).then(resolve => {
                    this.$router.push({ path: '/index' })
                }).catch(reject => {
                    this.$message({
                        message:reject,
                        type:'error',
                        showClose: true,
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .log {
        width: 400px;
        height: 300px;
        margin-top: 150px;
        border: 1px solid gainsboro;
        border-radius: 10px;
        padding: 20px;
    }
</style>