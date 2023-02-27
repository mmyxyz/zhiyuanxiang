const db = wx.cloud.database();
Page({
    data: {
          
      },
     
onLoad: function (options) {
  db.collection('demolist').doc(options.id).get({
    success:res=> {
      // res.data 包含该记录的数据
      console.log(res.data)
      this.setData({
        dataList:res.data
      })
}
})
}
})