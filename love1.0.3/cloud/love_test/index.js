// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('love_comment').aggregate().lookup({
      from:'love_answer',
      localField: '_id',
      foreignField: 'fid',
      as: 'result1'
    }).lookup({
      from:'love_user',
      localField: 'openid',
      foreignField: 'openid',
      as: 'result2'
    }).match({
      tid:event.tid
    }).end()
  }catch(e){

  }
}