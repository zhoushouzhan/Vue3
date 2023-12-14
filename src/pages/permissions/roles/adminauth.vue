<!--
个人权限控制
-->
<template>
    <div>
      <div class="flex space-x-3 border-b py-3">
        <div class="flex space-x-3">
          <div class="cursor-pointer" :class="{'text-red-500 font-bold':tab==0}" @click="tab=0">菜单</div>
          <div class="cursor-pointer" :class="{'text-red-500 font-bold':tab==1}" @click="tab=1">模型</div>
        </div>
      </div>
      <div>
        <div v-show="tab==0">
          <Rule :dataList="ruleList" :value="selectedRule" @change="change"></Rule>
        </div>
        <div v-show="tab==1" class="text-sm">
          <div class="flex border-b py-2" v-for="(item,index) in modList" :key="index">
            <div class="w-40">{{item.alias}}</div>
            <div class="flex-1">
              <div class="grid grid-cols-8">
                <div v-for="(btn,index) in item.actions" :key="index">
                  <ypcheckbox :value="btn.name" :title="btn.title" v-model="actions[item.name]"></ypcheckbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 text-center">
        <button class="yp-button yp-button-red rounded" @click="save">保存</button>
      </div>
    </div>
  </template>
  <script setup>
  import store from '@/store'
  import { getData,postData,alter } from '@/api/data'
  import Rule from './rule'
  import { onMounted, ref, reactive } from 'vue'
  const props = defineProps({ adminId: 0})
  const emits = defineEmits(['close'])
  const ruleList = ref('')
  const selectedRule = reactive([])
  const chitems = reactive([])
  const actions = reactive({}) 
  const tab = ref(0)
  const modList = reactive([])

  const save = async () => {
    const resp = await postData('/admin/authupdate',{
      id: props.adminId,
      cluderules: chitems,
      cludebtn: actions,
    })
    if (resp.code == 1) {
      alter({ type: 'alter-success', text: resp.msg })
      //加载系统参数
      const sysInfo = await store.dispatch('Sys/getSys')
      store.dispatch('User/GET_USER_INFO', sysInfo.admin)
      setTimeout(emits('close'), 1000)
    }
  }
  const change = (v) => {
    chitems.length = 0
    if (v.length) {
      v.forEach((id) => {
        chitems.push(id)
      })
    }
  }

  onMounted(async () => {
    const resp = await getData('/rule/index')
    ruleList.value = resp.data
    let mybtn = []
    if (props.adminId) {
      const resp = await getData('/admin/getadmin',{ id: props.adminId })
      if (resp.code == 1) {
        mybtn=resp.data.rolesBtn
        if (resp.data.rolesRules && resp.data.rolesRules.length) {
          resp.data.rolesRules.forEach((id) => {
            selectedRule.push(parseInt(id))
          })
        }
      }
    }
    const sysActions = store.getters.actions
    const getmod = await getData('/mod/index')
    if (getmod.code == 1) {
      getmod.data.forEach((item) => {
        let modActions = []
        Object.keys(sysActions).map((key) => {
          if (item.actions.indexOf(key) >= 0) {
            modActions.push(sysActions[key])
          }
        })
  
        item.actions.length = 0
        item.actions = modActions
        actions[item.name] = []
        modList.push(item)
      })
    }
    //btn
    for (let k in mybtn) {
      actions[k] = mybtn[k]
    }
  })
  </script>