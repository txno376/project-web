<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢 迎 注 册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="86" />
        </span>
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="请输入手机号码"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="code">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input
          ref="code"
          v-model="registerForm.code"
          placeholder="请输入验证码"
          name="code"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
        <el-button style="position: absolute; margin: auto;" type="text" @click="sendCode">验证码</el-button>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="register">注册</el-button>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="login">登 录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { registerUser, sendSMSCode } from '@/api/user'
import md5 from 'js-md5'
export default {
  name: 'Login',
  data() {
    const validatePhone = (rule, value, callback) => {
      var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if (value.length < 1) {
        callback(new Error('请输入手机号'))
        return false
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确手机号'))
        } else {
          callback()
        }
      }
    }
    const validateCode = (rule, value, callback) => {
      var reg = /^\d{6}$/
      if (value.length < 1) {
        callback(new Error('请输入验证码'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入六位验证码'))
        } else {
          callback()
        }
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入用户名'))
      } else {
        if (!validUsername(value)) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        phone: '',
        code: '',
        username: '',
        password: ''
      },
      registerDate: {
        phone: '',
        code: '',
        username: '',
        password: ''
      },
      registerRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    sendCode() {
      this.$refs.registerForm.validateField('phone', valid => {
        // eslint-disable-next-line no-empty
        if (!valid) {
          // 调用后端API发送短信验证码
          // 设置isSending为true，避免用户重复点击发送按钮
          this.isSending = true
          // 假设后端API返回一个Promise对象
          sendSMSCode(this.registerForm.phone)
            .then(() => {
              console.log('验证码发送成功')
            })
            .catch((error) => {
              console.error('验证码发送失败', error)
            })
            .finally(() => {
              this.isSending = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    register() {
      this.$refs.registerForm.validate(valid => {
        // eslint-disable-next-line no-empty
        if (valid) {
          // 调用后端API注册用户
          this.registerDate = this.registerForm
          this.registerDate.password = md5('AGNA/PCIXGPPPCHUSBXOTHERMXUSBUSBMXUSBDS' + this.registerForm.username + 'gpstng@xyz.newc' + this.registerForm.password)
          this.registerDate.code = md5(this.registerForm.code)
          registerUser(this.registerDate)
            .then(() => {
              console.log('注册成功')
              this.$router.push({ path: '/login', query: { username: this.registerForm.username }})
            })
            .catch((error) => {
              console.error('注册失败', error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.register-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 80%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 30px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  background-image: url('../../assets/bg.jpg');
  background-size: 100%;

  display: flex;
  align-items: center;

  .register-form {
    position: relative;
    width: 500px;
    max-width: 100%;
    padding: 10px 30px 10px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #1f2d3d;
    border-radius: 20px;
    opacity: 0.9;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
