// index.js
let itemWidth = 0;
const db = wx.cloud.database();
const _ = db.command;
var app = getApp();
Page({
  onLoad: function (options) {
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        console.log("res.data", res.data)
        app.globalData.userInfo = res.data
      }
    })

    this.getData()
  },
  skipTravelDetails:function(e){
    let id=e.currentTarget.dataset.id //获取点击产品时拿到的id，就是data-id传过来的值
    // wx.navigateTo跳转页面的方法
    //URL是传递的是详情页的路径，把id拼接传过去就可以啦
    wx.navigateTo({
        url: "../info/info?id="+id,
    })
    console.log(id)
},

  gotoPage: function (options) {
    wx.navigateTo({
          url: '../search/search',//要跳转到的页面路径
 })  

 },

  onReachBottom: function () {
    var page = this.data.dataList.length
    console.log(page)
    this.getData(3, page)
  },


  onShow() {},
  /**
   * 页面的初始数据
   */
  data: {
    dataObj: " ",
    dataList: [],
    search: ''
  },
  GetSearchInput: function (e) {
    this.setData({
      search: e.detail.value
    })
  },

  getData(num = 5, page = 0) {
    wx.cloud.callFunction({
      name: "getData",
      data: {
        num: num,
        page: page
      }
    }).then(res => {
      var oldData = this.data.dataList
      var newData = oldData.concat(res.result.data);

      this.setData({
        dataList: newData
      })
    })
  },
})