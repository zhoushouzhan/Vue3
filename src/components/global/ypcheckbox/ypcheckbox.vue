<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-07-08 14:26:03
 * @LastEditTime: 2022-09-02 13:28:50
 * @FilePath: \ypcmsvue3\src\components\global\ypcheckbox.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>
  <div class="flex-1 flex-shrink-0 text-sm">
    <div class="flex items-center text-gray-300 cursor-not-allowed" v-if="disabled">
      <i class="ri-checkbox-fill ri-xl text-blue-500" v-if="modelValue.indexOf(value)>=0"></i>
      <i class="ri-checkbox-blank-line ri-xl text-gray-300" v-else></i>
      <div class="px-2" v-if="title">{{title}}</div>
    </div>
    <div class="flex items-center" @click.stop="selected()" v-else>
      <i class="ri-checkbox-fill ri-xl text-blue-500" v-if="modelValue.indexOf(value)>=0"></i>
      <i class="ri-checkbox-blank-line ri-xl text-gray-500" v-else></i>
      <div class="px-2" v-if="title">{{title}}</div>
    </div>
  </div>

</template>
<script setup>
import { reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array
  },
  value: {
    default: ''
  },
  title: {
    type: String
  },
  disabled:false
})
const emit = defineEmits(['update:modelValue'])
const checkList = reactive(props.modelValue)
const selected = (e) => {
  if (checkList.indexOf(props.value) >= 0) {
    checkList.splice(checkList.indexOf(props.value), 1)
  } else {
    checkList.push(props.value)
  }
  emit('update:modelValue', checkList)
}
</script>
