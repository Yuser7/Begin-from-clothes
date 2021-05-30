// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const info1 = await db.collection('love_upload').doc(event.id).update({
      data:{
        messageNum:_.inc(1)
      }
    })
    const info2 =  await db.collection('love_answer').add({
      data:{
        myname:event.myname,
        hisname:event.hisname,
        head:event.myhead,
        fid:event.fid,
        type:event.type,
        content:event.content,
        time:Date.now(),
        cid:event.cid,
        tid:event.tid
      }
    })
    return {info1,info2}
  }catch(e){

  }
}