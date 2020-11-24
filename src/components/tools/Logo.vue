<template>
  <div class="logo">
    <router-link :to="{ name: 'dashboard' }">
      <!-- <LogoSvg alt="logo" /> -->
      <img src="~@/assets/logo.png" alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Logo',
  // components: {
  //   LogoSvg
  // },
  props: {
    title: {
      type: String,
      default: 'Train Shop',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
