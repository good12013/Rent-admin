import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function(value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('DateFormat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

// Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })

Vue.filter('PriceFormat', function(value) {
  if (value == 0) {
    value = '免费'
  } else {
    value = (Number(value) / 100).toFixed(2)
  }
  return value
})

Vue.filter('BannerPositionFilter', function(value) {
  let pos = '首页'
  if (value === 1) {
    pos = '首页'
  } else {
    pos = '干预页'
  }
  return pos
})
