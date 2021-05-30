// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //1.统计评论表
  try{
    return await db.collection('love_comment').aggregate().lookup({
      from:'love_answer',
      localField: '_id',
      foreignField: 'fid',
      as: 'result'
    }).match({
      tid:event.tid
    }).count().end()
  }catch(e){

  }
}