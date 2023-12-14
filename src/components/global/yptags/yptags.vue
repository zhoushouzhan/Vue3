<template>
    <div class="relative" click.stop>
        <div class="flex flex-wrap border pb-1 rounded relative">
            <template v-for="(item,index) in tagList" :key="index">
                <div class="flex items-center bg-gray-200 rounded-sm ml-1 mt-1.5 overflow-hidden hover:bg-yellow-200">
                    <span class="px-1.5 py-1">{{item}}</span>
                    <i class="ri-close-line bg-gray-500 text-white px-1 h-full items-center hover:bg-red-600 flex" @click.stop="remove(index)"></i>
                </div>
            </template>
            <div class="flex-1">
                <input type="text" class="block w-full px-2 py-1 mt-1.5  text-gray-700 bg-white transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-gray-400 focus:outline-none rounded text-sm placeholder:text-gray-400" v-model="newtag" @keydown.enter="add" placeholder="输入标签并回车，支持联想选择">
            </div>
        </div>
        <div class="absolute bg-white z-50 w-full divide-y border mt-1" v-if="dataList.length">
            <template v-for="(item,index) in dataList" :key="index">
                <div class=" hover:bg-red-500 py-2 items-center" @click="remoteAdd(index)">
                    <span class="px-1.5 py-1">{{item}}</span>
                </div>
            </template>
        </div>
    </div>

</template>
<script setup>
import store from "@/store"
import {alter,getData} from '@/api/data'
import { ref,reactive,watch,computed, onMounted } from "vue";
const props = defineProps({
  modelValue: {
    default: []
  },
  isadd:{
    defalult:1
  },
  col: {
    type: Object,
    default:[]
  }
})
const emit = defineEmits(['update:modelValue'])

const dataList=reactive([])
const tagList=reactive(props.modelValue||[])
const newtag=ref('')
const max=computed({
    get(){
        return store.state.Sys.sysinfo.tagsnum
    }

})
const add=()=>{
    if(newtag.value==''||props.isadd==0){
        return
    }
    if(props.col){
        if(tagList.length>=max.value){
            let msg='最多可使用'+max.value+'个标签'
            alter({ type: 'alter-error',text:msg })
            newtag.value=''
            return
        }
    }

    if(tagList.indexOf(newtag.value)>=0){
        newtag.value=''
        return
    }

    tagList.push(newtag.value)
    emit('update:modelValue', tagList)
    newtag.value=''
}
watch(newtag,(newVal)=>{
    if(newVal){
        getList()
    }else{
        dataList.length=0
    }
})
const remoteAdd=(index)=>{
    if(props.col){
        if(tagList.length>=max.value){
            let msg='最多可使用'+max.value+'个标签'
            alter({ type: 'alter-error',text:msg })
            newtag.value=''
            return
        }
    }
    let item=dataList[index]
    tagList.push(item)
    dataList.splice(index,1)
    emit('update:modelValue', tagList)
    newtag.value=''
}
const getList=async ()=>{
    const resp= await getData('/tags/index',{"keywords":newtag.value,"limit":10,"notin":tagList})
    if(resp.code==1){
        dataList.length=0
        resp.data.data.forEach((item)=>{
            dataList.push(item.title)
        })
    }
}
const remove=(index)=>{
    tagList.splice(index,1)
}
onMounted(()=>{

    window.addEventListener('click',(e)=>{
        newtag.value=''
        dataList.length=0
    })

})
</script>