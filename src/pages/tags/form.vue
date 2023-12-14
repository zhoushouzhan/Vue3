<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-12-11 09:29:03
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-12-11 09:33:55
 * @FilePath: /vue3/src/pages/tags/form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div>
      <ypform :formData="formData" :group="mod.colgroup" :mod="mod" :isPreview="0" @save="save" v-if="isload==1"></ypform>
    </div>
  </template>
    <script setup>
  import { getData, postData, alter } from '@/api/data'
  import { ref, reactive, onMounted } from 'vue'
  const props = defineProps({
    mod: {
      type: Object
    },
    id: {
      type: Number,
      default: 0
    }
  })
  const emits = defineEmits(['getList','close'])
  const formData = reactive({})
  const isload = ref(0)
  const save = async (formParams) => {
    let res = await postData('/tags/save', formParams)
    if (res.code == 1) {
      alter({ type: 'alter-success', text: res.msg })

      emits('getList')
      emits('close')
    }
  }
  onMounted(async () => {
    if(props.id){

      const res = await getData('/tags/details', { id: props.id })
      if (res.code == 1) {
        if (props.id) {
          formData['id'] = props.id
        }
        let column = props.mod.modcolumn
        Object.keys(column).map((k) => {
          let name = column[k].name
          if (column[k].formitem != 'none') {
            formData[name] = res.data[name]
          }
        })
      }

    }

    isload.value = 1
  })
  </script>