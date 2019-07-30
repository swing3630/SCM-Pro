<template>
    <div style="margin-top: 10px">
        <el-tabs type="border-card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 用户信息</span>
                <el-form :model="ruleForm" ref="ruleForm" label-width="80px" :rules="rules">
                    <el-form-item label="用户名" prop="account">
                        <el-input v-model="ruleForm.account" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passWord">
                        <el-input v-model="ruleForm.passWord" placeholder="请输入密码" :show-passwoed="true"></el-input>
                    </el-form-item>
                    <el-form-item label="添加日期">
                        <el-input :value='ruleForm.createDate' readonly></el-input>
                    </el-form-item>
                    <el-form-item label="锁定状态" prop="status">
                        <el-radio-group v-model="ruleForm.status">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="权限" prop='modelcodes'>
                        <el-checkbox-group v-model="ruleForm.modelcodes">
                            <el-checkbox label="1">采购管理</el-checkbox>
                            <el-checkbox label="2">销售管理</el-checkbox>
                            <el-checkbox label="3">系统管理</el-checkbox>
                            <el-checkbox label="4">财务管理</el-checkbox>
                            <el-checkbox label="5">仓库管理</el-checkbox>
                            <el-checkbox label="6">业务报表</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitform('ruleForm')">添加用户</el-button>
                        <el-button @click="resetform('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    const qs = require('querystring')
    export default {

        data() {
            return {
                ruleForm: {
                    account: '',
                    name: '',
                    passWord: '',
                    createDate: this.createTime(),
                    status: '',
                    modelcodes: []
                },
                rules: {
                    account: [{ required: true, message: '请输入用户名', triggle: 'blur' }],
                    name: [{ required: true, message: '请输入姓名', triggle: 'blur' }],
                    passWord: [{ required: true, message: '请输入密码', triggle: 'blur' }],
                    modelcodes: [{ type: 'array', required: true, message: '请选择权限', triggle: 'change' }],
                    status: [{ required: true, message: '请选择是否锁定', triggle: 'click' }]
                }
            }
        },

        methods: {
            createTime() {
                let now = new Date()
                let year = now.getFullYear()
                let month = now.getMonth() + 1;
                let day = now.getDate();
                let nowTime = year + "-" + this.rootTime(month) + "-" + this.rootTime(day)
                return nowTime;
            },
            rootTime(num) {
                let rtime
                num >= 10 ? rtime = num : rtime = "0" + num;
                return rtime
            },
            //提交表单时触发
            submitform(formName) {
                this.$refs[formName].validate(valid => {
                    //提交通过时触发
                    if (valid) {
                        this.$confirm('确定添加此用户?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //发送请求
                            this.$axios.post('/api/main/system/user/add', qs.stringify(this.ruleForm)).then(resp => {
                                if (resp.data.status == 2) {
                                    this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                    //清空添加表
                                    this.resetform(formName)
                                }
                            })
                        }).catch(() => {
                            this.$message({
                                message: '已取消',
                                type: 'warning'
                            })
                        })
                        //验证不通过时
                    } else {
                        this.$message.error('输入格式有误');
                    }
                })
            },
            //重置
            resetform(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .el-tabs {
        width: 70%;
        margin: 10px auto;
    }

    .el-tabs .el-form {
        width: 70%;
        margin: 0 auto
    }

    .el-tabs .el-input {
        width: 300px;
    }
</style>