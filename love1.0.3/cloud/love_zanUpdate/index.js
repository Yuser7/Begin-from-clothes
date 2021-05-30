// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event.id
  let num = event.num
  try{
    return await db.collection('love_upload').doc(_id).update({
      data:{
        zan:_.inc(num)
      }
    })
  }catch(e){

  }
}