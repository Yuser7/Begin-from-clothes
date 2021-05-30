// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   asmopenid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.检测story是否保存了用户信息
    let that=this;
    let info = wx.getStorageSync('userinfo');
    let openid = wx.getStorageSync('openid');
    this.data.openid=openid;
    //console.log('mmmm'+openid);
    if(!info){
      
    }else{
      //缓存有，直接登陆上去
      this.setData({
        userinfo:info,
        openid:openid
      })
    }
  },

  //登陆实现
  getUserProfile:function(e){
    //1.用户进入页面，提示登陆。
    //let that=this;
    wx.getUserProfile({
      desc:'用于完善个人资料',
      success:(res)=>{
        console.log("获取用户信息成功",res)
        let info = wx.getStorageSync('userinfo');
        if(info=='' || info==null){
          wx.setStorageSync('userinfo', res.userInfo);
        }//if
        info = wx.getStorageSync('userinfo');
        that.setData({
          userinfo:info,
          openid:that.data.openid
        })
      },
      fail:res=>{
        console.log("获取用户信息失败",res)
      }
    })
    wx.showLoading({
      title: '登陆中....',
    })
    let that = this;
    let info = e.detail.userInfo;
    console.log(info);
    wx.cloud.callFunction({
      name:"love_login",
      success:function(e){
        console.log(e.result.openid);
        if(e.result.openid)
          that.setData({
            openid:e.result.openid,
            userinfo:info
          })
          //先去判断用户之前是否注册入库，如果未注册，注册入库
          wx.cloud.callFunction({
            name:"love_iszhu",
            data:{
              openid:that.data.openid
            },success:function(e){
              if(e.result.data.length==0)//未入库，进行入库
              {
                wx.cloud.callFunction({
                  name:'love_register',
                  data:{
                    username:that.data.userinfo.nickName,
                    head:that.data.userinfo.avatarUrl,
                    openid:that.data.openid
                  },success:function(ev){
                  console.log(ev);
                    wx.hideLoading({
                      success: (res) => {},
                    })
                    wx.showToast({
                      title: '登陆成功',
                      icon:"success",
                      duration:2000
                    })
                  },fail:function(e){
                    console.log(e);
                  }
                })
              }else{//已经入库，直接从数据库读取信息
                console.log('已经注册');
                wx.showToast({
                  title: '登陆成功',
                  icon:"success",
                  duration:2000
                })
                wx.hideLoading({
                  success: (res) => {},
                })
              }
               //用户信息保存到数据库和缓存里面
               wx.setStorageSync('userinfo', that.data.userinfo);
               wx.setStorageSync('openid', that.data.openid);
            },fail:function(e){
              console.log(e);
            }
          })
}
})
},
//活动更新
update:function(e){
  if(this.data.openid==null || this.data.openid==undefined){
    wx.showToast({
      title: '请先登陆',
    })
  }else{
    wx.navigateTo({
      url: '/pages/update/update',
    })
  }
  
},
//加载我的帖子
myTie:function(e){
  if(this.data.openid==null || this.data.openid==undefined){
    wx.showToast({
      title: '请先登陆',
    })
  }else{
    wx.navigateTo({
      url: '/pages/myTie/myTie'
    })
  }
},
})