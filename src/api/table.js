import fetch from '@/utils/fetch'

export function getList(params) {
  return fetch({
    url: '/visualize/domain/list_domains',
    method: 'post',
    params
  })
}
