<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-12-09 19:57:19
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-12-10 17:36:05
 * @FilePath: /vue3/src/pages/article/add.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <yplayout v-if="isload">
        <template #header="headerProps">
            <div class="flex items-center" v-if="id">
                <i class="ri-2x text-gray-500 ml-2" :class="headerProps.meta.icon||'ri-information-line'"></i>
                <div class="text-xl px-2">编辑{{ headerProps.meta.mod.alias }}</div>
            </div>
            <div class="flex items-center" v-else>
                <i class="ri-2x text-gray-500 ml-2" :class="headerProps.meta.icon||'ri-information-line'"></i>
                <div class="text-xl px-2">增加{{ headerProps.meta.mod.alias }}</div>
            </div>

            <div class="flex-1"></div>
            <div class="flex">
                <button class="yp-button yp-button-orange rounded-sm" type="button" @click="emits('jumpCom',{t:'list'})">
                    <i class="ri-arrow-go-back-line ri-lg pr-1"></i>
                    返回
                </button>
            </div>
        </template>
        <template #list="listProps">
            <div>
                <ypform :formData="formData" :group="listProps.data.mod.colgroup" :mod="listProps.data.mod" @save="save($event,listProps)"></ypform>
            </div>
        </template>
     
    </yplayout> 
</template>
<script setup>
    import {getData,postData,alter} from "@/api/data"
    import {ref,reactive,onMounted} from "vue"
    const props=defineProps({
        id:{
            default:0
        }
    })
    const isload=ref(false)
    const emits=defineEmits(['jumpCom'])
    const formData = reactive({id:props.id})
    const save=async(e,obj)=>{
        const resp= await postData(obj.data.path+'/save',e)
        if(resp.code==1){
            emits('jumpCom',{t:'list'})
            alter({ type: 'alter-success', text: resp.msg })
        }
    }
    const details=async(id)=>{
        const resp= await getData("article/details",{id:id})
        if(resp.code==1){
            Object.keys(resp.data).map((k)=>{
                formData[k]=resp.data[k]
            })
        }
    }
    onMounted(async()=>{
        if(props.id){
            await details(props.id)
        }
        isload.value=true
        
    })
</script>