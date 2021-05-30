// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //1.删除所有二级评论
  const info1 = await db.collection('love_answer').where({
    tid:event.id
  }).remove()
  //2.删除所有一级评论
  const info2 = await db.collection('love_comment').where({
    tid:event.id
  }).remove()
  //3.删除文章
  const info3 = await db.collection('love_upload').doc(event.id).remove()
  return {info1,info2,info3}
}