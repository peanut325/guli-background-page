# 谷粒学院后台管理系统前端页面
vueAdmin-template是基于vue-element-admin的一套后台管理系统基础模板（最少精简版），可作为模板进行二次开发。

GitHub地址：https://github.com/PanJiaChen/vue-admin-template

建议：你可以在 vue-admin-template 的基础上进行二次开发，把 vue-element-admin当做工具箱，想要什么功能或者组件就去 vue-element-admin 那里复制过来
## 项目目录结构
- build // 构建脚本
- config // 全局配置
- node_modules // 项目依赖模块
- src //项目源代码
- static // 静态资源
- package.jspon // 项目信息和依赖配置

## src下的目录结构
- api // 各种接口
- assets // 图片等资源
- components // 各种公共组件，非公共组件在各自view下维护
- icons //svg icon
- router // 路由表 
- store // 存储
- styles // 各种样式
- utils // 公共工具，非公共工具，在各自view下维护
- views // 各种layout
- App.vue //***项目顶层组件***
- main.js //***项目入口文件***
- permission.js //认证入口