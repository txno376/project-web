<template>
  <div>
    <h2>短信注册</h2>
    <form @submit.prevent="register">
      <div>
        <label for="phone">手机号码：</label>
        <input type="tel" id="phone" v-model="date.phone" required>
      </div>
      <div>
        <label for="code">验证码：</label>
        <input type="text" id="code" v-model="date.code" required>
        <button type="button" @click="sendCode" :disabled="isSending">发送验证码</button>
      </div>
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<script>
import { registerUser, sendSMSCode } from '@/api/user'

export default {
  data() {
    return {
      isSending: false,
      date: {
        phone: '',
        code: ''
      }
    }
  },
  methods: {
    sendCode() {
      // 调用后端API发送短信验证码
      // 设置isSending为true，避免用户重复点击发送按钮
      this.isSending = true
      // 假设后端API返回一个Promise对象
      sendSMSCode(this.date.phone)
        .then(() => {
          console.log('验证码发送成功')
        })
        .catch((error) => {
          console.error('验证码发送失败', error)
        })
        .finally(() => {
          this.isSending = false
        })
    },
    register() {
      // 调用后端API注册用户
      registerUser(this.date)
        .then(() => {
          console.log('注册成功')
        })
        .catch((error) => {
          console.error('注册失败', error)
        })
    }
  }
}
</script>
