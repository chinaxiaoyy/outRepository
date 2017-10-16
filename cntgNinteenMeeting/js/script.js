window.onload = function() {
  loadImg()
  initSwiperV();
  initSwiperH();
  initStorage();
  configWXShare();
  document.addEventListener("WeixinJSBridgeReady", function() {
    document.getElementById('music').play();
  }, false);
  playAudio();
}

var swiperV = null;
var swiperH = null;
var maxVisitedClas = 0;
var mapHash = 0;
var score_mun = [0, 0, 0, 0, 0, 0];

$(window).on("hashchange", function() { //兼容ie8+和手机
  var tar = document.querySelectorAll('.swiper-button-next')[0];
  var index = window.location.hash.replace('#vslide', '');
  if (index == 1) {
    showIndexLetter();
  }
  if (index == 2) {
    tar.style.display = 'block';
  } else {
    tar.style.display = 'none';
  }
  if (index == 3) {
    if (mapHash) {
      return;
    } else {
      mapHash = 1;
      changeProgress(1);
    }
  }
});

// 预加载图片
function loadImg() {
  if (sessionStorage.getItem('img_reload') == 1) {
    document.querySelectorAll('.load_progress')[0].style.width = '100%';
    document.querySelectorAll('.img_loader')[0].style.display = 'none';
    showIndexLetter();
    return;
  }
  var loader = new ImagesLoader();
  loader.loadImages([
    'index/cloud.png',
    'index/index_bg.png',
    'sub/alert.png',
    'sub/book.png',
    'sub/button.png',
    'sub/mont.png',
    'sub/word.png',
    'map/bg_1.png',
    'map/bg_2.png',
    'ask_1/tree.png',
    'ask_1/base.png',
    'ask_1/door.png',
    'ask_2/bg.png',
    'ask_3/bg.png',
    'ask_4/pic.png',
    'ask_4/bg.png',
    'ask_4/pillar.png',
    'ask_5/pic.png',
    'ask_6/pic.png',
    'ask_6/bg.png',
    'score/a.png',
    'score/b.png',
    'score/c.png'
  ], 'img/');

  loader.complete(function() {
    document.querySelectorAll('.img_loader')[0].style.display = 'none';
    sessionStorage.setItem('img_reload', '1');
    showIndexLetter();
  });

  loader.process(function() {
    document.querySelectorAll('.load_progress')[0].style.width = this.processNum + '%';
    //$('.load_num').html(this.processNum + '%');
  });

  loader.start();
}

function showIndexLetter() {
  playAudio();
  var hash = window.location.hash;
  if (hash && hash !== '#vslide1') {
    return;
  }
  var eg = document.querySelectorAll('.index_title_word_eg')[0];

  var show = document.querySelectorAll('.index_title_word')[0];
  var i = 0;
  var time = setInterval(function() {
    show.innerHTML = eg.innerHTML.substring(0, i);
    i++;
    if (show.innerHTML === eg.innerHTML) {
      swiperV.slideTo(1, 800, true);
      clearInterval(time);
    }
  }, 200);
}

function playAudio() {
  document.querySelector("#music").play()
}

//初始化swiperv
function initSwiperV() {
  swiperV = new Swiper('.swiper-container-v', {
    direction: 'vertical',
    slidesPerView: 1,
    spaceBetween: 0,
    mousewheelControl: true,
    autoplay: 0, // 不自动播放
    autoHeight: true,
    lazyLoadingOnTransitionStart: true, // 过渡一开始加载
    lazyLoading: true, // 图片延迟加载,将img的src改为data-src,并添加类名swiper-lazy,背景图延时加载增加属性:data-background
    hashnav: true, //锚链接
    noSwiping: true,
    noSwipingClass: 'stop-swiping',
    onInit: function(swiper) {
      getActiveIndex(swiper);
      swiperAnimateCache(swiper); //隐藏动画元素
      swiperAnimate(swiper); //初始化完成开始动画
    },
    onTouchEnd: function(swiper) {
      getActiveIndex(swiper);
      playAudio();
    },
    onSlideChangeEnd: function(swiper) {

      swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
    }
  });
}

//初始化swiperh
function initSwiperH() {
  swiperH = new Swiper('.swiper-container-h', {
    spaceBetween: 0,
    freeMode: true,
    slidesPerView: 'auto'
  });
}



//初始化微信分享
function configWXShare() {
  var shareData = {
    title: '拼知识,你怕了吗? | Are you a language maestro?',
    desc: 'Take "Xi\'s quiz" on quotes! | 如果习主席出一份名言小测验,你能答几分?',
    imgUrl: 'https://news.cgtn.com/xiquotequiz-19thcpc/img/logo.png',
    link: window.location.href.split('#')[0]
  }
  var wxConfigData = {
    debug: false,
    appId: 'wxd61ff47456d31b8e',
    timestamp: Date.now(),
    nonceStr: '',
    signature: '',
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo'
    ]
  }
  var url = encodeURIComponent(window.location.href.split('#')[0]);
  var fetchUrl = 'https://wechat.cgtn.com/socialweb/social/weixin/getKeys.do?url=' + url;
  $.ajax({
    url: fetchUrl,
    type: 'GET',
    dataType: 'json',
    contentType: "application/json",
    success: function(data) {
      wxConfigData.timestamp = data.data.timestamp;
      wxConfigData.nonceStr = data.data.nonceStr;
      wxConfigData.signature = data.data.signature;
      //alert(JSON.stringify(wxConfigData));
      wx.config(wxConfigData);
      wx.ready(function() {
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareAppMessage(shareData);
        wx.onMenuShareQQ(shareData);
        wx.onMenuShareWeibo(shareData);
      })
      wx.error(function(err) {
        alert('wechat init fail' + JSON.stringify(res))
      });
    },
    error: function(error) {
      console.log(error)
    }
  })
}

function changeAto1(item, _class) {
  switch (item) {
    case 'a':
      return document.querySelectorAll(_class)[0];
      break;
    case 'b':
      return document.querySelectorAll(_class)[1];
      break;
    case 'c':
      return document.querySelectorAll(_class)[2];
      break;
    case 'd':
      return document.querySelectorAll(_class)[3];
      break;
  }
}

//刷新时,获取当前进度
function initStorage() {
  playAudio();
  //刷新时如果是引子页,显示下一页动画
  var hash = window.location.hash.replace('#vslide', '');

  var sto = window.sessionStorage.getItem('wy_score');
  if (!sto) {
    if (!window.location.hash) return;
    changeProgress(1);
    return;
  }
  var storage = JSON.parse(sto);
  maxVisitedClas = storage.maxClass;
  if (maxVisitedClas == 6) {
    document.querySelectorAll('.map_prompt_1')[0].style.display = 'none';
    document.querySelectorAll('.map_prompt_2')[0].style.display = 'none';
  }
  score_mun = storage.score;
  // 改变地图页进度条
  changeProgress(maxVisitedClas + 1);

  //将默认选项变为之前的选项
  var className = '',
    target = null;
  for (var i = 0; i < score_mun.length; i++) {
    if (!score_mun[i]) continue;
    className = '.ask' + (i + 1) + '_a';
    target = changeAto1(score_mun[i], className);
    chooseItem(target, className, (i + 1), score_mun[i], true);
  }
}


//获得当前下标
function getActiveIndex(swiper) {
  playAudio();
  var t = setTimeout(function() {
    var index = swiper.realIndex;
    //运行当前页的keyframes
    if (index == 0) {
      $('.cloud').css('-webkit-animation-play-state', 'running');
      $('.cloud').css('animation-play-state', 'running');


    } else if (index == 1) {
      $('.cloud').css('-webkit-animation-play-state', 'paused');
      $('.cloud').css('animation-play-state', 'paused');
    }
    clearTimeout(t);
  }, 100);
}

//返回地图
function toMap() {
  swiperV.slideTo(2, 0, false);
}

//去第几关
function toClass(num, hideType) { // num从3开始
  if (num > 3) {
    if (!score_mun[num - 4]) {
      sub_toggleShow('.map_alert_1');
      return;
    }
  }
  //关闭地图页弹窗
  var alert1 = document.querySelectorAll('.map_alert_1')[0];
  var alert2 = document.querySelectorAll('.map_alert_2')[0];
  if (!alert1.classList.contains('none')) {
    alert1.classList.toggle('none');
  }
  if (!alert2.classList.contains('none')) {
    alert2.classList.toggle('none');
  }

  var tarClass = '.ask' + (num - 2) + '_question';
  if (num >= 3 && num < 9) {
    $('.ask' + (num - 2) + '_ani').css('animation-play-state', 'running');
    $('.ask' + (num - 2) + '_ani').css('-webkit-animation-play-state', 'running');
  }
  if (num == 5) {
    $('.road_width_2').css('transition', 'width 1s linear 1s');
    $('.road_width_2').css('-webkit-transition', 'width 1s linear 1s');
  } else {
    $('.road_width_2').css('transition', 'width 1s linear');
    $('.road_width_2').css('-webkit-transition', 'width 1s linear');
  }

  var t = setTimeout(function() {
    swiperV.slideTo(num, 0, true);
    $(tarClass).css('transition', 'all 1s ease');
    $(tarClass).css('-webkit-transition', 'all 1s ease');
    clearTimeout(t);
  }, 500);

}

//到下一页
// function next() {
//   var active = swiperV.activeIndex;
//   swiperV.slideNext();
// }

//引子页说明切换
function sub_toggleShow(_class) {
  var tar = document.querySelectorAll(_class)[0];
  tar.classList.toggle('none');
}

//选择某项
function chooseItem(tar, items, num, option, bool) { //bool:true(读取storage),false(答题模式)
  var its = document.querySelectorAll(items);
  for (var i = 0; i < its.length; i++) {
    its[i].style.color = '#2e374e'
  }
  tar.style.color = '#ff6c37';
  score_mun[num - 1] = option;

  //保存当前最大关卡
  if (num > maxVisitedClas) maxVisitedClas = num;
  if (num == 6) {
    document.querySelectorAll('.map_prompt_1')[0].style.display = 'block';
    document.querySelectorAll('.map_prompt_2')[0].style.display = 'block';
    document.querySelectorAll('.map_getScore')[0].style.display = 'block';
    document.querySelectorAll('.map_change')[0].style.display = 'block';
  }

  //停止当前页的keyframes
  var closeClass = document.querySelectorAll('.ask' + num + '_ani')[0];
  $('.ask' + num + '_ani').css('animation-play-state', 'paused');
  $('.ask' + num + '_ani').css('-webkit-animation-play-state', 'paused');

  //将当前进度存储起来
  var storage = {
    maxClass: maxVisitedClas,
    score: score_mun
  }
  window.sessionStorage.setItem('wy_score', JSON.stringify(storage));
  if (bool) return; // 如果是读取sessionStorage,那么不返回地图
  //返回地图
  var t = setTimeout(function() {
    toMap(2);
    //改变进度条
    changeProgress(num + 1);
    clearTimeout(t);
  }, 600);
}

function changeProgress(num) {
  if (num < maxVisitedClas + 1) return; //如果是修改前面的,不修改进度条;
  var progressBar1 = document.querySelectorAll('.road_width_1')[0];
  var progressBar2 = document.querySelectorAll('.road_width_2')[0];
  switch (num) {
    case 1:
      progressBar1.style.width = '19.3vw';
      break;
    case 2:
      progressBar1.style.width = '38.7vw';
      break;
    case 3:
      progressBar1.style.width = '74.47vw';
      break;
    case 4:
      progressBar1.style.width = '100vw';
      progressBar2.style.width = '11.85vw';
      break;
    case 5:
      progressBar1.style.width = '100vw';
      progressBar2.style.width = '31vw';
      break;
    case 6:
      progressBar1.style.width = '100vw';
      progressBar2.style.width = '68.8vw';
      break;
    case 7:
      progressBar1.style.width = '100vw';
      progressBar2.style.width = '79.8vw';
      break;
  }
}

//获取结果
function getScore() {
  toClass(9);
  var score = 0;
  var rightScore = ['d', 'a', 'b', 'c', 'a', 'b']; // 这里放置正确答案
  for (var i = 0; i < score_mun.length; i++) {
    if (score_mun[i] == rightScore[i]) {
      score += 1;
    }
  }
  if (score == 6) {
    document.querySelectorAll('.score_a')[0].style.display = 'block';
  } else if (score < 6 && score >= 4) {
    document.querySelectorAll('.score_b')[0].style.display = 'block';
  } else {
    document.querySelectorAll('.score_c')[0].style.display = 'block';
  }
  window.sessionStorage.clear();
}



//事件绑定
//index
document.querySelectorAll(".swiper-button-next")[0].addEventListener("touchstart", function() {
  playAudio();
}, false);
//sub
document.querySelectorAll('.sub_click_area')[0].addEventListener("touchend", function() {
  sub_toggleShow('.sub_alert');
  playAudio();
}, false);
document.querySelectorAll('.sub_back')[0].addEventListener("touchend", function() {
  sub_toggleShow('.sub_alert');
}, false);
//map
document.querySelectorAll('.map_class')[0].addEventListener("touchend", function() {
  toClass(3, 'top');
}, false);
document.querySelectorAll('.map_class')[1].addEventListener("touchend", function() {
  toClass(4);
}, false);
document.querySelectorAll('.map_class')[2].addEventListener("touchend", function() {
  toClass(5);
}, false);
document.querySelectorAll('.map_class')[3].addEventListener("touchend", function() {
  toClass(6);
}, false);
document.querySelectorAll('.map_class')[4].addEventListener("touchend", function() {
  toClass(7);

}, false);
document.querySelectorAll('.map_class')[5].addEventListener("touchend", function() {
  toClass(8);
}, false);
document.querySelectorAll('.map_getScore')[0].addEventListener("touchend", getScore, false);
document.querySelectorAll('.map_change')[0].addEventListener("touchend", function() {
  sub_toggleShow('.map_alert_2');
}, false);
document.querySelectorAll('.map_alert_2')[0].addEventListener("touchend", function() {
  sub_toggleShow('.map_alert_2');
}, false);
document.querySelectorAll('.map_alert_3')[0].addEventListener("touchend", function() {
  sub_toggleShow('.map_alert_3');
}, false);
document.querySelectorAll('.map_alert1_close')[0].addEventListener("touchend", function() {
  sub_toggleShow('.map_alert_1');
}, false);

//class 1
document.querySelectorAll('.ask1_a')[0].addEventListener("touchend", function() {
  chooseItem(this, '.ask1_a', 1, 'a');
}, false);
document.querySelectorAll('.ask1_a')[1].addEventListener("touchend", function() {
  chooseItem(this, '.ask1_a', 1, 'b');
}, false);
document.querySelectorAll('.ask1_a')[2].addEventListener("touchend", function() {
  chooseItem(this, '.ask1_a', 1, 'c');
}, false);
document.querySelectorAll('.ask1_a')[3].addEventListener("touchend", function() {
  chooseItem(this, '.ask1_a', 1, 'd');
}, false);
//class2
document.querySelectorAll('.ask2_a')[0].addEventListener("touchend", function() {
  chooseItem(this, '.ask2_a', 2, 'a');
}, false);
document.querySelectorAll('.ask2_a')[1].addEventListener("touchend", function() {
  chooseItem(this, '.ask2_a', 2, 'b');
}, false);
document.querySelectorAll('.ask2_a')[2].addEventListener("touchend", function() {
  chooseItem(this, '.ask2_a', 2, 'c');
}, false);
document.querySelectorAll('.ask2_a')[3].addEventListener("touchend", function() {
  chooseItem(this, '.ask2_a', 2, 'd');
}, false);
//class3
document.querySelectorAll('.ask3_a')[0].addEventListener("touchend", function() {
  chooseItem(this, '.ask3_a', 3, 'a');
}, false);
document.querySelectorAll('.ask3_a')[1].addEventListener("touchend", function() {
  chooseItem(this, '.ask3_a', 3, 'b');
}, false);
document.querySelectorAll('.ask3_a')[2].addEventListener("touchend", function() {
  chooseItem(this, '.ask3_a', 3, 'c');
}, false);
document.querySelectorAll('.ask3_a')[3].addEventListener("touchend", function() {
  chooseItem(this, '.ask3_a', 3, 'd');
}, false);
//class4
document.querySelectorAll('.ask4_a')[0].addEventListener("touchend", function() {
  chooseItem(this, '.ask4_a', 4, 'a');
}, false);
document.querySelectorAll('.ask4_a')[1].addEventListener("touchend", function() {
  chooseItem(this, '.ask4_a', 4, 'b');
}, false);
document.querySelectorAll('.ask4_a')[2].addEventListener("touchend", function() {
  chooseItem(this, '.ask4_a', 4, 'c');
}, false);
document.querySelectorAll('.ask4_a')[3].addEventListener("touchend", function() {
  chooseItem(this, '.ask4_a', 4, 'd');
}, false);
//class5
document.querySelectorAll('.ask5_a')[0].addEventListener("touchend", function() {
  chooseItem(this, '.ask5_a', 5, 'a');
}, false);
document.querySelectorAll('.ask5_a')[1].addEventListener("touchend", function() {
  chooseItem(this, '.ask5_a', 5, 'b');
}, false);
document.querySelectorAll('.ask5_a')[2].addEventListener("touchend", function() {
  chooseItem(this, '.ask5_a', 5, 'c');
}, false);
document.querySelectorAll('.ask5_a')[3].addEventListener("touchend", function() {
  chooseItem(this, '.ask5_a', 5, 'd');
}, false);
//class6
document.querySelectorAll('.ask6_a')[0].addEventListener("touchend", function() {
  chooseItem(this, '.ask6_a', 6, 'a');
}, false);
document.querySelectorAll('.ask6_a')[1].addEventListener("touchend", function() {
  chooseItem(this, '.ask6_a', 6, 'b');
}, false);
document.querySelectorAll('.ask6_a')[2].addEventListener("touchend", function() {
  chooseItem(this, '.ask6_a', 6, 'c');
}, false);
document.querySelectorAll('.ask6_a')[3].addEventListener("touchend", function() {
  chooseItem(this, '.ask6_a', 6, 'd');
}, false);