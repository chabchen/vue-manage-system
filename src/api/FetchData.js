import request from '@/utils/request'

export default function fetchData(url, params) {
  if (!params) {
    params = {}
  }
  const urlParams = url.split('?')[1]
  if (urlParams) { // 如果url中有拼接参数，拆分开来
    url = url.split('?')[0]
    // console.log('urlParams', urlParams)
    const paramsArr = urlParams.split('&')
    for (const pram of paramsArr) {
      const t = pram.split('=')
      if (t.length === 2) {
        params[t[0]] = t[1]
      }
    }
    console.log(params)
  }

  return request({
    url,
    method: 'get',
    params
  })
}
