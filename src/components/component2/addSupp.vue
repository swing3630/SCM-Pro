<template>
    <div style="margin-top: 10px">
        <el-tabs type="border-card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 供应商信息</span>
                <el-form :model="ruleForm" ref="ruleForm" label-width="80px" :rules="rules">
                    <el-form-item label="编号" prop="venderCode">
                        <el-input v-model="ruleForm.venderCode"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="passWord">
                        <el-input v-model="ruleForm.passWord" :show-passwoed="true"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="contactor">
                        <el-input v-model="ruleForm.contactor"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="tel">
                        <el-input v-model="ruleForm.tel">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="添加日期">
                        <el-input :value='ruleForm.createDate' readonly></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="ruleForm.address"></el-input>
                    </el-form-item>
                    <el-form-item label="邮编">
                        <el-input v-model="ruleForm.postCode"></el-input>
                    </el-form-item>
                    <el-form-item label="传真">
                        <el-input v-model="ruleForm.fax"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="submitform('ruleForm')" type="primary">添加供应商</el-button>
                        <el-button @click="resetform('ruleForm')">重 置</el-button>
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
                    venderCode: '',
                    name: '',
                    passWord: '',
                    contactor: '',
                    createDate: this.createTime(),
                    tel: '',
                    address: '',
                    fax: '',
                    postCode: ''
                },
                rules: {
                    venderCode: [{ required: true, message: '供应商编号不能为空', triggle: 'blur' }],
                    name: [{ required: true, message: '用户名不能为空', triggle: 'blur' }],
                    passWord: [
                        { required: true, message: '密码不能为空', triggle: 'blur' },
                        { min: 4, max: 20, message: "密码长度为4到20位", triggle: 'blur' }
                    ],
                    contactor: [{ required: true, message: '联系人不能为空', triggle: 'blur' }],
                    tel: [{ required: true, message: '电话不能为空', triggle: 'blur' }],
                },
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
                        this.$confirm('确定添加此供货商?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            //发送请求
                            this.$axios.post('/api/main/purchase/vender/add', qs.stringify(this.ruleForm)).then(resp => {
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
                                message: '错误的请求',
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

        },
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