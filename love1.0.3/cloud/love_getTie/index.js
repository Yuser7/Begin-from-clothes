// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let page = event.page;//第几页
    let count = event.count;//每页加载个数
    return await db.collection("love_upload").aggregate().lookup({
      from:'love_user',
      localField: 'openid',
      foreignField: 'openid',
      as: 'result'
    }).sort({
      time:-1,
    }).skip(page).limit(count).end();
  }catch(e){
    console.log(e);
  }
}