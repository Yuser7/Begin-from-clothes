// index.js
// 获取应用实例
const app = getApp()

Page({
  data:{
    message:[]
  },
  //初始加载数据
  getData:function(e){
    
    this.setData({
      message:[]
    })
    let that = this;
    wx.cloud.callFunction({
      name: "love_getTie",
      //一次加载5条数据，下拉加载更多
      data:{
        count:10,
        page:0
      },
      success:res=>{
        console.log("res",res);
        //旧的数据加新获取数据的拼接
        let oldData = that.data.message;
        let newData = oldData.concat(res.result.list);
        that.setData({
          message:newData
        })
        console.log(that.data.message);
        wx.hideLoading({
          success: (res) => {},
        })
      },
      fail: res => {
        console.log("res", res)
      }
    })
  },
  //详情展示
  show:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/show/show'+'?id='+e.currentTarget.dataset.id,
    })
  },
  //逆序加载10篇
  onShow:function(e){
    let openid = wx.getStorageSync('openid');
    let userinfo = wx.getStorageSync('userinfo');
    console.log(openid);
    if(openid=="" || openid==null){
      wx.showToast({
        title: '请先登陆',
        duration:1000,
        icon:"none",
        success:function(e){
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/me/me',
            })
          }, 500);
        }
      })
    }else{
      this.setData({
        openid:openid,
        userinfo:userinfo
      })
      wx.showLoading({
        title: '加载中...',
      })
      this.getData();
    }
  },
  //下拉刷新效果
  onPullDownRefresh() {
    console.log('11')
    wx.showLoading({
      title: '刷新中...',
    })
    this.setData({
      message:[]
    })
    let that = this;
    wx.cloud.callFunction({
      name: "love_getTie",
      //一次加载5条数据，下拉加载更多
      data:{
        count:10,
        page:0
      },
      success:res=>{
        console.log("res",res);
        //旧的数据加新获取数据的拼接
        let oldData = that.data.message;
        let newData = oldData.concat(res.result.list);
        that.setData({
          message:newData
        })
        console.log(that.data.message);
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '加载成功',
              duration:1000,
              icon:"success",
              success:function(e){
                wx.stopPullDownRefresh();
              }
            })
          },
        })
      },
      fail: res => {
        console.log("res", res)
      }
    })
    
  },
  
  //上拉加载新数据
  onReachBottom: function () {
    console.log('加载新数据')
    let count = 5;
    let page = this.data.message.length
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'love_getTie',
      data:{
        count:count,
        page:page
      },success:function(ev){
        console.log(ev);
        //数据的继续拼接
        let newData = that.data.message.concat(ev.result.list);
        that.setData({
          message:newData
        })
        wx.hideLoading({
          success: (res) => {},
        })
      },fail:function(ev){
        console.log(ev);
      }
    })
  }
})
