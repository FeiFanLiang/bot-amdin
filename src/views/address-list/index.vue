<template>
  <div class="app-container">
    <el-form :model="form">
      <el-form-item label="新币交易人" props="list">
        <el-input type="textarea" autosize placeholder="支持交易新币的用户ID,以回车分割" v-model="form.list"></el-input>
      </el-form-item>
      <el-button @click="submit">保存</el-button>
    </el-form>
  </div>
</template>
<script>
import { getXbUserApi, updateXbUserApi } from '@/api/account'
export default {
  data() {
    return {
      form: {
        list: ''
      }
    }
  },
  created() {
    getXbUserApi().then(res => {
      if (res) {
        this.form = {
          list: res?.list.join('\n')
        }
      }
    })
  },
  methods: {
    submit() {
      const data = {
        list: this.form.list.split('\n').map(el => el.trim()).filter(el => el)
      }
      updateXbUserApi(data).then(() => {
        this.$message.success('更新成功')
      })
    }
  }
}
</script>
