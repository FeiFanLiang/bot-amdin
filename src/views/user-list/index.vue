<template>
    <div class="app-container">
        <el-button type="primary" @click="dialogVisible = true">密码修改</el-button>
        <el-button type="primary" @click="logout">退出登录</el-button>
        <el-button type="primary" @click="close" v-if="$store.getters.role === 'admin'">关闭机器人</el-button>
        <el-button type="primary" @click="start" v-if="$store.getters.role === 'admin'">启动机器人</el-button>
        <el-dialog title="修改密码" :visible.sync="dialogVisible" >
            <el-form :model="form" ref="form">
              <el-form-item label="旧密码" prop="password" required>
                  <el-input v-model="form.password" show-password placeholder="旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPass" required>
                  <el-input v-model="form.newPass" show-password placeholder="新密码"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="submit">确认</el-button>
                <el-button @click=" dialogVisible = false">取消</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import {updatePasswordApi,updateBotApi} from '@/api/user'
import { removeToken } from '@/utils/auth'
export default {
    data(){
        return {
            dialogVisible:false,
            form:{
                password:"",
                newPass:""
            }
        }
    },
    methods:{
        logout(){
            this.$store.dispatch('user/logout')
            window.location.reload()
        },
        submit(){
            this.$refs['form'].validate().then(() => {
                updatePasswordApi(this.form).then(() => {
                    this.$message.success('密码修改成功')
                    removeToken()
                    window.location.reload()
                })
            })
        },
        start(){
            updateBotApi({
                type:true
            }).then(() => {
                this.$message.success('启动成功')
            })
        },
        close(){
            updateBotApi({
                type:false
            }).then(() => {
                this.$message.success('关闭成功')
            })
        }
    }
}
</script>