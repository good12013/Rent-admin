<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data(){
    return {
      cachedViews:[]
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods:{
    keepAliveStr(arr){
      var _this = this
      arr.forEach(el => {
        if(el.meta){
          if(el.meta.keepAlive){
            _this.cachedViews.push(el.name)
          }
        }
        if(el.children){
          if(el.children.length){
            _this.keepAliveStr(el.children)
          }
        }
      })
    }
  },
  created() {
    this.keepAliveStr(this.$router.options.routes)
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

