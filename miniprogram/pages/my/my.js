const db = wx.cloud.database();
var myVlu = "";
var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  bindGetUserInfo(e) {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    // 第二次进入
    wx.getStorage({
      key: 'hasUserInfo',
      success(res) {
        wx.getStorage({
          key: 'userInfo',
          success(res) {
            app.globalData.userInfo = res.data
            console.log( res.data)
            that.setData({
              userInfo: res.data,
              hasUserInfo: true,
            })
          }
        })
      },
      fail() {
        if (wx.getUserProfile) {
          that.setData({
            canIUseGetUserProfile: true,
          })
        }
      }
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo = res.userInfo
console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        wx.cloud.callFunction({ //调用云函数获取openid
          name: "getOpenid",
          complete: res => {
            
            db.collection("demouser").where({
              _openid: res.result.openid //进行筛选
            }).get({
              success: res => {
      
                if (res.data.length == 0) {
      
                  //通过判断data数组长度是否为0来进行下一步的逻辑处理
                  wx.cloud.database().collection('demouser').add({
                    data: {
                      avatarUrl: app.globalData.userInfo.avatarUrl,
                      nickName: app.globalData.userInfo.nickName,
                      signcount: '',//总计签到加1
                      signdata: '',//当天日期 
                      signmonth: ''//当月签到次数

                    },
                    success(res) {
                      console.log(app.globalData.userInfo)
                
                    }
                  })
                }
              }
            })
          }
        })
        wx.setStorageSync('userInfo', res.userInfo)
        wx.setStorageSync('hasUserInfo', JSON.stringify(true))
      },
    })
  },
  loginOut() {
    var that = this
    app.globalData.userInfo = null
    that.setData({
      userInfo: null,
      hasUserInfo: false,
      canIUseGetUserProfile: true
    })
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          userInfo: null
        })
      }
    })
  },
  
  click(){
    wx.navigateTo({
      url: '../made/made',//要跳转到的页面路径
})  
  },
  clickRow(){
    wx.navigateTo({
      url: '../sign/sign',//要跳转到的页面路径
})  
  }
 
})