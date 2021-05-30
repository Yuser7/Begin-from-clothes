// pages/offline/2/2.js
Page({
  data: {
    hiddenmodalput: true,
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框 
},

  modalinput: function() {
    this.setData({
        hiddenmodalput: !this.data.hiddenmodalput
    })
  },  //点击按钮痰喘指定的hiddenmodalput弹出框 

  cancel: function() {
    this.setData({
        hiddenmodalput: true
    });
  },//取消按钮 

  confirm: function() {
    this.setData({
        hiddenmodalput: true
    })
  },//确认 

  onSubmit:function(e){
    var name = e.detail.value.name
    var id = e.detail.value.id
    var pay = e.detail.value.pay

    wx.cloud.callFunction({
      name:'signup',
      data:{
        name:name,
        id:id,
        pay:pay
      },
    })
  },
  
})