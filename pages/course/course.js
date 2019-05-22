// pages/course/course.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    collect: '../../images/agree.png',
    collectFlg: false,
    course: {},
    listData: "",
  },
  /** 
   * 预览图片
   */
  previewImage: function(e) {
    wx.previewImage({
      urls: this.data.imglist // 需要预览的图片http链接列表
    })
  },
  collect: function() {
    var that = this;
    if (that.data.collectFlg) {
      that.updateCollectCourse(false);//0 false
      that.setData({
        collectFlg: false,
        collect: '../../images/agree.png'
      });
    } else {
      that.updateCollectCourse(true);
      that.setData({
        collectFlg: true,
        collect: '../../images/agree-a.png'
      });
    }
  },
  updateCollectCourse:function(flag){
    var that=this;
    console.log(flag);
    if (app.globalData.studentDto != null) {
    wx.request({
      url: app.globalData.urlPath + 'student/updateCollectCourse',
      data: {
        courseId: that.data.course.id,
        studentId: app.globalData.studentDto.id,
        flag: flag,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == '200') {
          if (res.data.data){
            console.log("收藏成功");
            wx.showToast({
              title: '收藏成功',
              icon: 'succes',
              duration: 1000,
              mask: true //是否显示透明蒙层，防止触摸穿透
            })
          }else{
            console.log("取消收藏成功");
            wx.showToast({
              title: '取消收藏',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
          }
        }
      }
    });
    } else{
      wx.navigateTo({
        url: '/pages/authorize/authorize'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      course: JSON.parse(options.courseDetail),
    });
    that.data.imglist.push(JSON.parse(options.courseDetail).photoUrl);
    wx.request({
      url: app.globalData.urlPath + 'course/getCourseDetailByCourseId',
      data: {
        courseId: JSON.parse(options.courseDetail).id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data);
        that.setData({
          listData: res.data.data,
        });
      }
    });
    that.isCollect();
    wx.hideLoading();
  },
  isCollect:function(){
    var that = this;
    if(app.globalData.studentDto!=null){
      wx.request({
        url: app.globalData.urlPath + 'student/isCollectCourse',
        data: {
          courseId: that.data.course.id,
          studentId:app.globalData.studentDto.id,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.data);
          if (res.data.status=='200' && res.data.data){
            that.setData({
              collectFlg: true,
              collect: '../../images/agree-a.png'
            });
          }
        }
      });
    }
  },

  //获取用户信息，并报名。
  signUpCourse: function() {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log("用户已授权");
              that.studentSignUpCourse();
            }
          })
        }else{
          console.log("未授权");
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
  },
  studentSignUpCourse:function(){
    var that = this;
    //var openid = wx.getStorageSync('openid');
    var openid = app.globalData.openid;
    if (openid == null) {
      console.log("openId为空");
      app.reLaunch();
    }
    console.log(openid);
    wx.request({
      url: app.globalData.urlPath + 'student/getStudentByOpenId',
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
          app.globalData.studentDto = res.data.data;
          var studentId = app.globalData.studentDto.id;
          var itemList = [];
          for (var i = 0; i < that.data.listData.length; i++) {
            itemList.push(that.data.listData[i].gradeName);
          }
          wx.showActionSheet({
            // itemList: ['A', 'B', 'C'],最大长度6
            itemList: itemList,
            success: function (res) {
              console.log(res.tapIndex);
              console.log(that.data.listData[res.tapIndex])
              let courseDetail = JSON.stringify(that.data.course);
              let courseOrginDetail = JSON.stringify(that.data.listData[res.tapIndex]);
              wx.navigateTo({
                url: '/pages/SignUpCourseDetail/SignUpCourseDetail?courseDetail=' 
                  + courseDetail + '&courseOrginDetail=' + courseOrginDetail,
              })
            },
            fail: function (res) {
              console.log("点击了取消")
            }
          })
        } else {
          //获取用户失败
          wx.showModal({
            title: '提示',
            content: '获取用户失败,为您重新获取',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                app.reLaunch();
              }
            }
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that=this;
    var listData = JSON.stringify(that.data.course);
    return {
      title: '儿童编程小程序',
      path: 'pages/course/course?courseDetail=' + listData,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})