import fetch from '@/utils/fetch'

export function getList(params) {
  return fetch({
    url: '/visualize/role/list_roles',
    method: 'post',
    params
  })
}
