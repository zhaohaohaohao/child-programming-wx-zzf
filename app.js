//app.js
App({
  onLaunch: function (options) {
    var that = this;
    console.log("[onLaunch] 本次场景值:", options.scene);
    that.globalData.scene = options.scene;
    that.reLaunch();
    
  },
  // 登录
  reLaunch: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId
        var code = res.code;//登录凭证
        console.log("code:"+code);
        wx.request({
          url: that.globalData.urlPath + 'student/getOpenId',
          method: 'get',
          header: {
            "Content-Type": "applciation/json"
          },
          data: { code: code },
          success: function (data) {
            if (data.data.status == 200) {
              // 获取到用户的 openid
              console.log("用户的openid:" + data.data.data);
              that.globalData.openid = data.data.data;
              // console.log("用户的openid:" + that.globalData.openid);
              // wx.setStorageSync("openId", data.data.data);
              // 查看是否授权
              wx.getSetting({
                success: function (res) {
                  if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                      success: function (res) {
                        console.log("用户已授权");
                        that.queryStudentDto();
                      }
                    })
                  } else {
                    console.log("未授权");
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '获取用户信息失败',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    that.reLaunch();
                  }
                }
              })
            }
          },
          fail: function () {
            console.log('获取用户信息失败')
          }
        });
      },
      fail: function () {
        console.log('登陆失败')
      }
    })
  },
  //获取用户信息接口
  queryStudentDto: function () {
    var that = this;
    var openid = that.globalData.openid;
    console.log(openid);
    wx.request({
      url: that.globalData.urlPath + 'student/getStudentByOpenId',
      data: {
        openId: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.status);
        if (res.data.status == '200') {
          console.log(res.data.data);
          that.globalData.studentDto = res.data.data;
          console.log(that.globalData.studentDto);
        } else {
          //获取用户失败
          console.log("获取用户失败");
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    studentDto: null,
    // urlPath: "http://192.168.1.105:8080/child-programming-background/app/web/",
    urlPath: "http://192.168.43.49:8080/child-programming-background/app/web/",
    openid: '',
    scene:'',
  },






})