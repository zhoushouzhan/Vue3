/*
 * @Author: 一品网络技术有限公司
 * @Date: 2022-06-21 22:45:34
 * @LastEditTime: 2022-08-18 10:24:47
 * @FilePath: \ypcmsvue3\tailwind.config.cjs
 * @Description:
 * 联系QQ:58055648
 * Copyright (c) 2022 by 东海县一品网络技术有限公司, All Rights Reserved.
 */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,css}"],
  theme: {},
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ["group-focus"],
      display: ["group-focus"],
    },
  },
};
