<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-12-09 19:56:45
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-12-10 17:21:32
 * @FilePath: /vue3/src/pages/article/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <component :is="componentId" :id="id" @jumpCom="jumpCom"></component>
</template>
<script setup>
    import { ref,shallowRef } from 'vue'
    import List from './list'
    import Add from './add'
    const componentId = shallowRef(List)
    const id=ref(0)

    const jumpCom = (obj) => {
        if(obj.t=='add'){
            id.value=0
            componentId.value=Add
        }
        if(obj.t=='edit'){
            id.value=obj.id
            componentId.value=Add
        }
        if(obj.t=='list'){
            id.value=0
            componentId.value=List
        }
    }
</script>
  