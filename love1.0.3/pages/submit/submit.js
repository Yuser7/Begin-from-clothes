Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    tempFilePaths: [],
    nowCount:0//当前的图片上传个数
  },
  //图片的上传
  chooseImage:function(e){
    let that = this;
    wx.chooseImage({
      count: 9, // 默认最多9张图片，可自行更改
      sizeType: ['original', 'compressed'],// 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePath = res.tempFilePaths;
        console.log(tempFilePath);
        let nowCount = that.data.nowCount;
        let tempFilePaths = that.data.tempFilePaths;
        
        if(that.data.nowCount + tempFilePath.length >=9){
          let i = 0;
          while(nowCount<9){//还可以继续上传图片
            tempFilePaths.push(tempFilePath[i]);
            i++;
            nowCount++;
          }
          that.setData({
            nowCount:9,
            tempFilePaths:tempFilePaths
          })
        }else{
          let i = 0;
          while(i<tempFilePath.length){
            tempFilePaths.push(tempFilePath[i]);
            i++;
          }
          that.setData({
            nowCount:that.data.nowCount + tempFilePath.length,
            tempFilePaths:tempFilePaths
          })
        }

        console.log(that.data.nowCount,that.data.tempFilePaths);
      }
    })
  },
  //长按删除图片
  DeleteImg: function (e) {
    let that = this;
    let tempFilePaths = that.data.tempFilePaths;
    let index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //console.log('点击确定了');
          let nowCount = that.data.nowCount;
          that.setData({
            nowCount:nowCount-1
          })
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          //console.log('点击取消了');
          return false;
        }
        that.setData({
          tempFilePaths:tempFilePaths
        });
      }
    })
  },
  //上传文件到云端
  submit:function(e){
    let i;
    let count=0;
    let that = this;
    let url = [];
    console.log(e);
    let title = e.detail.value.name;
    let content = e.detail.value.content;
    if(title.length<3){
      wx.showToast({
        title: '标题少于3个字',
        icon:"none"
      })
      return false
    }
    if(content.length<5){
      wx.showToast({
        title: '内容少于5个字',
        icon:"none"
      })
      return false
    }
   wx.showLoading({
     title: '发布中',
   })
   if(that.data.nowCount==0){
    wx.cloud.callFunction({
      name:'love_upload',
      data:{
        title:title,
        content:content,
        openid:that.data.openid,
        url:[]
      },success:function(e){
        console.log(e);
        wx.hideLoading({
          success: (res) => {
            that.setData({
              value1:'',
              value2:'',
              tempFilePaths:[],
              nowCount:0
            })
            wx.showToast({
              title: '发布成功',
            })
          },
        })
      },fail:function(e){
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '网络异常',
            })
            that.setData({
              value1:'',
              value2:'',
              tempFilePaths:[],
              nowCount:0
            })
          },
        })
        console.log(e);
      }
    })
   }else{
    //将所有的内容上传到云端去
    for(i=0;i<that.data.nowCount;i++){
      console.log(1);
      let extName = that.data.tempFilePaths[i].split(".").pop();
      let cloudPath = "love/" + new Date().getTime() + "." + extName;
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: that.data.tempFilePaths[i], // 文件路径
        success: res => {
          count++;
          url.push(res.fileID);
          console.log('上次图片');
          console.log(i,url);
          if(count==that.data.nowCount){
            console.log(url);
            wx.cloud.callFunction({
              name:'love_upload',
              data:{
                title:title,
                content:content,
                openid:that.data.openid,
                url:url
                
              },success:function(e){
                console.log(e);
                wx.hideLoading({
                  success: (res) => {
                    that.setData({
                      value1:'',
                      value2:'',
                      tempFilePaths:[],
                      nowCount:0
                    })
                    wx.showToast({
                      title: '发布成功',
                    })
                  },
                })
              },fail:function(e){
                wx.hideLoading({
                  success: (res) => {
                    wx.showToast({
                      title: '网络异常',
                    })
                    that.setData({
                      value1:'',
                      value2:'',
                      tempFilePaths:[],
                      nowCount:0
                    })
                  },
                })
                console.log(e);
              }
            })
          }
        },fail:res=>{
          console.log(res);
        }
      })
    }
   }

  },



  blur:function(e){
    console.log(e);
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
          }, 1000);
        }
      })
    }else{
      this.setData({
        openid:openid,
        userinfo:userinfo
      })
    }
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