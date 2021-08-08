<template>
    <div class="app-container">
        <el-form :model="form">
          <el-form-item label="支付宝收款账号" required prop="address">
              <el-input v-model="form.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {getAlipayAddressApi,updateAlipayAddressApi} from '@/api/recharge'
export default {
    data(){
        return {
            form:{
                address:''
            }
        }   
    },
    created(){
        getAlipayAddressApi().then((res) =>{
            this.form.address = res.address
        })
    },
    methods:{
        submit(){
            updateAlipayAddressApi({
                address:this.form.address
            }).then(() => {
                this.$message.success('更新成功')
            })
        }
    }
}
</script>