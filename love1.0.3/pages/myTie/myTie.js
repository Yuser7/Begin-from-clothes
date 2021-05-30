// pages/myTie/myTie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    //加载我的所有帖子
    wx.cloud.callFunction({
      name:'love_getMyTie',
      data:{
        openid:wx.getStorageSync('openid')
      },
      success:function(e){
        console.log(e.result.data);
        let asmm=wx.getStorageSync('userinfo');
        //console.log('666');
        console.log(asmm);
        that.setData({
          myTie:e.result.data,
          userinfo:wx.getStorageSync('userinfo')
        })
      },
      fail:function(e){

      }
    })
  },
  show:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/show/show'+'?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})