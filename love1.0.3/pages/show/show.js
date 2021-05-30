// pages/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    first:true,
    answer_author:"快来发布精彩评论吧",
    type:0
  },
  getData:function(e){
    let that = this
    wx.cloud.callFunction({
      name:'love_getAllComment',
      data:{
        tid:that.data.info._id
      },success:function(e){
        console.log(e)
        let comments = e.result.list
        //一级评论的时间
        for(let i=0;i<comments.length;i++)
        {
          comments[i].timeShow = that.timeShow(comments[i].time)
          //二级评论时间
          for(let j=0;j<comments[i].answer.length;j++){
            comments[i].answer[j].timeShow = that.timeShow(comments[i].answer[j].time)
          }
        }
        that.setData({
          comments:comments,
          first:false
        })
        wx.hideLoading({
          success: (res) => {},
        })
        
      },fail:function(e){
        console.log(e)
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //从缓存读取个人信息
    let userinfo = wx.getStorageSync('userinfo')
    let openid = wx.getStorageSync('openid')
    wx.cloud.callFunction({
      name:'love_show',
      data:{
        id:options.id
      },success:function(e){
        console.log(e.result.list[0])
        let info = e.result.list[0]
        info.timeShow = that.timeShow(info.time)
        that.setData({
          info:info,
          userinfo:e.result.list[0].result[0],
          openid:openid,
          value:""
        })
        wx.showLoading({
          title: '加载中...',
        })
        //加载所有评论
        that.getData()
        //判断用户是否点赞了
        wx.cloud.callFunction({
          name:'love_zan',
          data:{
            openid:wx.getStorageSync('openid'),
            id:that.data.info._id
          },success:function(e){
            console.log(e.result.data.length)
            if(e.result.data.length==0){
              that.setData({
                zan:false
              })
            }else{
              that.setData({
                zan:true
              })
            }
          },fail:function(e){
            console.log(e)
          }
        })
      },fail:function(e){
        console.log(e);
      }
    })
    
  },
  blur:function(e){
    this.setData({
      sendInfo:e.detail.value
    })
  },
  //发送评论--一级评论此处(默认)
  send:function(e){
    let id = e.currentTarget.dataset.id
    console.log(id)
    let info = this.data.sendInfo
    if(info.length==0){
      wx.showToast({
        title: '请输入内容',
      })
    }else{
      let that = this
      wx.showLoading({
        title: '发表中...',
      })
      //为了友好型。直接先让数据更新
      //一级评论
      let tmp = this.data.info
      tmp.messageNum++
      that.setData({
        value:'',
        info:tmp
      })
      if(this.data.type==0){
        console.log(0)
        wx.cloud.callFunction({
          name:'love_topComment',
          data:{
            content:info,
            openid:wx.getStorageSync('openid'),
            tid:that.data.info._id
          },success:function(e){
            //更新评论数据到最前面
            that.getData();
          },fail:function(e){
            console.log(e)
          }
        })
      }else if(this.data.type==1){
        //回复给一级评论
        console.log(info,that.data.chooseId)
        wx.cloud.callFunction({
          name:'love_reply',
          data:{
            myhead:wx.getStorageSync('userinfo').avatarUrl,
            myname:wx.getStorageSync('userinfo').nickName,
            content:info,
            cid:that.data.chooseId,
            fid:that.data.fid,
            hisname:that.data.hisname,
            type:1,
            id:id,
            tid:that.data.info._id
          },success:function(e){
            console.log(e)
            that.getData();
          },fail:function(e){
            console.log(e)
          }
        })
      }else{
        wx.cloud.callFunction({
          name:'love_reply',
          data:{
            myhead:wx.getStorageSync('userinfo').avatarUrl,
            myname:wx.getStorageSync('userinfo').nickName,
            content:info,
            cid:that.data.chooseId,
            fid:that.data.fid,
            hisname:that.data.hisname,
            type:2,
            id:id,
            tid:that.data.info._id
          },success:function(e){
            console.log(e)
            that.getData();
          },fail:function(e){
            console.log(e)
          }
        })
      }
    }
    
    
  },
  //增加帖子赞或评论赞,如果已经点击，则取消
  addTieZan:function(e){
    let iddd = e.currentTarget.dataset.tid
    let that = this
    if(this.data.zan==true){//取消点赞
      wx.cloud.callFunction({
        name:'love_delZan',
        data:{
          openid:wx.getStorageSync('openid'),
          id:e.currentTarget.dataset.tid
        },success:function(e){
          console.log(e)
          //帖子赞数量减去1
          let info = that.data.info
          info.zan--
          that.setData({
            zan:false,
            info:info
          })
          //去系统修改赞数量
          wx.cloud.callFunction({
            name:'love_zanUpdate',
            data:{
              id:iddd,
              num:-1
            },success:function(e){
              console.log(e)
            },fail:function(e){
              console.log(e)
            }
          })
        },fail:function(e){
          console.log(e)
        }
       
      })
    }else{//点赞--增加
      wx.cloud.callFunction({
        name:'love_addZan',
        data:{
          openid:wx.getStorageSync('openid'),
          id:e.currentTarget.dataset.tid
        },success:function(e){
          console.log(e)
          let info = that.data.info
          info.zan++
          //修改已经点赞了
          that.setData({
            zan:true,
            info:info
          })
          //去系统修改赞数量
          wx.cloud.callFunction({
            name:'love_zanUpdate',
            data:{
              id:iddd,
              num:1
            },success:function(e){
              console.log(e)
            },fail:function(e){
              console.log(e)
            }
          })
        },fail:function(e){
          console.log(e)
        }
        
      })
    }
  },
  timeShow:function(timestamp) {
    // 保留原始的时间
    //let result = time;
    let result
    //把分，时，天，周，半个月，一个月用毫秒表示
    let minute = 1000 * 60; 
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    let month = day * 30;
    let year = month * 12;
    
    //获取当前时间毫秒
    let now = new Date().getTime(); 
    
    // 截取转换下
    //time = time.substring(0, 18);

    // 转化成毫秒数
    //let timestamp = new Date(time).getTime();	
          
    //时间差
    let diffValue = now - timestamp; 

    // 超过当前时间,直接return
    if (diffValue < 0) {
      return result;
    }
    
    //计算时间差的分，时，天，周，月
    let minC = diffValue / minute; 
    let hourC = diffValue / hour;
    let dayC = diffValue / day;
    let weekC = diffValue / week;
    let monthC = diffValue / month;
    let yearC = diffValue/year;
    if(yearC>=1){
      result = parseInt(yearC) + "年前"
    }
    else if(monthC >= 1 && monthC <= 11) {
      result = parseInt(monthC) + "月前"
    } else if (weekC >= 1 && weekC <= 3) {
      result = parseInt(weekC) + "周前"
    } else if (dayC >= 1 && dayC <= 6) {
      result = parseInt(dayC) + "天前"
    } else if (hourC >= 1 && hourC <= 23) {
      result = parseInt(hourC) + "小时前"
    } else if (minC >= 1 && minC <= 59) {
      result = parseInt(minC) + "分钟前"
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = "刚刚"
    } else {
      // 时间太久
      result = "刚刚";
    }
    
    // 最后return出来
    return result;
  },
  //删除文章
  del1:function(e){
    //1.先找到所有一级评论，删除一级评论下二级评论
    //2.删除所有一级评论
    //3.删除对应文章
    wx.showModal({
      title:"删除",
      content: '确定删除',
      cancelText:"取消",
      confirmText:'确定',
      success:function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          let id = e.currentTarget.dataset.id
          console.log(id)
          wx.cloud.callFunction({
            name:'love_delArt',
            data:{
              id:id
            },success:function(e){
              wx.hideLoading({
                success: (res) => {
                  wx.showToast({
                    title: '删除成功',
                    duration:1000,
                    icon:"none",
                    success:function(e){
                      setTimeout(function() {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }, 1100);
                    }
                  })
                  
                },
              })
             
            },fail:function(e){
      
            }
          })
        } else if (res.cancel) {
          
        }
      },fail:function(res){
        console.log(res); 
      }
    }) 
  },
  //删除一级评论
  del2:function(e){
    //先删除所有二级评论
    let id = e.currentTarget.dataset.id
    let tid = e.currentTarget.dataset.tid
    let index1 =e.currentTarget.dataset.index1
    let that = this
    let num1 = that.data.comments[index1].answer.length
    num1++;
    wx.showModal({
      title:"删除",
      content: '确定删除',
      cancelText:"取消",
      confirmText:'确定',
      success:function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          //找被删除的个数
          console.log(id,index1)
          wx.cloud.callFunction({
            name:'love_delZan1',
            data:{
              id:id,
              num:num1,
              tid:tid
            },success:function(e){
              wx.hideLoading({
                success: (res) => {},
              })
              //删除对应data,不去服务器加载数据
              let comments = that.data.comments
              let tmp = that.data.info
              tmp.messageNum = tmp.messageNum-num1
              comments.splice(index1,1)
              that.setData({
                comments:comments,
                info:tmp
              })
            },fail:function(e){
              console.log(e)
            }
          })
        } else if (res.cancel) {
          
        }
      },fail:function(res){
        console.log(res); 
      }
    })
  },
  //删除二级评论
  del3:function(e){
    let that = this
    let index1 = e.currentTarget.dataset.index1
    let index2 = e.currentTarget.dataset.index2
    wx.showModal({
      title:"删除",
      content: '确定删除',
      cancelText:"取消",
      confirmText:'确定',
      success:function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          })
          wx.cloud.callFunction({
            name:'love_delZan2',
            data:{
              id:e.currentTarget.dataset.id,
              tid:e.currentTarget.dataset.tid
            },success:function(e){
              wx.hideLoading({
                success: (res) => {},
              })
              //删除对应data,重新加载消耗资源
              let comments = that.data.comments
              let tmp = that.data.info
              tmp.messageNum--
              console.log(comments[index1].answer)
              comments[index1].answer.splice(index2,1)
              that.setData({
                comments:comments,
                info:tmp
              })
            },fail:function(e){
              console.log(e)
            }
          })
        } else if (res.cancel) {
          
        }
      },fail:function(res){
        console.log(res); 
      }
    })


    
    
    
    
  },
  /**
   * 
   * 回复功能---超级复杂
   */
  answer:function(e){
    //1.类型1是回复一级评论
    //2.类型2是回复二级评论
    console.log(e.currentTarget.dataset.type)
    if(e.currentTarget.dataset.type==1){
      //回复一级评论
      this.setData({
        answer_author:"回复 "+e.currentTarget.dataset.name,
        type:1,
        chooseId:e.currentTarget.dataset.id,
        fid:e.currentTarget.dataset.fid,
        hisname:e.currentTarget.dataset.name
      })
    }else if(e.currentTarget.dataset.type==2){
      this.setData({
        answer_author:"回复 "+e.currentTarget.dataset.name,
        type:2,
        chooseId:e.currentTarget.dataset.id,
        fid:e.currentTarget.dataset.fid,
        hisname:e.currentTarget.dataset.name
      })
    }
  },
  /* 生命周期函数--监听页面显示
   * 加载新的评论数据,更加当前文章获取
   */
  onShow: function () {
    let that = this
    if(this.data.first==false){
        //加载所有评论
        wx.cloud.callFunction({
          name:'love_getAllComment',
          data:{
            tid:that.data.info._id
          },success:function(e){
            that.setData({
              comments:e.result.data
            })
          },fail:function(e){
            console.log(e)
          }
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