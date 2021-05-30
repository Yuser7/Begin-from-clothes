// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection('love_user').add({
      data:{
        openid:event.openid,
        username:event.username,
        head:event.head
      }
    })
  }catch(e){
    console.log(e);
  }
 
}