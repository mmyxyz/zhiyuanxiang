const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ =db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  //输入框的值
  let inputValue = event.inputValue;
  return await db.collection("demolist").where(_.or([
    {
     title:db.RegExp({
          regexp:inputValue,
          option:'i'
      })
    },
    {
      site:db.RegExp({
          regexp:inputValue,
          option:'i'
      })
    },
    {
      type:db.RegExp({
          regexp:inputValue,
          option:'i'
      })
    }
  ]).and([{
      del:0
  }])).get({
    success: function (res) {
      this.setData({
        searchResult:res
      })
      console.log(res)
      return res;

    }
  });
}

