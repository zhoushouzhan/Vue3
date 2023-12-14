<!--
 * @Author: 一品网络技术有限公司
 * @Date: 2022-07-08 14:26:03
 * @LastEditTime: 2022-09-20 11:03:11
 * @FilePath: \ypcmsvue3\src\components\global\ypeditor\ypeditor.vue
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
 * https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/vuejs-v3.html#using-es6-modules
-->
<template>
  <div class="flex-1" @click.stop="">
    <ckeditor :editor="ClassicEditor" v-model="content" :config="editorConfig" @ready="onEditorReady" @input="onEditorInput"></ckeditor>
  </div>
</template>
<script setup>
import ClassicEditor from 'ckeditor5-custom-build'
import store from '@/store'
const props = defineProps({
  modelValue: {
    type: String,
    default: 'sss'
  }
})
const content = props.modelValue
//ckeditor config
const editorConfig = {
  simpleUpload: {
    uploadUrl: import.meta.env.VITE_UPLOADURL,
    withCredentials: true,
    headers: {
      'x-requested-with': 'XMLHttpRequest',
      Authorization: store.state.User.token
    }
  }
}
const emit = defineEmits(['update:modelValue'])
const onEditorInput = (e) => {
  emit('update:modelValue', e)
}
// listen in
const onEditorReady = (editor) => {
  // editor.editing.view.document.on('keydown', (evt, data) => {
  //   if (data.keyCode == 65) {
  //     console.log('AAAAAA!!')
  //     editor.model.change((writer) => {
  //       // Insert the text at the user's current position.
  //       editor.model.insertContent(writer.createText('AAAAAA'))
  //     })
  //     data.preventDefault()
  //     evt.stop()
  //   }
  // })
  // editor.keystrokes.set('Ctrl+B', (data, stop) => {
  //   console.log(data)
  // })
}
</script>
