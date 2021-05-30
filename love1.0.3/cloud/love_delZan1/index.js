// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  //0.更新点赞
  const info0 = await db.collection('love_upload').doc(event.tid).update({
    data:{
      messageNum:_.inc(-event.num)
    }
  })
  //1.先删除所有的回复
  const info1 = await db.collection('love_answer').where({
    fid:event.id
  }).remove()
  //2.其次删除一级评论
  const info2 = await db.collection('love_comment').doc(event.id).remove()
  return {info0,info1,info2}
}