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


const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  read: state => key => {
    return Find(state.cahce, key)
  }
}
export default getters
