import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function registerUser(registerForm) {
  return request({
    url: '/user/register',
    method: 'post',
    params: {
      phone: registerForm.phone,
      code: registerForm.code,
      username: registerForm.username,
      password: registerForm.password
    }
  })
}

export function sendSMSCode(phone) {
  return request({
    url: '/user/sendSMSCode',
    method: 'post',
    params: { phone }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
