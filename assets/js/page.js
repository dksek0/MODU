// * gloabal variables
var prevPos = 0;
var firstReach = false;
var learnReach = false;
var reachArray = [false, false, false];
var guideAnimMo = [];
var learnCard = [];

/* ========================
* init
* ======================== */
$(function () {

  //디테일 페이지 슬라이드
  detailSwiper();
  movieSwiper();
  paperSwiper();
  collectSwiper();
  calcSlideWidth();
  learnSwiper();
  isMobile() && mainCollectSwiper();
});

/* ========================
* resize
* ======================== */
$(function () {
  $(window).on('resize', function () {
    detailSlide !== undefined ? detailSlide.update() : detailSwiper();
    movieSlide !== undefined ? movieSlide.update() : movieSwiper();
    paperSlide !== undefined ? paperSlide.update() : paperSwiper();
    collectSlide !== undefined ? collectSlide.update() : collectSwiper();
    if( !isMobile() ){
      storySlide !== undefined ? storySlide.update() : storySwiper();
    }
    calcSlideWidth();

    if( isMobile() ){
      guideSlide !== undefined ? guideSlide.update() : guideSwiper();
      learnSlide !== undefined ? learnSlide.update() : learnSwiper();
      togetherSlide !== undefined ? togetherSlide.update() : togetherSwiper();
      mainCollectSlide !== undefined ? mainCollectSlide.update() : mainCollectSwiper();
    }else {
      if( guideSlide !== undefined ){
        guideSlide.destroy();
        guideSlide = undefined;
      }
      if( learnSlide !== undefined ){
        learnSlide.destroy();
        learnSlide = undefined;
      }
      if( togetherSlide !== undefined ){
        console.log("1");
        togetherSlide.destroy();
        togetherSlide = undefined;
      }
      if( mainCollectSlide !== undefined ){
        mainCollectSlide.destroy();
        mainCollectSlide = undefined;
      }
    }

    if( window.innerWidth <= 1024 ){
      //detail page sidenav 상단 고정 해체
      if( $('.sidenav').length>0 ){
        $('.sidenav').removeClass("is-sticky");
      }
    }
  });
});

/* ========================
* main
* ======================== */
$(function(){
  if(!$('.main').length){
    return ;
  }

  // 메인페이지 헤더 스타일 적용
  $comp.header.addClass('is-main');

  // 메인 배너가 있을 경우
  if($('.main_banner').length){
    $('.main_banner').addClass('is-show');
    $comp.body.addClass('with-banner');
    isMobile() && $comp.body.addClass('is-fixed');
  }
  
  $(window).on('resize', function(e){
    // 메인 배너가 있을 경우 모바일에서 바디 영역 픽스
    if($('.main_banner').length){
      isMobile() ? $comp.body.addClass('is-fixed') : $comp.body.removeClass('is-fixed');
    }
  });

  // 모바일 스와이퍼 호출
  if( isMobile() ){
    guideSwiper();
    learnSwiper();
    togetherSwiper();
  }

  // 메인 페이지 커스텀 커서
  var $cursor = $('.cursor');
  setCursorStyle();

  $(window)
    .on('mousemove', cursor);

  /**
   * 커스텀 커서의 left, top 값을 커서의 x,y 좌표 값과 일치시킴
   * @param {event} e : event 객체
   */
   function cursor(e) {
    gsap.to($cursor, .3, {
      x: e.pageX,
      y: (e.pageY - scrollY)
    })
  }

  /**
   * 터치 디바이스에서는 커스텀 커서 노출시키지 않음
   */
  function setCursorStyle(){
    'ontouchstart' in document.documentElement ? $cursor.hide() : $cursor.show();
  }

  // notice gsap
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function() {
      // desktop
      gsap.to(".main_hero_notice",{
        scrollTrigger:{
          trigger: ".main_hero_cont",
          start: 'top top',
          end: '+=88',
          scrub: 0.1,
        },
        y: -80
      });
    }
  });

  // hero 재생 바 모션
  var heroBarMotion = {
    tween: undefined,
    isTween: function(){
      return (typeof this.tween !== 'undefined')
    },
    $target: $('.hero_play_bar'),
    play: function(){
      this.isTween() && this.kill();

      gsap.set(this.$target, {yPercent: -100, y: 0, opacity: 0});
      
      var playBarHeight = $('.hero_play').height();
      this.tween = gsap.fromTo(this.$target, 
        { yPercent: -100, opacity: 0 }, 
        { yPercent: 0, opacity: 1, y: playBarHeight, repeat: -1, repeatDelay: 1, duration: 1.6, delay: 0.8, ease: 'easeIn' }
      );
    },
    kill: function(){
      this.isTween() && this.tween.kill();
      gsap.set(this.$target, {yPercent: -100, y: 0, opacity: 0});
      this.tween = undefined;
    },
    pause: function(){
      if(!this.isTween()){
        return ;
      }
      this.tween.pause();
      gsap.set(this.$target, {yPercent: -100, y: 0, opacity: 0});
    },
    restart: function(){
      if(!this.isTween()){
        this.play();
        return ;
      }
      this.tween.resume();
    }
  }

  $(window).on('scroll', () => {
    if($(window).scrollTop() >= 200){
      heroBarMotion.pause();
    }
    else {
      if($('.hero_play').hasClass('is-play')){
        heroBarMotion.restart();
      }
    }
  })

  $(window).on('resize', () => {
    if($('.hero_play').hasClass('is-play')){
      heroBarMotion.play();
    }
  });

  //hero 애니메이션 - pc
  if( $('.main').hasClass('en') ){
    var heroAnim = applyAnimationData(document.getElementsByClassName('heroAnim')[0], './assets/json/intro_pc_eng.json', 'svg', false, true);
  }else {
    var heroAnim = applyAnimationData(document.getElementsByClassName('heroAnim')[0], './assets/json/intro_pc.json', 'svg', false, true);
  }
  //hero 애니메이션 - 모바일
  if( $('.main').hasClass('en') ){
    var mHeroAnim = applyAnimationData(document.getElementsByClassName('heroMobileAnim')[0], './assets/json/intro_tablet_eng.json', 'svg', false, true);
  }else {
    var mHeroAnim = applyAnimationData(document.getElementsByClassName('heroMobileAnim')[0], './assets/json/intro_tablet.json', 'svg', false, true);
  }

  // 애니메이션이 종료되면 hero 텍스트 노출
  heroAnim.onComplete = function(){
    gsap.to('.main_hero_sub', { y: -30, opacity: 1, duration: 0.3, delay: 0.5, onComplete: () => {
      heroBarMotion.restart();
      $('.hero_play')
        .addClass('is-show')
        .addClass('is-play');
      }
    });
  }
  mHeroAnim.onComplete = function(){
      gsap.to('.main_hero_sub', { y: -30, opacity: 1, duration: 0.3, delay: 0.5, onComplete: () => {
        heroBarMotion.restart();  
        $('.hero_play')
          .addClass('is-show')
          .addClass('is-play');
        }
      });
  }
  
  // hero 알림 스와이퍼
  new Swiper(".heroNoticeSwiper", {
    direction: 'vertical',
    observer: true,
    observeParents: true,
    watchOverflow: true,
    slidesPerView: '1',
    navigation: {
      nextEl: '.hero_notice_navi_next',
      prevEl: '.hero_notice_navi_prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: false
    },
    loop: true,
    speed: 500
  });

  $('body')
    // hero 애니메이션 재생 버튼 클릭 시
    .on('click', '.hero_play_btn', function(){
      // hero 텍스트 숨김 처리
      gsap.set('.main_hero_sub', {y: 30, opacity: 0});
      // hero 버튼 숨김 처리
      $('.hero_play')
        .removeClass('is-show')
        .removeClass('is-play');
      // hero 재생 버튼 바 모션 kill
      heroBarMotion.kill();
      // pc 애니메이션 정지 후 재생
      if(typeof heroAnim.animationID !== 'undefined'){
        heroAnim.stop();
        heroAnim.play();
      }
      // 모바일 애니메이션 정지 후 재생
      if(typeof mHeroAnim.animationID !== 'undefined'){
        mHeroAnim.stop();
        mHeroAnim.play();
      }
    })
    //가이드 리스트 호버시
    .on('mouseenter', '.main_guide_item', function(){
      var $index = $('.main_guide_item').index(this);

      $('.main_guide_lottie').css('display', 'none');
      $('.main_guide_lottie').eq($index).css('display', 'block');

      guideAnim[$index].stop();
      guideAnim[$index].play();
    })
    // 클릭 요소에 마우스오버할 경우 커스텀 커서 hide
    .on('mouseover', 'a, button, input, .hero_notice_navi_btn, .swiper-pagination-bullet', (e) => {
      var $target = $(e.target);
      if ($target.hasClass('main_explore_link')){
        return ;
      }
      $cursor.addClass('hide-cursor');
      gsap.to($cursor,{scale: 0, duration: 0.1});
    })
    .on('mouseleave', 'a, button, input, .hero_notice_navi_btn, .swiper-pagination-bullet', (e) => {
      var $target = $(e.target);
      if ($target.hasClass('main_explore_link')){
        return ;
      }

      gsap.to($cursor,{scale: 1, duration: 0.1});
      $cursor.removeClass('hide-cursor');
    })
  ;

  //가이드 리스트 애니메이션
  var guideAnim = [];
  for( var i=0; i<$('.main_guide_anim').length; i++){
    guideAnim.push(applyAnimationData(document.getElementsByClassName('main_guide_anim')[i], './assets/json/animation_'+ (i+1) +'.json', 'svg', false, false));
  }

  //가이드 리스트 애니메이션(MO)
  for( var i=0; i<$('.main_guide_anim_mo').length; i++){
    guideAnimMo.push(applyAnimationData(document.getElementsByClassName('main_guide_anim_mo')[i], './assets/json/animation_'+ (i+1) +'.json', 'svg', false, false));
  }

  $(window).on('scroll', function(e){

    var $currentPos = $(window).scrollTop(),
    $screenH = $(window).height(),
    $guideList = $('.main_guide_list').offset().top;
    $learnCard = $('.scroll_card').offset().top;

    if( $guideList < ($currentPos + ($screenH/2)) ){ //가이드 리스트가 화면 중앙에 도달했을 때 play
      if( !firstReach ){
        guideAnimMo[0].stop();
        guideAnimMo[0].play();
        guideAnim[0].stop();
        guideAnim[0].play();
        firstReach = true
      }
    }

    if(isMobile()){
      if( $learnCard < ($currentPos + ($screenH/2)) ){ //배워봐요가 화면 중앙에 도달했을 때 play
        if( !learnReach ){
          learnCard[0].stop();
          learnCard[0].play();
          learnReach = true;
        }
      }
    }

    //가이드 보더 유효성 체크
    if( $currentPos < 1 ){
      $('.main_guide_con').removeClass('is-show');
    }

    //함께해요 보더 유효성 체크
    var $targetIndex = ( $('.main_together_item').offset().top - $screenH ) ;
    if( $currentPos < $targetIndex ){
      $('.main_together_item').removeClass('is-show');
    }

  });

  // 가이드 - gsap
  gsap.to(".main_guide_title",{
    scrollTrigger:{
      trigger: ".main_guide_title",
      start: "20% bottom",
      end: "50% bottom",
      scrub: 1.5,
    },
    y: -150
  });
  gsap.to(".main_guide_con",{
    scrollTrigger:{
      trigger: ".main_guide_title",
      start: "30% bottom",
      end: "50% bottom",
      scrub: 1.5,
      onEnter: () => $('.main_guide_con').addClass('is-show'),
    },
    y: -150
  });
  
  // 배워봐요 - gsap
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function() {
      // desktop
      // bg text
      var learnTextTl = gsap.timeline();
      ScrollTrigger.create({
        animation: learnTextTl,
        trigger: '.main_learn',
        start: 'top 50%',
        end: '90% bottom',
        scrub: true,
      });
    
      learnTextTl.fromTo('.main_learn .bg_text', {x : -1300}, {x : 0});

      ScrollTrigger.create({
        trigger: '.main_learn',
        start: 'top top',
        end: '94% bottom',
        scrub: true,
        pin: '.main_learn .bg_text',
      });
    
      // card
      const learnCards = gsap.utils.toArray('.scroll_card_item')
      learnCards.forEach(card => {
        gsap.to(card, {
          scrollTrigger:{
            trigger: card,
            start: "top bottom",
            end: "top bottom",
            scrub: 0.5,
          },
          y: 0
        })
      })
    }
  });

  // 함께해요 - gsap
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function() {
      // desktop
      //img
      const togetherImg = gsap.utils.toArray('.main_together_img');
      togetherImg.forEach(img => {
        gsap.timeline({ 
          scrollTrigger:{
            trigger: img,
            start: "20% bottom",
            end: "50% bottom",
            scrub: 0.5,
          },
        })
        .fromTo(img, { y:100 }, { y:0 });
      })
      //text
      const togetherText = gsap.utils.toArray('.main_together_text_wrap');
      togetherText.forEach(function(text, index){
        gsap.timeline({ 
          scrollTrigger:{
            trigger: text,
            start: "30% bottom",
            end: "50% bottom",
            scrub: 1,
            onEnter: () => { $('.main_together_item').eq(index).addClass('is-show') }
          },
        })
        .fromTo(text, { y:100 }, { y:0 });
      })
    },
    // mobile
    "(max-width: 1023px)": function() {
      //img
      const togetherImg = gsap.utils.toArray('.main_together_img');
      togetherImg.forEach(img => { gsap.fromTo(img, { y:0 }, { y:0 }) })
      //text
      const togetherText = gsap.utils.toArray('.main_together_text_wrap');
      togetherText.forEach(text => { gsap.fromTo(text, { y:0 }, { y:0 }) })
    },
  });

  // 배워봐요 - lottie
  for (let i = 0; i < document.querySelectorAll('.scroll_card_item').length; i++) {
    if ($('.main').hasClass('en')) {
      learnCard.push(applyAnimationData(document.querySelectorAll('.scroll_card_item')[i].querySelector('.ani'), './assets/json/animation_'+(i+4)+'_en.json', 'svg', false, false))
    } else {
      learnCard.push(applyAnimationData(document.querySelectorAll('.scroll_card_item')[i].querySelector('.ani'), './assets/json/animation_'+(i+4)+'.json', 'svg', false, false))
    }
    document.querySelectorAll('.scroll_card_item')[i].addEventListener('mouseenter', function () {
      if ( ! isMobile() ) {
        learnCard[i].stop();
        learnCard[i].play();
      }
    })
  }

  /**
   * lottie animation
   * @param {HTMLElement} container 애니메이션의 wrapper 역할을 할 HTMLElment
   * @param {String} path 애니메이션 json 파일 경로
   * @param {String} renderer renderer || 'svg'
   * @param {Boolean} [loop] loop || false
   * @param {Boolean} [autoplay] autoplay || false
   * @returns 
   */
  function applyAnimationData(container, path, renderer, loop, autoplay){

    return bodymovin.loadAnimation({
      container: container, // Required(type : HTMLElement)
      path: path || '', // Required
      renderer: renderer || 'svg', // Required
      loop: loop || false, // Optional
      autoplay: autoplay || false, // Optional
    });
  }

  if( !$('.main').hasClass('en') ) {
    // 탐구해요 하단 사선으로 채워지는 모션
    exploreTl01 = gsap.timeline();
    exploreTl02 = gsap.timeline();
  
    ScrollTrigger.create({
      animation: exploreTl01,
      trigger: '.main_collect',
      start: 'top bottom',
      end: 'top 70%',
      scrub: 0.1,
      pinSpacing: 'false',
      anticipatePin: 1,
      ease: 'ease-in'
    });
  
    ScrollTrigger.create({
      animation: exploreTl02,
      trigger: '.main_collect',
      start: 'top 200',
      end: 'top top',
      scrub: 0.1,
      pinSpacing: 'false',
      anticipatePin: 1,
      ease: 'ease-in'
    });
  
    exploreTl01.fromTo('.main_explore_space', {rotate : 0}, {rotate: 5});
    exploreTl02.fromTo('.main_explore_space', {rotate : 5}, {rotate: 0});
  }
  
  // 탐구해요 타이틀 모션 - gsap
  gsap.timeline({ 
    scrollTrigger:{
      trigger: '.main_explore_title',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1
    },
  })
  .fromTo('.main_explore_title', { y:100 }, { y:0 });

  // 탐구해요 - 커스텀 커서
  var $cursorBg = $('.cursor_bg');
  $('.main_explore_link').each((index, item) => {
    $(item)
      .on("mouseover", (e) => {
        $cursor
          .addClass('is-active')
          .find('.cursor_bg')
            .removeClass('theme-01')
            .removeClass('theme-02')
            .removeClass('theme-03')
            .removeClass('theme-04')
            .addClass('theme-0' + (index + 1));
          
        gsap.killTweensOf($cursorBg);
        if( $('.main').hasClass('en') ){
          gsap.fromTo($cursorBg, {scale: 1}, {duration: 0.3, scale: 20, ease: 'easeIn'});
        }else {
          gsap.fromTo($cursorBg, {scale: 1}, {duration: 0.3, scale: 25, ease: 'easeIn'});
        }
      })
      .on("mouseleave", () => {
        $cursor
          .removeClass('is-active');
        gsap.killTweensOf($cursorBg);
        gsap.to($cursorBg, {duration: 0.2, scale: 0, ease: 'easeIn'});
      });
  });

  // 탐구해요 콘텐츠 모션 - gsap
  ScrollTrigger.matchMedia({
    // desktop
    "(min-width: 1025px)": function() {
      // 포지션 초기화
      gsap.set(['.explore_item_01, .explore_item_02, .explore_item_03, .explore_item_04'], {xPercent: 0});
      
      // timeline
      var exploreTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.main_explore',
          start: '20% bottom',
          end: 'bottom bottom',
          scrub: 0.5,
          pinSpacing: 'false',
          anticipatePin: 1
        }
      });

      exploreTl
        .from('.explore_item_01', { xPercent: 20 })
        .from('.explore_item_02', { xPercent: -20 }, '-=0.3')
        .from('.explore_item_03', { xPercent: 20 }, '-=0.3')
        .from('.explore_item_04', { xPercent: -20 }, '-=0.3');
    },
    // mobile
    "(max-width: 1024px)": function() {
      // gsap 리스트 pc 모션 kill
      gsap.set(['.explore_item_01, .explore_item_02, .explore_item_03, .explore_item_04'], {xPercent: 0});
      gsap.killTweensOf(['.explore_item_01, .explore_item_02, .explore_item_03, .explore_item_04']);
    },
  });

  // 탐구해요 스와이퍼(모바일)
  var exploreSwiper = undefined;
  setExploreSwiper();

  $(window).resize(function(){
    setExploreSwiper();
  });

  // 탐구해요 스와이퍼
  function setExploreSwiper(){
    // pc에서 스와이퍼 destroy
    if(!isMobile()){
      if(exploreSwiper !== undefined){
        exploreSwiper.destroy();
        exploreSwiper = undefined;
      }
    }
    else {
      $('.exploreSwiper').addClass('swiper-container');
      $('.main_explore_list').addClass('swiper-wrapper');
      $('.main_explore_item')
        .addClass('swiper-slide')
        .css({'transform': 'translate(0)'});
      
      if(exploreSwiper !== undefined){
        return ;
      }

      exploreSwiper = new Swiper(".exploreSwiper", {
        observer: true,
        observeParents: true,
        watchOverflow: false,
        slidesPerView: 1,
        pagination: {
          el: '.exploreSwiper_pagination',
          clickable: true
        },
        on: {
          init: function(){
            if(!isMobile()){
              return ;
            }
            var index = this.activeIndex;
            $('.main_explore_cont')
              .removeClass('theme-01')
              .removeClass('theme-02')
              .removeClass('theme-03')
              .removeClass('theme-04')
              .addClass('theme-0' + (parseInt(index) + 1));
          },
          slideChange: function(){
            if(!isMobile()){
              return ;
            }
            var index = this.activeIndex;
            $('.main_explore_cont')
              .removeClass('theme-01')
              .removeClass('theme-02')
              .removeClass('theme-03')
              .removeClass('theme-04')
              .addClass('theme-0' + (parseInt(index) + 1));
          },
          destroy: function(){
            $('.exploreSwiper').removeClass('swiper-container');
            $('.main_explore_list').removeClass('swiper-wrapper');
            $('.main_explore_item').removeClass('swiper-slide');
          }
        }
      });
    }
  }
});

//가이드 모바일 스와이퍼
var guideSlide = undefined;
function guideSwiper() {
  if($(".guideSwiper").length > 0){
    guideSlide = new Swiper(".guideSwiper", {
      direction: 'horizontal',
      observer: true,
      observeParents: true,
      watchOverflow: true,
      speed: 400,
      breakpoints: {
        1024: {
          slidesPerView: 1.35,
          spaceBetween: 26,
        },
        768: {
          slidesPerView: 1.1,
          spaceBetween: 16,
        }
      },
      on: {
        slideChange: function () {
          var $index = guideSlide.activeIndex;
          for( var i=0; i<$(".main_guide_item").length; i++ ){
            guideAnimMo[i].stop();
          }
          guideAnimMo[$index].play();
        },
        reachEnd: function () {
          this.snapGrid = [...this.slidesGrid];
          setTimeout(() => {
            guideSlide.slideTo(guideSlide.snapGrid.length+1, 400);
            clearTimeout()
          }, 1);
        },
      }
    });
    guideSlide.snapGrid = guideSlide.slidesGrid.slice(0);
  }
}

//배워봐요 모바일 스와이퍼
var learnSlide = undefined;
function learnSwiper() {
  if($(".learnCardSwiper").length > 0){
    var learnSlide = new Swiper(".learnCardSwiper", {
      breakpoints: {
        1024: {
          observer: true,
          observeParents: true,
          watchOverflow: true,
          slidesPerView: 'auto',
          spaceBetween: 16,
        }
      },
      on: {
        slideChange: function () {
          var $index = learnSlide.realIndex;
          learnCard[$index].stop();
          learnCard[$index].play();
        },
        reachEnd: function() {
          this.snapGrid = [...this.slidesGrid];
        },
      }
    });
    learnSlide.snapGrid = learnSlide.slidesGrid.slice(0);
  }
}

//함께해요 모바일 스와이퍼
var togetherSlide = undefined;
function togetherSwiper() {
  if($(".togetherSwiper").length > 0){
    togetherSlide = new Swiper(".togetherSwiper", {
      breakpoints: {
        1024: {
          slidesPerView: 1.35,
          spaceBetween: 26,
        },
        768: {
          slidesPerView: 1.15,
          spaceBetween: 16,
        }
      },
      on: {
        reachEnd: function () {
          this.snapGrid = [...this.slidesGrid];
          setTimeout(() => {
            togetherSlide.slideTo(togetherSlide.snapGrid.length+1, 400);
            clearTimeout()
          }, 1);
        },
      }
    });
    togetherSlide.snapGrid = togetherSlide.slidesGrid.slice(0);
  }
}

// 소장품 모바일 스와이퍼
var mainCollectSlide = undefined;
function mainCollectSwiper() {
  if($(".mainCollectSwiper").length > 0){
    mainCollectSlide = new Swiper(".mainCollectSwiper", {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        1024: {
          slidesPerView: '1',
        }
      },
    });
  }
}


/* ========================
* mypage
* ======================== */
$(function(){
  if(!$('.mypage').length){
    return ;
  }

  $('body')
    //프로필 유형 선택
    .on('click', '.popup_profile_item', function(e){
      e.preventDefault();

      var $this = $(this),
      profileItem = $('.popup_profile_item');

      profileItem.removeClass('is-active').removeAttr('title');
      $this.addClass('is-active').attr('title', '선택됨');
    })
   // 나의좋아요, 최근본 콘텐츠 탭 메뉴
   var tabContHandler = function (e) {
     e.preventDefault();
 
     var $this = $(this);
 
     if($this.hasClass('is-active')){
       return ;
     }
 
     // tab list
     $('.sort_category_item').removeClass('is-active');
     $this.addClass('is-active');
     // tab content
     $('.card_wrap').removeClass('is-active');
     $('.card_wrap[data-tab-cont="' + $this.attr('data-tab') + '"]').addClass('is-active');
   }
   document.querySelectorAll('.sort_category_item').forEach( function (e) {
    e.addEventListener('click', tabContHandler);
  })

  //스크롤 시 sidenav 상단 고정
  var $sidenav = $('.sidenav');
  var $pos = $sidenav.position();

  $(window).on('load scroll resize', function() {      
    var $scroll = $(window).scrollTop();

    if( window.innerWidth > 1024 ){
      if ( $scroll >= ( $pos.top - 18 ) ) {
        var $footerTop = $('.footer').offset().top - window.innerHeight;
        if( window.pageYOffset >= $footerTop ){
          $sidenav.removeClass("is-sticky").addClass('is-absolute');
          $('.mypage_wrap').addClass('relative');
        }else {
          $sidenav.addClass("is-sticky").removeClass('is-absolute');
          $('.mypage_wrap').removeClass('relative');
        }
      } else {
        $sidenav.removeClass("is-sticky is-absolute"); 
      }
    }
  });

});


/* ========================
* page: together list
* ======================== */
$(function(){
  if(!$('.togetherList').length){
    return ;
  }

  var $sticky = $('.m-sticky');
  var stickyOriginPos = 0;
  var prevPos = 0;

  if($sticky.length){
    stickyOriginPos = $sticky.closest('.sort').offset().top;
    isMobile() ? stickyOriginPos -= 56 : stickyOriginPos -= 88;
  }

  $(window).on('resize', function(){
    if($sticky.length){
      stickyOriginPos = $('.m-sticky').closest('.sort').offset().top;
      isMobile() ? stickyOriginPos -= 56 : stickyOriginPos -= 88;
    }
  });
    
  $(window).on('scroll', function(e){
    if($('.header').hasClass('is-search')){
      return ;
    }

    var currentPos = $(window).scrollTop();
    
    // 스크롤 위치가 필터 위치보다 높으면 fix 해제
    if(currentPos < stickyOriginPos){
      $sticky.length && 
        $sticky
          .removeClass("fix-hide")
          .removeClass("is-fixed");
    }
    // 스크롤 시 fix 해제
    else if(currentPos > 0 && currentPos > prevPos) {
      $sticky.length && 
        $sticky
          .addClass("fix-hide")
          .removeClass("is-fixed");
    } 
    // 백스크롤 시 필터 최상단에 고정
    else {
      $sticky.length && $sticky.addClass("is-fixed"); 
    }

    prevPos = currentPos;
  });

  $('body')
    // 함께해요 탭 메뉴
    .on('click', '.together_tab_link', function(e){
      e.preventDefault();

      var $this = $(this);

      if($this.hasClass('is-current')){
        return ;
      }

      // tab list
      $('.together_tab_link').removeClass('is-current');
      $this.addClass('is-current');
      // tab content
      $('.together_cont').removeClass('is-current');
      $('.together_cont[data-tab-cont="' + $this.attr('data-tab') + '"]').addClass('is-current');
    })
    // 함께해요 리액션 버튼 활성화
    .on('click', '.reaction_btn', function(e){
      e.preventDefault();

      $(this)
        .addClass('is-active')
        .siblings().removeClass('is-active');
    })
    // 함께해요 리액션 버튼 포커스 타이틀 활성화
    .on('focus', '.reaction_btn', function(e){
      e.preventDefault();

      $(this).find('.reaction_title').show();
    })
    // 함께해요 리액션 버튼 타이틀 포커스 아웃 비활성화
    .on('focusout', '.reaction_btn', function(e){
      e.preventDefault();

      $(this).find('.reaction_title').hide();
    })
    // 함께해요 라디오 버튼 선택 시 선택완료 버튼 활성화 스타일로 변경
    .on('change', '.together_card_page input', function(e){
      var $this = $(e.target);

      if($this.prop('checked')){
        $this.closest('.together_card_page').find('.together_quiz_btn .is-complete').prop('disabled', false);
      }
    })
    // 함께해요 ox 버튼 중 선택된 버튼이 있으면 선택완료 버튼 활성화 스타일로 변경
    .on('click', '.together_card_page .toggle_item.agree, .together_card_page .toggle_item.disagree', function(e){
      var $this = $(e.target);
      if($this.hasClass('is-disabled')){
        return ;
      }

      var $quizBtn = $this.closest('.together_card_page').find('.together_quiz_btn .is-complete');
      $this.hasClass('is-active') ? $quizBtn.prop('disabled', false) : $quizBtn.prop('disabled', true);
    })
    ;
  });


/* ========================
* datail
* ======================== */
$(function(){
  if(!$('.detail').length){
    return ;
  }

  $(window).on('resize', function(){
    var $cont = $('.detail_desc');
    $cont.removeClass('has-more');

    //컨텐츠 텍스트 더보기 버튼 활성화
    if( isMobile() ){
      if( $('.detail_desc .text').height() > 504 ){
        $cont.addClass('has-more');
      }
    }else {
      if( $('.detail_desc .text').height() > 216 ){
        $cont.addClass('has-more');
      }
    }
  });

  //컨텐츠 텍스트 더보기 버튼 활성화
  if( isMobile() ){
    if( $('.detail_desc .text').height() > 504 ){
      var $cont = $('.detail_desc');
      $cont.addClass('has-more');
    }
  }else {
    if( $('.detail_desc .text').height() > 216 ){
      var $cont = $('.detail_desc');
      $cont.addClass('has-more');
    }
  }

  $('body')
    //디테일 내용 더보기 클릭시
    .on('click', '.detail_desc .more_link', function(e){
      e.preventDefault();

      var $this = $(this),
      $detailText = $this.parents('.detail_desc');

      if( $detailText.hasClass('is-appended') ){
        $detailText.removeClass('is-appended');
        $this.text('더보기');
      }else {
        $detailText.addClass('is-appended');
        $this.text('접기');
      }
    });

});


/* ========================
* learn: detail
* ======================== */
$(function(){
  if(!$('.learn_detail').length){
    return ;
  }

  var applySlide = applySwiper();

  $(window).on('resize', function(){
    if(isMobile()){
      if(applySlide == 'undefined'){
        applySlide = applySwiper();
      }
    }
  });

  function applySwiper(){
    if(!$('.applySwiper').length){
      return undefined;
    }

    return new Swiper(".applySwiper", {
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 'auto',
      spaceBetween: 16
    });
  }
});


/* 디테일 슬라이드 너비 계산 */
function calcSlideWidth() {
  var $width = $(window).width(),
  $contentWidth = $('.detail .inner').width(),
  $calcWidth = ($width - $contentWidth) / 2,
  $slide = $('.detail_recommend_slide');

  $slide.css( {'padding-left': $calcWidth, 'margin-left': -$calcWidth } );
}

/* swiper */
//탐구해요 > 소장품 히어로 스와이퍼 
var detailSlide = undefined;
function detailSwiper() {
  if($(".detailSwiper").length > 0){
    detailSlide = new Swiper(".detailSwiper", {
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 1,
      spaceBetween: 0,
      speed : 450,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  }
}

//추천 동영상 스와이퍼
var movieSlide = undefined;
function movieSwiper() {
  if($(".movieSwiper").length > 0){
    movieSlide = new Swiper(".movieSwiper", {
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 'auto',
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  }
}

//추천 활동지 스와이퍼
var paperSlide = undefined;
function paperSwiper() {
  if($(".paperSwiper").length > 0){
    paperSlide = new Swiper(".paperSwiper", {
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 'auto',
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  }
}

//추천 소장품 스와이퍼
var collectSlide = undefined;
function collectSwiper() {
  if($(".collectSwiper").length > 0){
    collectSlide = new Swiper(".collectSwiper", {
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 'auto',
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  }
}


//소장품 스토리 필터 스와이퍼
var storySlide = undefined;
function storySwiper() {
  if($(".storySwiper").length > 0){
    storySlide = new Swiper(".storySwiper", {
      observer: true,
      observeParents: true,
      watchOverflow: true,
      slidesPerView: 'auto',
      spaceBetween: 0,
      freeMode: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
    });
  }
}

/* ========================
* page: explore
* ======================== */
$(function(){
  if(!$('.list_page .filter').length){
    return ;
  }

  var exploreFilter = $('.list_page .filter');
  var pos = exploreFilter.position();                    
  $(window).scroll(function() {
    var windowpos = $(window).scrollTop();

    if (windowpos >= pos.top) {
      if(windowpos > 0 && windowpos > prevPos) { // 스크롤 시 fix 해제
        exploreFilter
          .addClass('stick-hide')
          .removeClass("stick");
        if($('.cancelBtn:visible').length){
          $('.cancelBtn').trigger('click');
        }
      }else { // 백스크롤 시 fix
        exploreFilter
          .removeClass('stick-hide')
          .addClass("stick"); 
          if($('.daterangepicker:visible').length){
            if(window.innerWidth < 1280){
              $('.daterangepicker').css({'position': 'fixed', 'top': '144px', 'left': 0});
            }
            else {
              $('.daterangepicker').css({'position': 'fixed', 'top': '160px', 'left': 0});
            }
          }
      }

      prevPos = windowpos;
    }else {
      exploreFilter.removeClass("stick").removeClass('stick-hide'); 
      prevPos = windowpos;
      
      if(window.innerWidth < 1280 ){
        $('.daterangepicker').css({'position': 'absolute', 'top': '380px', 'left': $('.list_filter').offset().left});
      }
      else {
        $('.daterangepicker').css({'position': 'absolute', 'top': '398px', 'left': $('.list_filter').offset().left});
      }
    }
  });
});

/* ========================
* page: search
* ======================== */
$(function(){
  if(!$('.search_wrap').length){
    return ;
  }

  $('.header_search').remove();
})

/* ========================
* page: learn
* ======================== */
$(function(){
  // 배워봐요 프로그램 접수
  if(!$('.apply_wrap').length){
    return ;
  }

  $('body')
    .on('click', '.dropdown_btn', function () {
      if ($(this).parents('.dropdown_wrap').hasClass('is-active')) {
        $('.dropdown_wrap').removeClass('is-active');
        $('.popup_dropdown').removeClass('is-active');
      } else {
        $('.dropdown_wrap').removeClass('is-active');
        $('.popup_dropdown').removeClass('is-active');
        $(this).parents('.dropdown_wrap').addClass('is-active');
        $(this).siblings('.popup_dropdown').addClass('is-active');
      }
    })
    .on('keyup', '.dropdown_btn', function (e) {
      if (e.keyCode === 13) {
        if ($(this).parents('.dropdown_wrap').hasClass('is-active')) {
          $('.dropdown_wrap').removeClass('is-active');
          $('.popup_dropdown').removeClass('is-active');
        } else {
          $('.dropdown_wrap').removeClass('is-active');
          $('.popup_dropdown').removeClass('is-active');
          $(this).parents('.dropdown_wrap').addClass('is-active');
          $(this).siblings('.popup_dropdown').addClass('is-active');
        }
      }
    })
    .on('click', '.popup_dropdown_btn', function (e) {
      var $this = $(this);
      
      if($this.closest('.header').length){
        return ;
      }
      
      e.preventDefault();

      var selectText = $(this).html();
      //드롭다운 리스트 값을 input value에 적용
      $(this).parents('.dropdown_wrap').find('.dropdown_btn').val(selectText);
      $(this).parents('.dropdown_wrap').removeClass('is-active');
      $(this).parents('.popup_dropdown').removeClass('is-active');
    })
})
$(function(){
  // 배워봐요 영문
  if(!$('.learnEn').length){
    return ;
  }

  $('body')
    .on('click', '.page_link', function(e){
      e.preventDefault();

      var $this = $(this);
      var breadcrumb = $('.breadcrumb_item').last();

      if($this.hasClass('is-active')){
        return ;
      }

      // tab list
      $('.page_link').removeClass('is-active').removeAttr('title');;
      $this.addClass('is-active').attr('title', '선택됨');
      breadcrumb.text($this.text());
      if (isMobile()) {
        $('.page_list').removeClass('is-open');
        $('.page_list_label').text($this.text());
      }
      
      // tab content
      $('.learn_cont').removeClass('is-active');
      $('.learn_cont[data-tab-cont="' + $this.attr('data-tab') + '"]').addClass('is-active');
    })
})

/* ========================
* page: story
* ======================== */
$(function(){
  if(!$('.page_list').length){
    return ;
  }

  $('body')
    //소장품 필터 라벨 클릭시(MO)
    .on('click', '.page_list_label', function(e){
      e.preventDefault();

      var $this = $(this),
      $list = $this.parents('.page_list');

      if( !$list.hasClass('is-open') ){
        $list.addClass('is-open');
      }

    })
    //소장품 필터 리스트 닫기 클릭시
    .on('click', '.page_list_close', function(e){
      e.preventDefault();

      var $this = $(this),
      $list = $this.parents('.page_list');

      $list.removeClass('is-open');

    });

  var filter = $('.page_list');
  var pos = filter.position();                    
  $(window).scroll(function() {
    var windowpos = $(window).scrollTop();

    if (windowpos >= pos.top) {
      if(windowpos > 0 && windowpos > prevPos) { // 스크롤 시 fix 해제
        filter
        .addClass('stick-hide')
        .removeClass("stick");
      }else { // 백스크롤 시 fix
        filter
        .removeClass('stick-hide')
        .addClass("stick");
      }
      
      //스와이퍼 활성/비활성화
      if( !isMobile() ){
        storySlide !== undefined ? storySlide.update() : storySwiper();
      }else {
        if( storySlide != undefined ){
          storySlide.destroy();
          storySlide = undefined;
        }
      }
      prevPos = windowpos;
    }else {
      filter.removeClass("stick");
      
      //스와이퍼 비활성화
      if( storySlide != undefined ){
        storySlide.destroy();
        storySlide = undefined;
      }
      prevPos = windowpos;
    }
  });
});


/* ========================
* page : introduce
* ======================== */
$(function(){
  if(!$('.introduce').length){
    return ;
  }

  $(window).on('scroll', function(e){
    //각 카드가 화면 중앙에 왔을 때 애니메이션 실행
    const introduceCards = gsap.utils.toArray('.introduce_item');
    introduceCards.forEach(function(card, index){
      gsap.to(card, {
        scrollTrigger:{
          trigger: card,
          start: "70% bottom",
          onEnter: () => {
            if( !reachArray[index] ){
              cardAnim[index].stop();
              cardAnim[index].play();
              reachArray[index] = true;
            }
          },
        },
      })
    })
  });

  //카드 gsap
  const moveCard = gsap.utils.toArray('.introduce_item');
  moveCard.forEach(card => {
    gsap.timeline({ 
      scrollTrigger:{
        trigger: card,
        start: "0% bottom",
        end: "35% bottom",
        scrub: 1,
      },
    })
    .to(card, {y: -150});
  })

  //카드 애니메이션
  var cardAnim = [];
  for (var i = 0; i < document.querySelectorAll('.introduce_img').length; i++) {
    cardAnim.push(applyAnimationData(document.querySelectorAll('.introduce_img')[i].querySelector('.introduce_anim'), '../assets/json/animation_'+(i+1)+'.json', 'svg', true, false))
  }

  $('body')
    // 카드 상세보기 버튼(MO)
    .on('click', '.introduce_button', function(e){
      var $this = $(this),
      $item = $this.parents('.introduce_item'),
      $card = $this.parents('.introduce_card');

      if( $card.hasClass('front') ){
        $item.addClass('is-rotate');
      }else {
        $item.removeClass('is-rotate');
      }
    });

  /**
   * lottie animation
   * @param {HTMLElement} container 애니메이션의 wrapper 역할을 할 HTMLElment
   * @param {String} path 애니메이션 json 파일 경로
   * @param {String} renderer renderer || 'svg'
   * @param {Boolean} [loop] loop || false
   * @param {Boolean} [autoplay] autoplay || false
   * @returns 
   */
  function applyAnimationData(container, path, renderer, loop, autoplay){

    return bodymovin.loadAnimation({
      container: container, // Required(type : HTMLElement)
      path: path || '', // Required
      renderer: renderer || 'svg', // Required
      loop: loop || false, // Optional
      autoplay: autoplay || false, // Optional
    });
  }

});
