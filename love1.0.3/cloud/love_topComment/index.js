// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    //1.先执行更新帖子数量操作
    const info1 = await db.collection('love_upload').doc(event.tid).update({
      data:{
        messageNum:_.inc(1)
      }
    })
    const info2 = await db.collection('love_comment').add({
      data:{
        openid:event.openid,
        tid:event.tid,
        content:event.content,
        love:0,
        time:Date.now()
      }
    })
    return {info1,info2}
  }catch(e){

  }
}