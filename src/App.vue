<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-06-21 16:12:37
 * @LastEditTime: 2023-12-09 22:01:48
 * @FilePath: \ypcmsvue3\src\App.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->

<template>
  <router-view class="h-full" @contextmenu.prevent :key="ckey"></router-view>
  <loading v-if="isLoading" />
</template>
<script setup>
import { ref,computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
let isLoading = computed(() => {
  return store.state.isLoading
})
const ckey = ref(0)

onMounted(() => {
  setInterval(() => {
    if (sessionStorage.getItem('refresh')) {
      ckey.value += 1
      sessionStorage.removeItem('refresh')
    }
  }, 500)
})
onUnmounted(() => {
  localStorage.removeItem('token')
})
</script>