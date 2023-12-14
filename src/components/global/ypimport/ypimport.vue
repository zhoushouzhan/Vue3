<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-08-06 14:05:19
 * @LastEditTime: 2022-10-14 10:41:07
 * @FilePath: \vue3\src\components\global\ypimport\ypimport.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
-->
<template>
  <div ref="uploadbtn">
    <slot></slot>
    <teleport to='body'>
      <div class="w-1/2 absolute bg-blue-500 text-white z-20 p-2" ref="uploadStatus" v-show="uploading">
        <div v-for="(item,index) in uploadList" :key="index" class="flex">
          <div>
            {{item.name}}
          </div>
          <div>
            {{item.id}}
          </div>
        </div>
      </div>
    </teleport>
  </div>

</template>
<script setup name="Nypimport">
import store from '@/store'
import { onMounted, getCurrentInstance, ref, reactive, watch } from 'vue'
import plupload from 'plupload'
const { proxy } = getCurrentInstance()
const prop = defineProps({
  mod: {
    type: Object
  }
})
const uploading = ref(false)
const uploadList = reactive([])
const uploader = new plupload.Uploader({
  multi_selection: false,
  url: '/admin.php/listInfo/import',
  headers: {
    Authorization: localStorage.getItem('token'),
    //ajax方式传送
    'x-requested-with': 'XMLHttpRequest'
  }
})
const uploadbtn = ref(null)
const uploadStatus = ref(null)
watch(uploading, (newVal, oldVal) => {
  if (newVal) {
    uploadStatus.value.style.cssText =
      'left:' +
      uploadbtn.value.offsetLeft +
      'px;top:' +
      (uploadbtn.value.offsetTop + uploadbtn.value.clientHeight) +
      'px'
  }
})
watch(
  () => prop.mod,
  (mod) => {
    upinit()
  }
)
const upinit = () => {
  uploader.setOption('browse_button', 'ypimport')
  uploader.setOption('multipart_params', {
    modid: prop.mod.id
  })
  uploader.setOption('filters', {
    mime_types: [
      //只允许上传图片和zip文件
      { title: 'Files', extensions: 'xlsx,docx' }
    ],
    max_file_size: store.state.Sys.sysinfo.uploadsize + 'kb', //最大只能上传400kb的文件
    prevent_duplicates: true //不允许选取重复文件
  })
  uploader.init()
  uploader.bind('FilesAdded', (uploader, files) => {
    uploading.value = true
    files.map((val, ind) => {
      let src = ''
      if (val.type.indexOf('application') < 0) {
        src = URL.createObjectURL(val.getNative())
      }

      let obj = {}
      obj.id = val.id
      obj.name = val.name
      obj.type = val.type
      obj.size = parseInt((val.origSize / 1024 / 1024) * 100) / 100
      obj.progress = 0
      obj.status = 0
      obj.src = src
      uploadList.push(obj)
    })
  })

  uploader.bind('BeforeUpload', (uploader, file) => {})
  uploader.bind('UploadProgress', (uploader, file) => {})
  uploader.bind('FileUploaded', (uploader, file, res) => {
    let r = JSON.parse(res.response)
  })

  uploader.bind('UploadComplete', (uploader, files) => {
    proxy.$Alter({ type: 'alter-success', text: '上传完毕' })
    uploadList.splice()
  })

  uploader.bind('FilesAdded', (uploader, files) => {
    uploader.start()
  })
}

//文件上传
onMounted(() => {
  if (prop.mod) {
    upinit()
  }
})
</script>
