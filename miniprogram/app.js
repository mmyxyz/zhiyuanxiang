// app.js
var app = getApp();
App({
  globalData: {
    userInfo: null,
    openid: null,
    path: null,
    navHeight: null,
    a:null,
  },
  onLaunch() {
    var that = this
    wx.cloud.init({
      env: 'cloud1-7gboo55lf2f7b5fd',
      traceUser: true,
    });
    that.getOpenid();
 
  },
  // 获取用户openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {

        // var openid = res.result.openId;
        // that.setData({
        //   openid: openid
        // })
      }
    })
  },


})

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力');
} else {
  wx.cloud.init({
    env: 'cloud1-7gboo55lf2f7b5fd',
    traceUser: true,
  });
}