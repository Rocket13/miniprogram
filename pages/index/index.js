//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    message:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  preJScreate: function(e){
    console.log("请求下单")
    console.log(app.globalData.code)
    if(null == app.globalData.code){
      console.log("用户未登录")
      wx.login({
        success:function(res){
          if(res.code){
            console.log(res.code)
              app.globalData.code = res.code
              console.log(app.globalData.code)
              wx.request({
                url: 'https://sfpay-sit.sf-pay.com/upc-demo/miniPay',
                data:{
                  code : res.code,
                  mchNo:e.detail.value.mchNo,
                  srcAmt:e.detail.value.srcAmt
                },
                header:{
                  'content-type':'application/json'
                },
                success:function(res){
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': '',
                    'nonceStr': '',
                    'package': '',
                    'signType': 'MD5',
                    'paySign': '',
                    'success': function (res) {
                    },
                    'fail': function (res) {
                    }
                  })
                },
                fail:function(res){
                  console.log(res.errMsg)
                  this.message = res.errMsg
                }
              })
          }else{
            console.log('登录失败！'+res.errMsg)
          }
        }
      })
    }else{
        console.log("用户已登录")
        var thisBlock = this
        wx.request({
          url: 'https://sfpay-sit.sf-pay.com/upc-demo/miniPay',
          data: {
            code : app.globalData.code,
            mchNo:e.detail.value.mchNo,
            srcAmt:e.detail.value.srcAmt
          },
          success:function(res){
            console.log(res)
            if("error" == res.data.code){
                console.log(res.data.message)
                // wx.showToast({
                //   title: res.data.message,
                // })
                thisBlock.setData({
                    message:res.data.message
                })
            }else{
                wx.requestPayment({
                  'timeStamp': '',
                  'nonceStr': '',
                  'package': '',
                  'signType': 'MD5',
                  'paySign': '',
                  'success': function (res) {
                  },
                  'fail': function (res) {
                  }
                })
            }
          },
          fail:function(res){
            console.log(res.errMsg)           
          }
        })
    }
  }
})
