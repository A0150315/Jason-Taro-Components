import Taro from '@tarojs/taro'
import { stringify } from 'qs'

/**
 * 读取所在环境
 */
type Env =
  | 'LAIAI'
  | 'YUNSHANG'
  | 'WEAPP'
  | 'WECHAT'
  | 'ALIAPP'
  | 'ALIPAY'
  | 'WEIBO'
  | 'SWAN'
  | 'TT'
  | 'RN'
  | 'WEB'
export function getEnv(): Env {
  let env: Env = Taro.getEnv()
  if (env === 'ALIPAY') {
    env = 'ALIAPP'
  } else if (env === 'WEB') {
    const ua = navigator.userAgent.toUpperCase()
    if (/LAIAI/.test(ua)) {
      env = 'LAIAI'
    } else if (/YUNSHANG/.test(ua)) {
      env = 'YUNSHANG'
    } else if (/MICROMESSENGER/.test(ua)) {
      env = 'WECHAT'
    } else if (/ALIPAY/.test(ua)) {
      env = 'ALIPAY'
    } else if (/WEIBO/.test(ua)) {
      env = 'WEIBO'
    }
  }

  return env
}

/**
 * 读取手机操作系统
 */
type System = 'OTHER' | 'IOS' | 'ANDROID' | 'IOSWEAPP'
export function getSystem(): System {
  let system: System = 'OTHER'
  const ua = (Taro.getSystemInfoSync().system || '').toUpperCase()
  if (/IOS/.test(ua)) {
    if (getEnv() === 'WEAPP') system = 'IOSWEAPP'
    else system = 'IOS'
  } else if (/ANDROID/.test(ua)) {
    system = 'ANDROID'
  }

  return system
}

type ListData = {
  list: any[]
  currentPage: number
  firstPage: boolean
  lastPage: boolean
  listSize: number
  pageSize: number
  totalPage: number
  totalRecord: number
}

type Pagination = {
  list: any[]
  pagination: {
    pageSize: number
    current: number
    total: number
    hasMore: boolean
  }
}

export function getPagination(data: ListData): Pagination {
  const { list, currentPage, pageSize, totalRecord } = data
  return {
    list,
    pagination: {
      pageSize,
      current: currentPage,
      total: totalRecord,
      hasMore: currentPage * pageSize < totalRecord
    }
  }
}

export function formatRichText(html) {
  if (!html) return ''
  let newContent = html.replace(/<img[^>]*>/gi, match => {
    let $match = match
    $match = $match
      .replace(/style="[^"]+"/gi, '')
      .replace(/style='[^']+'/gi, '')
    $match = $match
      .replace(/width="[^"]+"/gi, '')
      .replace(/width='[^']+'/gi, '')
    $match = $match
      .replace(/height="[^"]+"/gi, '')
      .replace(/height='[^']+'/gi, '')
    return $match
  })
  newContent = newContent.replace(/style="[^"]+"/gi, match => {
    let $match = match
    $match = $match
      .replace(/width:[^;]+;/gi, 'max-width:100%;')
      .replace(/width:[^;]+;/gi, 'max-width:100%;')
    return $match
  })
  newContent = newContent.replace(/<br[^>]*\/>/gi, '')
  newContent = newContent.replace(
    /<img/gi,
    '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"'
  )
  return newContent
}

export function strip(num: number, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}

export function getThisRouter() {
  let route = ''
  if (getEnv() === 'WEAPP') {
    const history = Taro.getCurrentPages()
    route = `${history[history.length - 1].route.replace(
      'pages',
      ''
    )}?${stringify(history[history.length - 1].options)}`
  } else {
    route = `${window.location.pathname.replace('/pages', '')}${
      window.location.search
    }`
  }
  return route
}

const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const chnUnitChar = ['', '十', '百', '千', '万', '亿', '万亿', '亿亿']
export function convertToChinese(num) {
  let strIns = ''
  let section = num
  let chnStr = ''
  let unitPos = 0
  let zero = true
  while (section > 0) {
    const v = section % 10
    if (v === 0) {
      if (!zero) {
        zero = true
        chnStr = chnNumChar[v] + chnStr
      }
    } else {
      zero = false
      strIns = chnNumChar[v]
      strIns += chnUnitChar[unitPos]
      chnStr = strIns + chnStr
    }
    unitPos += 1
    section = Math.floor(section / 10)
  }
  return chnStr.replace('一十', '十')
}
