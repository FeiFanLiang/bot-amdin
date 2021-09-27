<template>
    <div class="app-container">
        <el-form :model="form">
          <el-form-item label="红包封面" prop="imgUrl" required >
              <el-input v-model="form.imgUrl" placeholder="输入图片地址" ></el-input>
          </el-form-item>
          <el-form-item label="红包封面文字" prop="imgText" required >
              <el-input type="textarea" autosize v-model="form.imgText" placeholder="输入文本" ></el-input>
          </el-form-item>
          <el-form-item label="红包按钮文字" prop="buttonText" required >
              <el-input type="textarea" autosize v-model="form.buttonText" placeholder="输入文本" ></el-input>
          </el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form>
         <el-divider content-position="center">首页图片设置</el-divider>
        <el-form :model="indexForm">
          <el-form-item label="首页图片">
              <el-input v-model="indexForm.imgUrl" placeholder="输入图片地址" ></el-input>
          </el-form-item>
          <el-button type="primary" @click="indexSubmit">保存</el-button>
        </el-form>
    </div>
</template>
<script>
import {getRedpackConfigApi,updateRedpackConfigApi,getIndexImgApi,updateIndexImgApi} from '@/api/user'
export default {
    data(){
        return {
            form:{
                imgUrl:'',
                imgText:"",
                buttonText:''
            },
            indexForm:{
                imgUrl:""
            }
        }
    },
    created(){
        getRedpackConfigApi().then((res) => {
            this.form = {...res}
        })
        getIndexImgApi().then((res) => {
            this.indexForm.imgUrl = res?.imgUrl || ''
        })
    }, 
    methods:{
        submit(){
            updateRedpackConfigApi(this.form).then(() => {
                this.$message.success('编辑成功')
            })
        },
        indexSubmit(){
updateIndexImgApi(this.indexForm).then(() => {
    this.$message.success('编辑成功')
})
        }
    }
}
</script>