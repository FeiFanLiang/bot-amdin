<template>
    <div class="app-container">
        <el-form :model="form">
          <el-form-item label="支付宝收款账号" required prop="address">
              <el-input v-model="form.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(1)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="trcForm">
          <el-form-item label="trc20收款地址" required prop="address">
              <el-input v-model="trcForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(2)">保存</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="ercForm">
          <el-form-item label="erc20收款地址" required prop="address">
              <el-input v-model="ercForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submit(3)">保存</el-button>
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
            },
            trcForm:{
                address:""
            },
            ercForm:{
                address:""
            }
        }   
    },
    created(){
        getAlipayAddressApi({type:"alipay"}).then((res) =>{
            this.form.address = res.address
        })
         getAlipayAddressApi({type:"trc20"}).then((res) =>{
            this.trcForm.address = res.address
        })
         getAlipayAddressApi({type:"erc20"}).then((res) =>{
            this.ercForm.address = res.address
        })
    },
    methods:{
        submit(number){
            let data;
            if(number === 1){
                data = {...this.form,type:'alipay'}
            }
            if(number === 2){
                data = {...this.trcForm,type:'trc20'}
            }
            if(number === 3){
                data = {...this.ercForm,type:'erc20'}
            }
            updateAlipayAddressApi(data).then(() => {
                this.$message.success('更新成功')
            })
        }
    }
}
</script>