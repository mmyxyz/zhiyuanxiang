// pages/made/made.js
const db = wx.cloud.database();
var filePath = [];
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      title: '',
      content:'',
    },
    userInfo: {},
    hasUserInfo: false,
    tempImg: [],
    fileIDs: [],
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //取用全局变量
    let that = this
  },
  inputInfo: function(e){
   // 1. input 和 info 双向数据绑定
   let dataset = e.currentTarget.dataset;
   //data-开头的是自定义属性，可以通过dataset获取到，dataset是一个json对象，有obj和item属性，可以通过这两个实现双向数据绑定，通过更改这两个值，对不同name的变量赋值
   let value = e.detail.value;
   this.data[dataset.obj][dataset.item] = value;
   this.setData({
     info: this.data[dataset.obj]
   })
  },
  //上传图片 获取临时路径
  clickBtn() {
    wx.chooseImage({
      success: res => {
        console.log(res.tempFilePaths)

        this.setData({
          arr: res.tempFilePaths
        })
        filePath = res.tempFilePaths

      }
    })
  },
  //提交图片入库函数 得到真实路径 待调用

  // 
  async cloudFile(filename, path) {

  },

  //提交表单到数据库
  btnSub(res) {
    const that = this
    let userInfo = app.globalData.userInfo;
    let arr = that.data.fileIDs;
    let title = that.data.info.title;
    let content =that.data.info.content;
    let site = that.data.info.site;
    let type =that.data.info.type
    filePath.forEach((item, idx) => {
      let filename = Date.now() + "_" + idx;
      wx.showLoading({
        title: '上传中',
      })
      wx.cloud.uploadFile({
        //上传要有两个参数，路径文件名
        cloudPath: filename + ".jpg",
        //临时路径filepath
        filePath: item
      }).then((res) => {
        arr.push(res.fileID)
        db.collection("demolist").add({
          data: {
            title: title,
            content: content,
            fileID: arr,
            avatarUrl: userInfo.avatarUrl,
            nickName: userInfo.nickName,
             site : site,
             type :type,
            createTime: db.serverDate() //服务端的时间
          }
        }).then(res => {
          that.setData({
            data:""
          })
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })
        })
      })
    })

  },
 


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})