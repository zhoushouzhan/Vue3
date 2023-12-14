<template>
  <div>
    <ypform :formData="formData" :group="mod.colgroup" :mod="mod" :isPreview="0" @save="save" v-if="isload==1"></ypform>
  </div>
</template>
<script setup>
  import { getData, postData,FormCol, alter } from '@/api/data'
  import { ref, reactive, onMounted } from 'vue'
  const props = defineProps({
    mod: {
      type: Object
    },
    id: {
      type: Number,
      default: 0
    }
  })
  const emits = defineEmits(['getList'])
  const formData = reactive({})
  const isload = ref(0)
  const save = async (formParams) => {
    let res = await postData('/member/save', formParams)
    if (res.code == 1) {
      alter({ type: 'alter-success', text: res.msg })
      emits('getList')
    }
  }
  onMounted(async () => {
    if(props.id){
      const res = await getData('/member/details', { id: props.id })
      if (res.code == 1) {
        if (props.id) {
          formData['id'] = props.id
        }
        let column = props.mod.modcolumn
        Object.keys(column).map((k) => {
          let name = column[k].name
          formData[name] = FormCol(column[k],res.data)
        })
      }
    }
    isload.value = 1
  })
</script>