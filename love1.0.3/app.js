// app.js
App({
 //配置云开发
 onLaunch: function () {
  wx.cloud.init({
    env:"env-suyutong-0ghktlh4ced266b0",
    traceUser:true//是否访问权限可见
  })
}
})
