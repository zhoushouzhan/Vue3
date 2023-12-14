<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-08-31 21:54:42
 * @LastEditTime: 2023-12-10 21:16:07
 * @FilePath: \vue3\src\components\global\yplinkage\yplinkage.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>
    <div class="flex space-x-1" v-if="isload">
      <ypselect :itemList="item" v-model="path[index]" v-for="(item,index) in group" :key="index" @click.capture="change(index)"></ypselect>
    </div>
</template>
<script setup>
  import { getData } from '@/api/data'
  import { ref, onMounted, reactive, watch } from 'vue'
  const props = defineProps({
    modelValue: {
      default: []
    },
    col: {
      type: Object
    }
  })
  const isload=ref(false)
  //获取联动URL及参数
  let info = JSON.parse(props.col.extends)
  //保存父级ID
  const pid = ref(info.pid)
  const path = reactive([])
  const pos = ref(0)
  const group = reactive([])
  const openwatch=ref(false)
  //菜单更新
  watch(path, (newVal) => {
    if(!openwatch.value){
      return
    }
    pid.value = newVal[pos.value]
    getList()
    emit('update:modelValue', newVal[newVal.length-1])
  })
  //获取数据
  const getList = async () => {
    if(typeof pid.value=='undefined'){
      return
    }
    const res = await getData(info.url, { pid: pid.value, ids: path })
    if (res.code == 1) {
      if(group.length){
        group.length = pos.value + 1
        path.length = pos.value+1
      }
      res.data.forEach((item) => {
        let options = []
        Object.keys(item).forEach((key) => {
          options.push({
            title: item[key].title,
            value: item[key].id
          })
        })
        group.push(options)
      })
    }
  }
  const emit = defineEmits(['update:modelValue'])
  const change = (index) => {
    openwatch.value=true
    pos.value = index
  }
  const getPath=async()=>{
    const resp=  await getData('category/getpath',{id:props.modelValue})
    resp.map((item,k)=>{
      path.push(item)
    })
  }
  onMounted(async() => {
    if(props.modelValue){
      await getPath()
    }
     
     await getList()
     isload.value=true
  })
  </script>