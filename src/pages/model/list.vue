<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-08-02 08:05:39
 * @LastEditTime: 2023-12-09 20:31:25
 * @FilePath: \ypcmsvue3\src\pages\model\list.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>

<yplayout>
  <template #header>
    <i class="ri-2x text-gray-500 ml-2" :class="mod.icon||'ri-information-line'"></i>
    <div class="text-xl px-3" v-html="mod.alias"></div>
    <div class="flex-1 flex flex-row-reverse space-x-reverse space-x-2">
      <button class="yp-button yp-button-gray yp-button-sm rounded-sm relative" @click="modData.isremove=!modData.isremove">
          {{modData.isremove?'返回列表':'回收站'}}
          <div class="absolute text-xs -top-1.5 -right-1.5 px-1 min-w-4 h-4 rounded-full bg-red-600 flex items-center justify-center" v-if="modData.removenum">
            {{modData.removenum}}
          </div>
      </button>
      <button class="yp-button yp-button-orange yp-button-sm rounded-sm" @click="ypexport">导出</button>
      <ypimport url="/admin.php/upload" ref="uploader" :mod="mod">
      <button class="yp-button yp-button-red yp-button-sm rounded-sm" id="ypimport">导入</button>
      </ypimport>
      <button class="yp-button yp-button-sm rounded-sm" @click="add" v-if="isbtn('add')">增加</button>

    </div>
  </template>
  <template #list>
    <div class="border p-2 shadow">
        <div class="flex items-center">
          <div class="w-14">标题</div>
          <div>
            <ypinput v-model="keyword"></ypinput>
          </div>
        </div>
    </div>
    <table class="table-auto w-full text-sm mt-3">
      <thead>
        <tr class="text-left bg-gray-100">
          <th class="px-2 py-2 border w-10 font-thin">
            <ypcheckbox value="all" v-model="checkedAll" v-tooltip.top="'全选'"></ypcheckbox>
          </th>
          <th class="px-2 py-2 border">ID</th>
          <template v-for="(item,index) in mod.modcolumn" :key="index">
            <th class="px-2 py-2 border" v-if="parseInt(item.colwidth)">
              {{item.alias}}
            </th>
          </template>

          <th class="px-2 py-2 border w-32 text-center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-gray-100" v-for="(vo,key) in modData.list" :key="key">
          <td class="border px-2">
            <ypcheckbox :value="vo.id" v-model="selectIds"></ypcheckbox>
          </td>
          <td class="border px-2">{{vo.id}}</td>
          <template v-for="(item,index) in mod.modcolumn" :key="index">
            <td class="px-2 py-2 border" v-if="parseInt(item.colwidth)">
              {{vo[item.name]}}
            </td>
          </template>
          <td class="border p-2 text-right">
            <button class="yp-button yp-button-sm yp-button-green rounded-sm mr-2" @click="restore(vo.id)" v-if="modData.isremove">还原</button>
            <button class="yp-button yp-button-sm rounded-sm mr-2" @click="edit(vo)" v-else>编辑</button>
            <button class="yp-button yp-button-red yp-button-sm rounded-sm" @click="removeItem(vo.id)" v-if="modData.isremove">删除</button>
            <button class="yp-button yp-button-orange yp-button-sm rounded-sm" @click="destory(vo.id)" v-else>回收站</button>
          </td>
        </tr>

      </tbody>
      <tfoot>
        <tr>
          <td class="border p-2">
            <ypcheckbox value="all" v-model="checkedAll" v-tooltip.top="'全选'"></ypcheckbox>
          </td>
          <td class="border p-2" colspan="1000">
            <div class="space-x-2" v-if="modData.isremove">
              <button class="yp-button yp-button-sm yp-button-green rounded-sm" @click="restore(0)" v-tooltip.bottom="'批量还原'">还原</button>
              <button class="yp-button yp-button-red yp-button-sm rounded-sm" @click="removeItem(0)" v-tooltip.bottom="'批量删除'">删除</button>
            </div>
            <div class="space-x-2" v-else>
              <button class="yp-button yp-button-sm yp-button-orange rounded-sm" @click="destory(0)" v-tooltip.bottom="'批量移入回收站'">回收站</button>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </template>
</yplayout>


</template>
<script setup>
import { getData,confirms,authBtn,alter,Download,ParseCol} from '@/api/data'
import { ref, watch, reactive, onMounted, provide } from 'vue'
import Add from './add.vue'
const prop = defineProps({
  mod: {
    type: Object
  }
})
const emits = defineEmits(['jumpCom'])
const modpath=prop.mod.name
//搜索
const keyword = ref('')
watch(keyword, (newVal, oldVal) => {
  if (newVal == '') {
    getList()
  }
})

//复选框
const selectIds = reactive([])
const checkedAll = reactive([])
watch(checkedAll, (newVal, oldVal) => {
  selectIds.length = 0
  if (newVal.length > 0) {
    modData.list.forEach((item) => {
      selectIds.push(item.id)
    })
  } else {
    selectIds.length = 0
  }
})
//分页
const  pageData=reactive({
  totalRecords:0,//总记录数
  pageCount:0,//总页数
  currentPage:1//当前页
 });
const topage = (page) => {
  pageData.currentPage=page
  getList()
}

//数据对象
const modData = reactive({
  isremove: false, //回收站切换
  removenum: 0, //回收站数量
  list: [], //数据
})
//获取数据
const getList = async () => {
  modData.list.length = 0
  selectIds.length = 0
  checkedAll.length=0
  const res = await getData(modpath+'/index', {
    isremove: modData.isremove ? 1 : 0,
    page: modData.curpage,
    keyword: keyword.value
  })
  if (res.code == 1) {
    modData.removenum = res.data.removeNum
    pageData.currentPage = res.data.current_page
    pageData.pageCount = res.data.last_page
    pageData.totalRecords = res.data.total
    res.data.data.map((item) => {
      modData.list.push(item)
    })
  }
}

//移入回收站
const destory = async (id = 0) => {
  if (id == 0) {
    id = selectIds
  }
  if (!id) {
    alter({ type: 'alter-error', text: '请选择项目' })
    return
  }
  const res = await getData(modpath+'/delete', {
    ids: id
  })
  if (res.code) {
    alter({ type: 'alter-success', text: res.msg })
    selectIds.length = 0
    getList()
  }
}
//回收站删除
const removeItem = (id) => {
  if (id == 0) {
    id = selectIds
  }
  if (!id) {
    alter({ type: 'alter-error', text: '请选择项目' })
    return
  }
  confirms({ text: '确认删除吗？' })
    .then(async () => {
      const res = await getData(modpath+'/delete', {
        ids: id
      })
      if (res.code) {
        alter({ type: 'alter-success', text: res.msg })
        getList()
      }
    })
    .catch((e) => {})
}
//回收站还原
const restore = async (id) => {
  if (id == 0) {
    if (selectIds.length == 0) {
      alter({ type: 'alter-error', text: '请选择项目' })
      return
    }
    id = selectIds
  }
  if (!id) {
    alter({ type: 'alter-error', text: '请选择项目' })
    return
  }
  const res = await getData(modpath+'/restore', {
    ids: id
  })
  if (res.code) {
    alter({ type: 'alter-success', text: res.msg })
    selectIds.length = 0
    getList()
  }
}
//回收站切换
watch(
  () => modData.isremove,
  (newVal, oldVal) => {
    getList()
  }
)


//导出选中项目
const ypexport = () => {
  if (selectIds.length == 0) {
    alter({ type: 'alter-error', text: '请选择项目' })
    return
  }
  confirms({ text: '确定导出吗？' })
    .then(async () => {
      const res = await Download(modpath+'/export', {
        ids: selectIds
      })
      let blob = new Blob([res.data])
      let contentDisposition = res.headers['content-disposition']
      let patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
      let result = patt.exec(contentDisposition)
      let thename = decodeURI(result[1]) //使用decodeURI对名字进行解码
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(blob) //创建下载的链接
      downloadElement.style.display = 'none'
      downloadElement.href = href
      downloadElement.download = thename //下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() //点击下载
      document.body.removeChild(downloadElement) //下载完成移除元素
      window.URL.revokeObjectURL(href) //释放掉blob对象
    })
    .catch((e) => {})
}



//权限按钮
const isbtn = (btn) => {
  const modname = prop.mod.name
  return authBtn(modname,btn)
}

const add=()=>{
  emits('jumpCom',{to:Add})
}

//页面加载后
onMounted(async () => {
  getList()
})
</script>
