<template>
  <div class="app-container">
    <el-form :model="form">
      <el-form-item label="新币交易人" props="list">
        <el-input type="textarea" autosize placeholder="支持交易新币的用户ID,以回车分割" v-model="form.list"></el-input>
      </el-form-item>
      <el-button @click="submit">保存</el-button>
    </el-form>
    <el-divider>新币奖池</el-divider>
    <el-card :body-style="{ padding: '0px' }">
      <div style="padding: 14px;">
        <span>累计奖金：{{ totalAmount }}</span>
        <p>上次更新时间：{{ updateTime }}</p>
        <div class="bottom clearfix">
          <time class="time">上次结算：{{ lastResetTime }} - {{ operateUserName }}</time>
          <el-button type="text" class="button" @click="handleReset">清空结算</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getXbUserApi, updateXbUserApi, getPoolApi, resetPoolApi } from '@/api/account'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      form: {
        list: ''
      },
      totalAmount: 0,
      updateTime: '',
      lastResetTime: '',
      operateUserName: ''
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
    getPoolApi().then((res) => {
      this.updateTime = dayjs(res?.updateTime).format('YYYY-MM-DD HH:mm:ss')
      this.lastResetTime = dayjs(res?.lastResetTime).format('YYYY-MM-DD HH:mm:ss')
      this.totalAmount = res.totalAmount
      this.operateUserName = res.operateUserName
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
    },
    handleReset() {
      this.$alert('确定要重置奖金池吗？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPoolApi().then(() => {
          this.$message.success('操作成功')
        })
      })
    }
  }
}
</script>
