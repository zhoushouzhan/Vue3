<template>
    <yplayout>
      <template #header="head">
        <i class="ri-2x text-gray-500 ml-2" :class="head.meta.icon||'ri-information-line'"></i>
        <div class="text-xl px-3" v-html="head.meta.title"></div>
        <div class="text-gray-400">管理中心</div>
        <div class="flex-1"></div>
        <div class="hidden md:block">
          <div class="flex space-x-1">
            <ypinput v-model="keywords" placeholder="关键词"></ypinput>
            <button class="yp-button yp-button-sm rounded-sm" @click="search">搜索</button>
          </div>
        </div>

      </template>
      <template #list="meta">
        <div>
          <button class="yp-button yp-button-sm rounded-sm" @click="add" v-if="isbtn('add')">增加</button>
        </div>
        <table class="yp-table-datalist mt-2">
          <thead>
            <tr>

              <th class="px-2 py-2 w-10 font-thin">
                <ypcheckbox value="all" v-model="checkedAll" v-tooltip.top="'全选'"></ypcheckbox>
              </th>



              <th>
                名称
              </th>
              <th>
                热度
              </th>

              <th class="w-40">操作</th>
            </tr>
          </thead>

          <tbody>
            <template v-for="(item,index) in dataList" :key="index">
              <tr>
                <td class="px-2">
                <ypcheckbox :value="item.id" v-model="selectIds"></ypcheckbox>
                </td>
                  <td>
                    {{ item.title }}
                  </td>
                  <td>
                    {{ item.used||0 }}
                  </td>
                <td class="space-x-2">
                  <button class="yp-button yp-button-sm rounded" @click="edit(item.id)">编辑</button>
                  <button class="yp-button yp-button-sm yp-button-red rounded" @click="destory(item.id)">删除</button>
                </td>
              </tr>
            </template>
          </tbody>
          <tfoot>
            <tr>
                <td class="p-2">
                <ypcheckbox value="all" v-model="checkedAll" v-tooltip.right="'全选'"></ypcheckbox>
                </td>
                <td class="p-2" colspan="3">
                <div class="space-x-2">
                  <button class="yp-button yp-button-red yp-button-sm rounded-sm" @click="removeItem(0)" v-tooltip.bottom="'批量删除'">批量删除</button>
                </div>

                </td>
            </tr>
            </tfoot>


        </table>
        <div class="mt-3" v-if="pageData.pageCount>1">
          <yppage @topage="topage" :pageData="pageData" />
        </div>
      </template>
    </yplayout>
    <ypdialog width="1200" :title="dialogTitle" :mask="1" v-if="VisibleDialog" @close="VisibleDialog=false">
      <component :is='componentId' :id="Id" :mod="mod" @close="VisibleDialog=false" @getList="getList"></component>
    </ypdialog>
  </template>
  <script setup>
  import { useRoute } from 'vue-router'
  import { getData,postData,alter,confirms,authBtn } from '@/api/data'
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
  const Id = ref(0)
  //keyword
  const keywords = ref('')
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


//复选框
const selectIds = reactive([])
const checkedAll = reactive([])
watch(checkedAll, (newVal, oldVal) => {
  selectIds.length = 0
  if (newVal.length > 0) {
    dataList.forEach((item) => {
      selectIds.push(item.id)
    })
  } else {
    selectIds.length = 0
  }
})


  const getList = async () => {
    const resp = await getData('/tags/index', {
      keywords: keywords.value,
      page: pageData.currentPage
    })
    if (resp.code == 1) {
      dataList.length = 0
      pageData.currentPage = resp.data.current_page
      pageData.pageCount = resp.data.last_page
      pageData.totalRecords = resp.data.total
      resp.data.data.forEach((item) => {
        dataList.push(item)
      })
    }
  }
  const edit = (id) => {
      dialogTitle.value = '编辑信息'
      Id.value = id
      VisibleDialog.value = true
    }
  const add = () => {
    dialogTitle.value = '增加信息'
    Id.value = 0
    VisibleDialog.value = true
  }
  const search=()=>{
    getList()
  }
  const destory=(id)=>{
    confirms({ text: '确认删除吗？' }).then(async ()=>{
      const resp= await postData('/tags/delete',{
        ids:id
      })
      if (resp.code == 1) {
        getList()
        alter({ type: 'alter-success', text: res.msg })
      }
    }).catch(()=>{})
  }
//权限按钮
const isbtn = (btn) => {
  const modname = meta.mod.name
  return authBtn(modname,btn)
}

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
      const res = await getData('/tags/delete', {
        ids: id
      })
      if (res.code) {
        alter({ type: 'alter-success', text: res.msg })
        getList()
      }
    })
    .catch((e) => {})
}

  onMounted(async () => {
    getList()
  })
  </script>