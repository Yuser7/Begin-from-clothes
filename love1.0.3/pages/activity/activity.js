// pages/index/index.js
Page({

  data:{
    dataList:[
      {title:"约拍",time:"活动时间自主选择",place:"活动地点自主选择",jumpPage:"jumpPage1",url:"/image/1_pic.jpg"},

      {title:"平安福刺绣",time:"活动时间：2021-04-25",place:"学活305",jumpPage:"jumpPage2",url:"/image/2_pic1.jpg"}
    ]
  },

  jumpPage1: function () {
    wx.navigateTo({
      url: '/pages/1/1',
    })
  },

  jumpPage2: function () {
    wx.navigateTo({
      url: '/pages/2/2',
    })
  },

  contact: function () {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  }

})