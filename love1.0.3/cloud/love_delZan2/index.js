// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
 try{
   //1.更新消息数量
   const info1 = await db.collection('love_upload').doc(event.tid).update({
     data:{
       messageNum:_.inc(-1)
     }
   })
  const info2 =  await db.collection('love_answer').doc(event.id).remove()
  return {info1,info2}
}catch(e){

 }
}