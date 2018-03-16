import fetch from '@/utils/fetch'

export function login(accountNumber, password) {
  return fetch({
    // url: '../static/data/login.json',
    url: '/user/login',
    method: 'post',
    data: {
      accountNumber,
      password
    }
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return fetch({
    url: '/user/login_out',
    method: 'post'
  })
}
