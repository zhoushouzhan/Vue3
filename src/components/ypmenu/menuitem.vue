<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-08-30 16:32:28
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-12-09 21:59:11
 * @FilePath: /vue3/src/components/ypmenu/menuitem.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="cursor-pointer" :class="ypclass" @click.stop="navjump(item)">
        <div class="icon">
            <i :class="item.meta.icon" class="px-1" v-if="deep==0&&item.meta.icon"></i>
        </div>
        <div v-for="v in deep" class="w-5" :key="v"></div>
        <div class="flex-1">
            {{ item.title }}
        </div>
        <div v-show="item.children&&item.children.length>0">
            <div class="yp-menu-title-arrow" :class="openList.indexOf(item.id)<0?' rotate-0':'rotate-180'">
                <i class="ri-arrow-down-s-line"></i>
            </div>
        </div>
    </div>
</template>
<script setup>
import {useRoute} from "vue-router"
import {computed} from 'vue'
const props=defineProps({
    item:{
        type:Object
    },
    openList:{
        type:Object
    },
    currentPage:{
        default:[]
    },
    deep:{
        type:Number,
        default: 0
    }
})
const ypclass=computed(()=>{
    if(props.currentPage.indexOf(props.item.id)<0){
        return 'yp-menu-title'
    }else{
        if(props.item.children){
            return 'yp-menu-title-parent-current'
        }else{
            return 'yp-menu-title-current'
        }
    }
})
const route=useRoute()
const navjump=(item)=>{
    if(item.path==route.fullPath){
        sessionStorage.setItem('refresh',1)
    }
    emit('changeMenu',item)
}
const emit=defineEmits(['changeMenu'])
</script>