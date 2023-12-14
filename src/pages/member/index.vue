<template>
  <yplayout>
    <template #header="head">
      <i class="ri-2x text-gray-500 ml-2" :class="head.meta.icon||'ri-information-line'"></i>
      <div class="text-xl px-3" v-html="head.meta.title"></div>
      <div class="text-gray-400">管理中心</div>
      <div class="flex-1"></div>
    </template>
    <template #list="meta">
      <div class="search-area">
        <div><ypinput v-model="keyword" placeholder="账号|手机号" @keyup.enter="getList"></ypinput></div>
      </div>
      <div class="btn-list">
        <div><button class="yp-button yp-button-sm rounded" @click="add">增加会员</button></div>
      </div>
      <table class="yp-table-datalist">
        <thead>
          <tr>
            <th class="w-20 text-center">ID</th>
            <template v-for="(item,index) in meta.data.mod.modcolumn" :key="index">
              <th v-if="item.colwidth">
                {{ item.alias }}
              </th>
            </template>
            <th class="w-40">操作</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(item,index) in dataList" :key="index">
            <tr>
              <td class="text-center">{{ item.id }}</td>
              <template v-for="(v,k) in meta.data.mod.modcolumn" :key="k">
                <td v-if="v.colwidth">
                  {{ ParseCol(v,item) }}
                </td>
              </template>
              <td class="space-x-2">
                <button class="yp-button yp-button-sm rounded" @click="edit(item.id)">编辑</button>
                <button class="yp-button yp-button-sm yp-button-red rounded" @click="destory(item.id)">删除</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="mt-6" v-show="pageData.pageCount>1">
        <yppage @topage="topage" :pageData="pageData" />
      </div>
    </template>
  </yplayout>
  <ypdialog width="1200" :title="dialogTitle" :mask="1" v-if="VisibleDialog" @close="VisibleDialog=false">
    <component :is='componentId' :id="memberId" :mod="mod" @close="VisibleDialog=false" @getList="getList"></component>
  </ypdialog>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { getData,ParseCol } from '@/api/data'
import { onMounted, reactive, ref, shallowRef, watch } from 'vue'
import Form from './form.vue'
//mod
const route = useRoute()
const meta = route.meta
const mod = meta.mod
//dialog
const componentId = shallowRef(Form)
const dialogTitle = ref('')
const VisibleDialog = ref(false)
const memberId = ref(0)
//keyword
const keyword = ref('')
const dataList = reactive([])

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

watch(keyword, (newVal, oldVal) => {
  if (newVal != '') {
    getList()
  }
})
const getList = async () => {
  const resp = await getData('/member/index', {
    keyword: keyword.value,
    page: pageData.currentPage
  })
  if (resp.code == 1) {

    pageData.totalRecords = resp.data.total
    pageData.pageCount = resp.data.last_page


    dataList.length = 0
    resp.data.data.forEach((item) => {
      dataList.push(item)
    })
  }
}
const edit = (id) => {
  dialogTitle.value = '编辑会员'
  memberId.value = id
  VisibleDialog.value = true
}
const add = () => {
  dialogTitle.value = '增加会员'
  memberId.value = 0
  VisibleDialog.value = true
}
onMounted(async () => {
  getList()
})
</script>