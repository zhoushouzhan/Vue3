<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-06-22 12:07:53
 * @LastEditTime: 2022-10-27 09:17:38
 * @FilePath: \vue3\src\pages\welcome.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>
  <div class="m-2 p-2 bg-white">
    <div class="bg-gray-500 text-white px-2 py-1">统计</div>
    <div class="p-3">
      <vue-echarts :option="option" :theme="theme" class="h-[500px]" ref="chart" />
    </div>
    <div class="bg-gray-500 text-white px-2 py-1">常用组件</div>
    <div class="p-3 space-y-1">
      <div class="grid grid-cols-9 gap-2 text-sm">
        <div class="col-span-1">输入框</div>
        <div class="col-span-5">
          <ypinput v-model="demoForm.inputval" placeholder="请输入内容"></ypinput>
        </div>
        <div class="col-span-9">{{demoForm.inputval}}</div>

        <div class="col-span-1">文本框</div>
        <div class="col-span-5">
          <yptextarea v-model="demoForm.textarea" placeholder="请输入文本"></yptextarea>
        </div>
        <div class="col-span-3">{{demoForm.textarea}}</div>

        <div class="col-span-1">缩略图</div>
        <div class="col-span-5">
          <ypthumb v-model="demoForm.thumb"></ypthumb>
        </div>
        <div class="col-span-3">{{demoForm.thumb}}</div>

        <div class="col-span-1">编辑器</div>
        <div class="col-span-5">
          <ypeditor v-model="demoForm.editor" ypclass="w-[500px]"></ypeditor>
        </div>
        <div class="col-span-3">{{demoForm.editor}}</div>
        <div class="col-span-1">编辑器2</div>
        <div class="col-span-5">
          <ypeditor v-model="demoForm.editor2" ypclass="w-[500px]"></ypeditor>
        </div>
        <div class="col-span-3">{{demoForm.editor2}}</div>

        <div class="col-span-1">下拉框</div>
        <div class="col-span-5">
          <ypselect :itemList="options" v-model="demoForm.selectval"></ypselect>
        </div>
        <div class="col-span-3">{{demoForm.selectval}}</div>

        <div class="col-span-1">单选</div>
        <div class="col-span-5">
          <ypradio :title="'单选一'" :value="'测试'" v-model="demoForm.radioval"></ypradio>
          <ypradio :title="'单选二'" :value="'2'" v-model="demoForm.radioval"></ypradio>
        </div>
        <div class="col-span-3">{{demoForm.radioval}}</div>

        <div class="col-span-1">多选</div>
        <div class="col-span-5">
          <ypcheckbox :title="'多选一'" :value="'值一'" v-model="demoForm.checkboxval"></ypcheckbox>
          <ypcheckbox :title="'多选二'" :value="'值二'" v-model="demoForm.checkboxval"></ypcheckbox>
          <ypcheckbox :title="'多选三'" :value="'值三'" v-model="demoForm.checkboxval"></ypcheckbox>
          <ypcheckbox :title="'多选四'" :value="'值四'" v-model="demoForm.checkboxval"></ypcheckbox>
        </div>
        <div class="col-span-3">{{demoForm.checkboxval}}</div>
        <div class="col-span-1">开关</div>
        <div class="col-span-5">
          <ypswitch v-model="demoForm.switch"></ypswitch>
        </div>
        <div class="col-span-3">{{demoForm.switch}}</div>

        <div class="col-span-1">日期时间</div>
        <div class="col-span-5">
          <ypdatetime v-model="demoForm.datetime"></ypdatetime>
        </div>
        <div class="col-span-3">{{demoForm.datetime}}</div>
        <div class="col-span-1">日期</div>
        <div class="col-span-5">
          <ypdate v-model="demoForm.date"></ypdate>
        </div>
        <div class="col-span-3">{{demoForm.date}}</div>
        <div class="col-span-1">菜单</div>
        <div class="col-span-5">
          <yptree :itemList="list" v-model="demoForm.menu"></yptree>
        </div>
        <div class="col-span-3">{{demoForm.menu}}</div>
        <div class="col-span-1">弹窗</div>
        <div class="col-span-5">
          <button class="yp-button" @click="VisibleDialog=true">打开窗口</button>
        </div>
        <div class="col-span-3">{{VisibleDialog}}</div>
      </div>
      <div>
      </div>
    </div>
  </div>
  <ypdialog width="800" :mask="1" v-if="VisibleDialog" @close="VisibleDialog=false"></ypdialog>
</template>
<script setup>
import { getData, postData, alter } from '@/api/data'
import axios from '@/axios'
import store from '@/store'
import { ref, reactive, onMounted,computed } from 'vue'
import { VueEcharts } from 'vue3-echarts'

const routes = computed({
  get() {
    return store.getters.routes
  }
})
//dialog
const VisibleDialog = ref(false)
const options = [
  { value: 3, title: '选项一' },
  { value: 1, title: '选项二' },
  { value: 2, title: '选项三' }
]
const demoForm = reactive({
  inputval: '',
  textarea: '',
  thumb: 0,
  editor: '',
  editor2: '',
  selectval: 3,
  radioval: '1',
  checkboxval: [],
  switch: true,
  datetime: '2022-08-30 16:02:30',
  date: '2022-08-30',
  menu: 0
})
const option = reactive({
  title: {
    text: '模型统计',
    subtext: '一品技术',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '数据源',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '文章' },
        { value: 735, name: '下载' },
        { value: 580, name: '评论' },
        { value: 484, name: '用户' },
        { value: 300, name: '动态' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const theme = ref('')
const chart = ref(null)
const list = ref([])
const ypmenuData=reactive([])
onMounted(async () => {
  const resp = await axios.get('/rule')
  list.value = resp.data

  const res = await getData('/category/getList')
  if (res.code == 1) {
    res.data.map((item) => {
      ypmenuData.push(item)
    })
  }


})
</script>