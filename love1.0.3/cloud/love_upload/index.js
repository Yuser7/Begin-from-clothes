// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('love_upload').add({
    data:{
      title:event.title,
      content:event.content,
      messageNum:0,
      zan:0,
      openid:event.openid,
      time:Date.now(),//日期
      url: event.url   
    }
  })
}