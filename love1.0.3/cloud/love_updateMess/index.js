// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let id = event.id
    let num = event.num
    return await db.collection('love_upload').doc(id).update({
      data:{
        messageNum:num
      }
    })
  }catch(e){

  }
}