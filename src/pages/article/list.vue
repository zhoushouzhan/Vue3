<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-12-09 21:19:35
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-12-10 17:41:56
 * @FilePath: /vue3/src/pages/article/list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <yplayout v-if="isload">
        <template #header="headerProps">
            <div class="flex items-center">
                <i class="ri-2x text-gray-500 ml-2" :class="headerProps.meta.icon||'ri-information-line'"></i>
                <div class="text-xl px-2" v-html="headerProps.meta.title"></div>
            </div>
            <div class="flex-1"></div>
            <div class="flex">
                <button class="yp-button yp-button-orange rounded-sm" type="button" @click="add" v-if="authBtn(headerProps.meta.mod.name,'add')">
                    <i class="ri-add-line ri-lg pr-1"></i>
                    增加
                </button>
            </div>
        </template>
        <template #list>
            <div>
                <table class="yp-table-datalist">
                    <thead>
                        <tr>
                            <th></th>
                            <th class="w-10">ID</th>
                            <th>标题</th>
                            <th>栏目</th>
                            <th>创建时间</th>
                            <th class="w-32 text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in dataList" :key="index" class="hover:bg-gray-100">
                            <td></td>
                            <td>{{ item.id }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.category.title }}</td>
                            <td>{{ item.create_time }}</td>
                            <td class="text-center">
                                <button class="yp-button yp-button-sm rounded-sm mr-2" @click="emits('jumpCom',{id:item.id,t:'edit'})">编辑</button>
                                <button class="yp-button yp-button-red yp-button-sm rounded-sm" @click="removeItem(vo.id)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </yplayout>
</template>

<script setup>
    import {getData,authBtn} from "@/api/data"
    import {ref,reactive,onMounted} from "vue"
    import Add from "./add.vue"
    const isload=ref(false)
    const props = defineProps({
        mod: {
            default: 0
        },
        meta: { default: '' }
    })
    const emits=defineEmits(['jumpCom'])
    const searchParams=reactive({
        keyword:'',
        page:1
    })
    //分页
    const  pageData=reactive({
        totalRecords:0,//总记录数
        pageCount:0,//总页数
        currentPage:1//当前页
    });
    const toPage = (page) => {
        pageData.currentPage=page
        getList()
    }


    const dataList=reactive([])
    const add=()=>{
        console.log('add')
        emits("jumpCom",{id:0,t:'add'})
    }


    const getList=async()=>{
        const resp= await getData("article/index",searchParams)
        if(resp.code==1){
            dataList.length=0
            pageData.currentPage = resp.data.current_page
            pageData.pageCount = resp.data.last_page
            pageData.totalRecords = resp.data.total
            resp.data.data.map((item,index)=>{
                dataList.push(item)
            })
        }

    }
    onMounted(async()=>{
        await getList()
        isload.value=true
    })
</script>