<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-06-22 11:12:24
 * @LastEditTime: 2023-12-11 09:51:25
 * @FilePath: \ypcmsvue3\src\pages\home.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>
  <div class="flex overflow-hidden">
    <div class="w-56 bg-stone-800 flex flex-col flex-shrink-0">
      <router-link class="flex flex-wrap items-center text-gray-100 py-5 px-3" to="/">
        <div><img src="../assets/logo.png" class="w-8"></div>
        <div class="pl-2 delay-700">一品内容管理系统</div>
      </router-link>
      <YPMENU :dataList="routes"></YPMENU>
      <div class="ver">
        By V1.0
      </div>
    </div>
    <div class="flex-1" ref="main">
      <div class="flex flex-col h-full overflow-y-auto">
        <div class="h-16 bg-gray-100 flex items-center pl-4 flex-shrink-0">
          <div>
            <i class="ri-home-2-line text-gray-500 text-xl"></i></div>
          <div>
            <BreadCrumb />
          </div>
          <div class="flex-1 flex justify-end items-center space-x-2 text-sm mr-5">
            <div class="flex items-center space-x-5">
              <div class="flex items-center">
                <div>
                当前用户：
                </div>
                <div class="font-bold text-blue-500">
                  <router-link to="/my">{{ store.state.Sys.sysinfo.admin.truename}}</router-link>
                </div>
              </div>
              <div class="flex items-center">
                <div>
                部门：
                </div>
                <div>
                  {{ store.state.Sys.sysinfo.admin.roles[0].title }}
                </div>
              </div>
            </div>

            <div class=" text-white bg-stone-900 hover:bg-lime-600 cursor-pointer w-7 h-7 rounded-full border flex items-center justify-center" @click="gohome" v-tooltip.bottom="'网站首页'">
              <i class="ri-home-7-fill text-xl"></i>
            </div>

            <div class=" text-white bg-stone-900 hover:bg-lime-600 cursor-pointer w-7 h-7 rounded-full border flex items-center justify-center" @click="clearCache()" v-tooltip.bottom="'清理缓存'">
              <i class="ri-brush-2-fill text-xl"></i>
            </div>
            <div class=" text-white bg-stone-900 hover:bg-lime-600 cursor-pointer w-7 h-7 rounded-full border flex items-center justify-center" @click="dropevent('loginOut')" v-tooltip.bottom="'安全退出'">
              <i class="ri-login-circle-fill text-xl"></i>
            </div>

          </div>
        </div>
        <div class="flex-1 overflow-y-auto border-t">
          <router-view :key="key"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref,computed, reactive } from 'vue'
import { router } from '@/router'
import { getData,alter,confirms } from '@/api/data'
import store from '@/store'
import YPMENU from '@/components/ypmenu'
import BreadCrumb from '@/components/BreadCrumb'
const key = router.path
const main = ref(null)
const clearCache = async () => {
  const resp= await getData('/index/clearCache')
  if(resp.code) {
    alter({ type: 'alter-success', text: resp.msg })
  }
}
const routes = computed(()=>store.getters.routes)
const dropevent=(type)=>{
  switch(type){
    case 'personHome':
    break;
    case 'editpass':
    break;
    case 'loginOut':
    confirms({ text: '确定要退出吗？' })
    .then(()=>{
      store.commit('User/LOGIN_OUT')
      alter({ type: 'alter-success', text: '您已成功退出' })
      router.push('/login')
    })
    break;
  }
}
const gohome=()=>{
  const sysinfo=JSON.parse(sessionStorage.getItem('sysinfo'))
  if(sysinfo.siteurl){
    window.open("http://"+sysinfo.siteurl)
  }
}
</script>
