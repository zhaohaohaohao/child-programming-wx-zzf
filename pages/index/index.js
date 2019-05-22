//index.js
var util = require('../../utils/util.js');
var time = util.formatTimeYYYY(new Date());
//获取应用实例
const app = getApp();
var page = 1;
var page_size = 5;

//请求数据
var loadMore = function(that) {
  that.data.hasMore = false;
  if (that.data.isDown) {
    console.log("daodi-----");
    return;
  }
  that.setData({
    hidden: false
  });
  var courseName = that.data.courseName;
  // 高级搜索
  var selectSchoolId = that.data.selectSchoolId;
  var teacherId = that.data.teacherId;
  var lowPrice = that.data.lowPrice;
  var heighPrice = that.data.heighPrice;
  var lowDate = that.data.lowDate;
  var heighDate = that.data.heighDate;
  var heighSearchFlg = that.data.heighSearchFlg;
  if (that.data.lowDate > that.data.heighDate) {
    wx.showModal({
      title: '提示',
      content: '开始时间应小于结束时间',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          that.setData({
            lowDate: time,
            heighDate: time,
          });
        }
      }
    })
  }
  var homePageHeighSerachParam = new Object();
  homePageHeighSerachParam["page"] = page,
    homePageHeighSerachParam["limit"] = page_size,
    homePageHeighSerachParam["courseName"] = courseName,
    homePageHeighSerachParam["selectSchoolId"] = selectSchoolId,
    homePageHeighSerachParam["teacherId"] = teacherId,
    homePageHeighSerachParam["lowPrice"] = lowPrice,
    homePageHeighSerachParam["heighPrice"] = heighPrice,
    homePageHeighSerachParam["lowDate"] = lowDate,
    homePageHeighSerachParam["heighDate"] = heighDate,
    homePageHeighSerachParam["heighSearchFlg"] = heighSearchFlg,
    console.log(homePageHeighSerachParam);
  wx.request({
    url: app.globalData.urlPath + 'course/getClassNow',
    data: homePageHeighSerachParam,
    header: {
      'content-type': 'application/json'
    },
    success: function(res) {
      console.log(res.data.data);
      if (res.data.data == null || res.data.data == [] || res.data.data.length == 0) {
        console.log("到底");
        that.setData({
          hidden: true,
          isDown: true,
        });
        return;
      }

      console.log(res.data.data.length);
      var list = that.data.list;
      console.log("list.length:" + list.length);
      console.log("res.data.data.length:" + res.data.data.length);
      if (list.length != 0) {
        console.log("最后id:" + list[list.length - 1].id);
        console.log("第最后个id" + res.data.data[res.data.data.length-1].id);
        if (list[list.length - 1].id != res.data.data[res.data.data.length-1].id) {
          for (var i = 0; i < res.data.data.length; i++) {
            list.push(res.data.data[i]);
          }
          that.setData({
            list: list,
            hasMore: true,
            hidden: true,
          });
          console.log("list.length:" + list.length);
          page++;
        } else {
          console.log("重复加载");
        }

      } else {
        for (var i = 0; i < res.data.data.length; i++) {
          list.push(res.data.data[i]);
        }
        that.setData({
          list: list,
          hasMore: true,
          hidden: true,
        });
        console.log("list.length:" + list.length);
        page++;
      }
    }
  });
}

Page({
  data: {
    open: false,
    hidden: true,
    list: [],
    isDown: false,
    hasMore: false,
    scrollTop: 0,
    scrollYHeight: 0, //scroll-view高度
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    show1: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    schoolData: null, //下拉列表的数据
    index: 0, //选择的下拉列 表下标,
    teacherData: null, //下拉列表的数据
    index1: 0, //选择的下拉列 表下标,
    lowDate: time, //默认起始时间  
    heighDate: time, //默认结束时间 
    courseName: "", //课程名称
    selectSchoolId: "",
    teacherId: "",
    heighSearchFlg: false, //高级删选标志
    lowPrice: "",
    heighPrice: "",

  },
  onLoad: function() {
    var that = this;
    that.getSchoolList();
    that.getTeacherList();
    //数据刷新
    page = 1;
    loadMore(that);
  },
  getSchoolList: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + 'school/getSchoolList',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data);
        if (res.data.data!= null) {
          that.setData({
            schoolData: res.data.data,
            selectSchoolId: res.data.data[0].value,
          });
        }
      }
    });
  },
  getTeacherList: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlPath + 'teacher/getTeacherList',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data);
        if (res.data.data!= null) {
          that.setData({
            teacherData: res.data.data,
            teacherId: res.data.data[0].value,
          });
        }
      }
    });
  },
  serachSubmit: function(e) {
    var that = this;
    var courseName = e.detail.value.courseName; //获取表单所有name=id的值  
    if (courseName.length>15){
      wx.showToast({
        title: '最多输入15位',
        icon: 'loading',
        duration: 2000
      })
      that.setData({
        courseName : ''
      })
      return;
    }
    console.log("courseName" + courseName);
    wx.showLoading({
      title: '加载中...',
    })
    page = 1;
    that.setData({
      courseName: courseName,
      list: [],
      heighSearchFlg: false,
      isDown: false,
    });
    loadMore(that);
    wx.hideLoading();
  },
  heighSearch: function(e) {
    var that = this;
    var lowPrice = that.data.lowPrice;
    var heighPrice = that.data.heighPrice;
    console.log(lowPrice+"--------"+heighPrice);
    if (lowPrice>heighPrice){
      wx.showToast({
        title:'价格输入不合法',
        icon: 'loading',
        duration:2000,
        mask:true
      })
      return;
    }
    wx.showLoading({
      title: '加载中...',
    })
   
    that.setData({
      heighSearchFlg: true,
      list: [],
      isDown: false,
      courseName: "",
    })
    page = 1;
    loadMore(that);
    wx.hideLoading();
    this.tap_ch();
  },
  //下拉加载
  bindDownLoad: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    loadMore(that);
    wx.hideLoading();
  },
  //上拉刷新
  topLoad: function(event) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    //数据刷新
    page = 1;
    this.setData({
      list: [],
      isDown: false,
    });
    console.log("上拉");
    loadMore(that);
    wx.hideLoading();
  },
  //筛选
  tap_ch: function(e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show,
    });
  },
  selectTap1() {
    this.setData({
      show1: !this.data.show1,
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let selectSchoolId = e.currentTarget.dataset.schoolid;
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(selectSchoolId);
    this.setData({
      index: Index,
      show: !this.data.show,
      selectSchoolId: selectSchoolId,
    });
  },
  // 点击下拉列表
  optionTap1(e) {
    let teacherId = e.currentTarget.dataset.teacherid;
    let Index1 = e.currentTarget.dataset.index1; //获取点击的下拉列表的下标
    console.log(teacherId);
    this.setData({
      index1: Index1,
      show1: !this.data.show1,
      teacherId: teacherId,
    });
  },
  // 时间段选择  
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      lowDate: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      heighDate: e.detail.value,
    })
  },
  lowPrice: function(e) {
    this.setData({
      lowPrice: this.checkInputText(e.detail.value)
    })
  },
  heighPrice: function(e) {
    this.setData({
      heighPrice: this.checkInputText(e.detail.value)
    })
  },
  checkInputText: function (text) {
    if (text.length>6){
      wx.showToast({
        title: '最长6位数',
        icon: 'loading',
        duration: 2000
      })
      this.setData({
        lowPrice: 0,
        heighPrice:0,
      })
      text=0;
    }else{
      var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
      if (reg.test(text)) { //正则匹配通过，提取有效文本
        text = text.replace(reg, '$2$3$4');
      } else { //正则匹配不通过，直接清空
        this.setData({
          lowPrice: 0,
          heighPrice: 0,
        })
        text = 0;
      }
    }
    return text; //返回符合要求的文本（为数字且最多有带2位小数）
  },
  onReady: function() {
    var that = this;
    wx.getSystemInfo({
      success: ({
        windowHeight
      }) => {
        this.setData({
          scrollYHeight: windowHeight
        }) //设置scrill-view组件的高度为屏幕高度
      }
    })
    console.log("高度：" + this.data.scrollYHeight);
  },
  authorization: function(e) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(e.detail.userInfo);
              app.globalData.userInfo = e.detail.userInfo;
              //从数据库获取用户信息
              if (app.globalData.studentDto == null) {
                console.log("第一次查询用户");
                that.queryStudentDto();
              } else {
                console.log("用户已查询过");
                console.log(app.globalData.studentDto);
                wx.navigateTo({
                  url: '/pages/persion/persion'
                })
              }
            }
          });
        } else {
          console.log("未授权");
          // 关闭所有页面，打开到应用内的某个页面。
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
  },
  //获取用户信息接口
  queryStudentDto: function() {
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
      success: function(res) {
        console.log(res.data.status);
        if (res.data.status == '200') {
          console.log(res.data.data);
          app.globalData.studentDto = res.data.data;
          console.log(app.globalData.studentDto);
          //用户已经授权过
          wx.navigateTo({
            url: '/pages/persion/persion'
          })
        } else {
          //获取用户失败
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          })
        }
      }
    });
  },
  // 跳转课程详情页
  courseDetail: function(e) {
    let courseDetail = JSON.stringify(e.currentTarget.dataset.courseDetail);
    wx.navigateTo({
      url: '/pages/course/course?courseDetail=' + courseDetail,
    })
  },

  experienceCourse: function() {
    wx.navigateTo({
      url: '/pages/experienceCourse/experienceCourse',
    })
  },

})