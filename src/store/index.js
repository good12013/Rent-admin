import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'

Vue.use(Vuex)




/**
 *  用于寻找一个数组里对应的对象并返回 用于store
 * @param  arr  数组
 * @param  keyname  查找数组里是否具有key值的对象
 */
let Find = (arr, keyname) => {
  var res = null
  if (arr && arr.length && keyname) {
    arr.forEach(el => {
      if (el.key == keyname) {
        res = el
        return
      }
    })
  }
  return res;
}

const store =  new Vuex.Store({
  modules: {
    app,
    settings
  },
  state: {
    cahce: []
  },
  getters,
  mutations: {
    cache(state, {
      key,
      value
    }) {
      if (key) {
        if (Find(state.cahce, key)) {
          Find(state.cahce, key).data = value;
        } else {
          state.cahce.push({
            key,
            data: value
          })
        }
        sessionStorage.setItem(key, typeof (value) === 'object' ? JSON.stringify(value) : value)
      }
    },
    reset(state) {
      for (var item in sessionStorage) {
        var val = sessionStorage.getItem(item)
        if (item && (val || val === 0)) {
          state.cahce.push({
            key: item,
            data: val.indexOf('{') === 0 ? JSON.parse(val) : val
          })
        }
      }
    }
  }
})


export default store
