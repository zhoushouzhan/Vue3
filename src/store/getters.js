/*
 * @Author: 一品网络技术有限公司
 * @Date: 2022-09-10 09:18:16
 * @LastEditTime: 2022-10-17 21:20:34
 * @FilePath: \vue3\src\store\getters.js
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
 */
const getters = {
  userId: (state) => state.User.id,
  formItem: (state) => state.Sys.sysinfo.model.formitem,
  colType: (state) => state.Sys.sysinfo.model.colType,
  modType: (state) => state.Sys.sysinfo.model.modType,
  actions: (state) => state.Sys.sysinfo.model.actions,
  roles: (state) => state.Sys.sysinfo.admin.roles,
  openMenuId: (state) => state.Sys.openMenuId,
  currentMenu:(state)=>state.Sys.currentMenu,
  routes: (state) => state.User.route,
  mybtn: (state) => {
    let objbtn = state.Sys.sysinfo.admin.rolesBtn
    return objbtn;
  },
};

export default getters;
