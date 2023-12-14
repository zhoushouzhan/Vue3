<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-07-01 08:36:59
 * @LastEditTime: 2022-09-17 12:46:50
 * @FilePath: \ypcmsvue3\src\pages\classify\edit.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>
  <div v-if="isload">
    <div class="p-9">
        <div class="mt-8">
          <div class="flex pb-2 items-center">
            <div class="w-24 text-right pr-5">所属分类</div>
            <div class="flex-1">
              <ypselect :itemList="menu" v-model="formData.pid"></ypselect>
            </div>
          </div>
          <div class="flex">
            <div class="w-24 text-right pr-5">名称</div>
            <div class="flex-1" id="title">
              <ypinput v-model="formData.title"></ypinput>
            </div>
          </div>
        </div>
        <div class="flex justify-center py-3 space-x-2">
          <button class="yp-button yp-button-orange rounded" type="button" @click="emits('update',formData)">
            <i class="ri-save-line ri-lg pr-1"></i>
            保存
          </button>
          <button class="yp-button yp-button-gray rounded" type="button" @click="emits('close')">
            <i class="ri-arrow-go-back-fill mr-1"></i>
            取消
          </button>

        </div>
      </div>
  </div>


</template>
<script setup>
import { getData } from '@/api/data'
import { ref, reactive, onMounted } from 'vue'
const isload=ref(false)
const props = defineProps(['preitem'])
const emits = defineEmits(['save','update','close'])
const formData = reactive({
  id: 0,
  title: '',
  pid: ''
})




const menu = ref([])
onMounted(async () => {
  formData.id = props.preitem.id
  formData.pid = props.preitem.pid
  formData.title = props.preitem.title
  const resp = await getData('/classify/gettree',{id:formData.id})
  if (resp.code) {
    menu.value = resp.data
  }
  isload.value=true
})
</script>
