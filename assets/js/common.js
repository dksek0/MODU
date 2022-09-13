if($ === undefined && jQuery){
  $ = jQuery;
}


// * gloabal variables
var $comp = {
  body: $('body'),
  header: $('.header'),
  searchbar: $('.searchbar'),
  footer: $('.footer')
}
var g_prevPos = 0;
var loadingAnim;

// // * gloabal functions

/**
 * sns 공유 팝업에서 링크 복사 버튼 클릭 시 토스트 팝업 활성화
 * @param {jQuery} $elem : 토스트 팝업 활성화 버튼
 */
function showToastPopup($elem){
  var $popup = $elem.closest('.popup').find('.popup_share_toast');
  $popup.stop(true).fadeIn(1500).fadeOut(500);
}

/**
 * 팝업 열기
 * @param {jQuery} $popup : 팝업 (.popup)
 * @param {String} id : 팝업 아이디 (팝업 트리거 요소의 data-target-id 값)
 */
function openPopup($popup, id){
  if($popup.hasClass('popup_dim')){
    setDim(true);
  }

  $popup
    .addClass('is-active')
    .attr('data-popup-id', id || '')
    .find('a, button, input').first().focus();
}

/**
 * 팝업 닫기
 * @param {jQuery} $popup : 팝업 (.popup)
 */
function closePopup($popup){
  var popupId = $popup.attr('data-popup-id');

  $popup
    .find('input').val('').end()
    .find('.is-error').removeClass('is-error');
  
  $popup.removeClass('is-active');
  if(popupId){
    $popup.attr('data-popup-id', '');
    $('[data-target-id="' + popupId + '"]').focus();
  }
  setDim(false);
}

/**
 * dim 처리
 * @param {Boolean} isDim 
 */
function setDim(isDim){
  if(isDim == 'undefined' || isDim === ''){
    return ;
  }
  isDim ? $comp.body.addClass('is-dim') : $comp.body.removeClass('is-dim');
}

/**
 * 모바일 해상도 체크: 모바일 해상도에서 .mobile 클래스 추가
 */
function checkViewportWidth(){
  window.innerWidth < 1024 ? $comp.body.addClass('mobile') : $comp.body.removeClass('mobile');
}

/**
 * 모바일 해상도 체크: 모바일 해상도이면 true 리턴
 */
function isMobile(){
  return $('.mobile').length ? true : false;
}

/**
 * 로딩
 * @param {Boolean} loadState 로딩 상태
 */
 function loading(loadState){
   if(typeof loadingAnim == 'undefined'){
     loadingAnim = applyAnimationData(document.getElementsByClassName('loading_anim')[0], '/assets/json/loading.json', 'svg', true, false);
   }

  loadState = (typeof loadState == 'undefined') ? true : loadState;
  
  if(loadState){
    $('#loading').addClass('is-active');
    loadingAnim.play();
  }
  else {
    $('#loading').removeClass('is-active');
    loadingAnim.stop();
  }
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

/* ========================
* Common
* ======================== */
$(function(){
  // * init
  (function () {

    // 모바일 해상도 체크
    checkViewportWidth();
    $(window).on('resize', checkViewportWidth);

    // 메인페이지에서만 배너 노출
    if(!$('.main').length && $('.main_banner').length){
      $('.main_banner').remove();
    }

    // 체크박스, 라디오 탭으로 이동 시 포커스
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 9) {
        $('body').addClass('show-focus-outlines');
      }
    });
    document.addEventListener('mousedown', function(e) {
      $('body').removeClass('show-focus-outlines');
    });
    
    // label 태그 키 입력 제어
    $('label')
      .prop('tabindex', 0)
      .on('keydown', function(e){
        if(e.keyCode === 13){
          $(this).trigger('click');
        }
      });
    // input 태그 키 입력 제어
    $('.radio input').prop('tabindex', -1);
    $('.checkbox input').prop('tabindex', -1);
  })();


  // * global event handlers
  $('body')
    //필터 라벨 클릭시
    .on('click', '.filter_label', function(e){
      e.preventDefault();

      var $this = $(this);
      var $filterItem = $this.parents('.filter_item');
      var $blindText = $this.find('.is-blind');

      if( $filterItem.hasClass('has-datepicker') ){
        return;
      }

      if( $filterItem.hasClass('is-open') ){
        $filterItem.removeClass('is-open');
        $blindText.text('하위 내용 열기');
        isMobile() && $comp.body.removeClass('is-fixed');
      }else {
        $('.filter_item').removeClass('is-open');
        $filterItem.addClass('is-open');
        $blindText.text('하위 내용 닫기');
        isMobile() && $comp.body.addClass('is-fixed');
      }
    })   
    //필터 단일옵션 선택시
    .on('click', '.filter_option_link', function(e){
      e.preventDefault();

      var $this = $(this);
      var $filterItem = $this.parents('.filter_item');

      $filterItem.removeClass('is-open');
    })
    // 필터 영역 외 클릭 시 필터옵션 닫기
    .on('click', function(e){
      var $target = $(e.target);
      if($target.hasClass('filter_option_dim') || $target.parents('.filter_option_dim').length){
        $('.filter_item').removeClass('is-open');
        isMobile() && $comp.body.removeClass('is-fixed');
        $('.filter').css({'z-index': 101});
        return ;
      }

      if($target.hasClass('filter_label') || $target.hasClass('filter_label_text') || $target.parents('.filter_option').length){
        return ;
      }
      if(!$target.parents('.filter_option').length){
        $('.filter_item').removeClass('is-open');
      }
    })
    //필터 적용 버튼 클릭시
    .on('click', '.filter_option_bottom .btn', function(e){
      e.preventDefault();

      var $this = $(this),
      $filterItem = $this.parents('.filter_item'),
      $blindText = $filterItem.find('.filter_label .is-blind');

      $filterItem.removeClass('is-open');
      $blindText.text('하위 내용 열기');
    })
    //필터 리셋 버튼 클릭시
    .on('click', '.filter_option_reset', function(e){
      e.preventDefault();

      var $this = $(this),
      $filterItem = $this.parents('.filter_item'),
      $activeOption = $filterItem.find('input[name="checkbox"]');

      $activeOption.prop("checked", false);
    })
    //필터 닫기 버튼 클릭시
    .on('click', '.filter_option_close', function(e){
      e.preventDefault();

      var $this = $(this),
      $filterItem = $this.parents('.filter_item');
      $blindText = $filterItem.find('.filter_label .is-blind'),

      $filterItem.removeClass('is-open');
      $blindText.text('하위 내용 열기');
      isMobile() && $comp.body.removeClass('is-fixed');
      $('.filter').css({'z-index': 101});
    })
    //필터 category 선택시
    .on('click', '.sort_category_item', function(e){
      e.preventDefault();
      
      if($('.search_wrap').length){
        return ;
      }

      var $this = $(this);
      var $sortrBox = $(this).parents('.sort_category');
      var $sortrUnit = $this.parents('.sort_category_unit');
      var $sortItem = $sortrUnit.find('.sort_category_item');

      if( $sortrBox.hasClass('is-small') ){
        return;
      }

      if( $('.list_page').length>0 ){ //배워봐요 페이지만
        if( !$this.hasClass('is-active') ){
          $sortItem.removeClass('is-active').removeAttr('title');
          $this.addClass('is-active').attr('title', '선택됨');
        }else {
          $this.removeClass('is-active').removeAttr('title');
        }
      }else { //이외 페이지
        $sortItem.removeClass('is-active').removeAttr('title');
        $this.addClass('is-active').attr('title', '선택됨');
      }
      
    })
    //필터 category 선택시 - 전체 선택 버전
    .on('change', '.sort_category.is-small .sort_category_checkbox input:checkbox', function(e){
      e.preventDefault();

      var $this = $(this);
      var $unit = $this.parents('.sort_category_unit');
      var $item = $this.parents('.sort_category_checkbox');
      var checked = $this.is(':checked');
		
      if( $item.hasClass('is-all') ) { //전체 선택시
        if( checked ){
          $('.sort_category_checkbox input:checkbox').prop('checked',true);
        }else {
          $('.sort_category_checkbox input:checkbox').prop('checked',false);
        }
      }else {
        var totalLength = $unit.find('.sort_category_checkbox input:checkbox').length - 1;
        var notAllItem = $unit.find('.sort_category_checkbox').not('.is-all');
        var selectedLength = notAllItem.find('input:checkbox:checked').length;

        // 모든 태그가 활성화 되었을 경우 전체 태그 활성화
        if(totalLength == selectedLength){
          $unit.find('.is-all input:checkbox').prop('checked',true);
        }else {
          $unit.find('.is-all input:checkbox').prop('checked',false);
        }
      }
    })
    //필터 sort 선택시
    .on('click', '.sort_order_item', function(e){
      e.preventDefault();

      var $this = $(this);

      $('.sort_order_item').removeClass('is-active').removeAttr('title');
      $this.addClass('is-active').attr('title', '선택됨');
    })
    // click
    .on('click', function(e){
      var $this = $(e.target);

      // search bar 인풋 외 영역 클릭했을 경우 비활성화
      if(!$this.closest('.searchbar_search').length){
        $comp.searchbar.removeClass('is-active');
      }

      // search bar helper 영역 외 클릭했을 경우 비활성화
      if($this.closest('.searchbar_helper').length && !$this.closest('.searchbar_helper_inner').length){
        $comp.header
          .removeClass('is-search')
          .find('.searchbar_ip').val('');
        $comp.body.removeClass('is-fixed');
      }

      // header 나의 교육 버튼 외 클릭했을 경우 비활성화
      if(!$this.closest('.header_util_item').length){
        $('.header_util_item').removeClass('is-active');
      }

      // dim 영역 클릭 시 팝업 닫기
      if($this.hasClass('is-dim') && !$this.closest('.popup.is-active').length){
        var $popup = $('.popup.is-active');
        if($popup.length){
          closePopup($popup);
        }
      }

      // dim 영역 클릭 시 메인 배너 닫기(모바일)
      if(isMobile()) {
        if($this.closest('.main_banner').length && !$this.closest('.banner_link.mo').length){
          $('.main_banner').remove();
          $comp.body.removeClass('with-banner is-fixed');
        }
      }

    })
    .on('focus', function(e){
      var $this = $(e.target);

      // search bar 인풋 외 영역에 포커스할 경우 비활성화
      if(!$this.closest('.searchbar_search').length){
        $comp.searchbar.removeClass('is-active');
      }
    })
    // search bar 검색어 입력
    .on('input', '.searchbar_ip', function(e){
      var $target = $(e.target);
      var $searchbar = $target.closest('.searchbar');

      $searchbar.addClass('is-active');

      // 서치 바 취소 버튼 m-hide 클래스 추가/삭제
      if($target.val() !== ''){
        $searchbar.find('.searchbar_func_btn').removeClass('is-hide');
        $searchbar.find('.searchbar_cancel_btn').addClass('m-hide');
      }
      else {
        $searchbar.find('.searchbar_func_btn').addClass('is-hide');
        $searchbar.find('.searchbar_cancel_btn').removeClass('m-hide');
      }
    })
    // search bar 인풋 포커스
    .on('focus', '.searchbar_ip', function(e){
      var $target = $(e.target);
      var $searchbar = $target.closest('.searchbar');

      $searchbar.addClass('is-active');

      // 서치 바 취소 버튼 m-hide 클래스 추가/삭제
      if($target.val() !== ''){
        $searchbar.find('.searchbar_func_btn').removeClass('is-hide');
        $searchbar.find('.searchbar_cancel_btn').addClass('m-hide');
      }
      else {
        $searchbar.find('.searchbar_func_btn').addClass('is-hide');
        $searchbar.find('.searchbar_cancel_btn').removeClass('m-hide');
      }
    })
    // search bar 필터 선택 버튼 엔터 키 입력으로 조작
    .on('keyup', '.search_filter_label', function(e){
      $targetIp = $(e.target).siblings('.search_filter_ip');
      if(e.keyCode == 13){
        $targetIp.prop('checked', true)
      }
    })
    // 헤더 search bar 활성화
    .on('click', '.header_search_btn', function(e){
      e.preventDefault();
      $comp.header
        .addClass('is-search')
        .find('.searchbar_ip').focus();
      $comp.body.addClass('is-fixed');
    })
    // 헤더 search bar 비활성화
    .on('click', '.searchbar_cancel_btn', function(e){
      e.preventDefault();
      $comp.header
        .removeClass('is-search')
        .find('.searchbar_ip').val('').end()
        .find('.header_search_btn').focus();
      $comp.body.removeClass('is-fixed');
    })
    // 헤더 search bar 검색 인풋에서 아래 화살표 키로 관련 검색어 목록 초점 이동
    .on('keydown', '.header_search .searchbar_ip', function(e){
      var $searchbar = $(this).closest('.searchbar_search');

      // 아래 방향키 입력
      if(e.keyCode == 40){
        $searchbar.find('a').eq(0).focus();
        return false;
      }

      // tab 키 입력 시 취소 버튼으로 초점 이동
      if(e.keyCode == 9 && !e.shiftKey){
        $searchbar.find('.searchbar_btn').focus();
        return false;
      }
    })
    // 헤더 search bar 취소 버튼에서 back tab 키 입력 시 검색 인풋으로 초점 이동
    .on('keydown', '.header_search .searchbar_cancel_btn', function(e){
      if(e.keyCode === 9){
        if(e.shiftKey){

          $(this).closest('.header_search').find('.searchbar_ip').focus();
          return false;
        }
      }
    })
    // 헤더 search bar 검색 관련 검색어 목록에서 방향키로 아이템들 초점 이동
    .on('keydown', '.searchbar_helper a', function(e){
      var $this = $(this);
      var $searchHelperList = $('.searchbar_helper a');
      var currentIndex = $this.index('.searchbar_helper a');
      var $beforeTarget, $nextTarget;

      // 이전 아이템 타겟(최상단 아이템일 경우 타겟은 검색 인풋)
      if(currentIndex == 0){
        $beforeTarget = $('.searchbar_ip');
      }
      else {
        $beforeTarget = $searchHelperList.eq(currentIndex - 1);
      }

      // 다음 아이템 타겟(최하단 아이템일 경우 타겟은 첫번째 아이템)
      if(currentIndex == $searchHelperList.length - 1){
        $nextTarget = $searchHelperList.first();
      }
      else {
        $nextTarget = $searchHelperList.eq(currentIndex + 1);
      }

      // 아래 방향키 입력
      if(e.keyCode == 40){
        $nextTarget.focus();
        return false;
      }
      // 위 방향키 입력
      else if(e.keyCode == 38){
        $beforeTarget.focus();
        return false;
      }
    })
    // 헤더 search helper 최근 검색어 전체 삭제
    .on('click', '.searchbar_helper_delete_all', function(e){
      e.preventDefault();

      $(this).closest('.searchbar_helper_section').remove();
    })
    // 헤더 search helper 최근 검색어 개별 삭제
    .on('click', '.searchbar_helper_delete', function(e){
      e.preventDefault();

      var $this = $(this);
      var $searchHelperItem = $this.closest('.searchbar_helper_item');
      
      // 마지막 최근 검색어 삭제 시 최근 검색어 영역 삭제
      if($searchHelperItem.siblings().length == 0){
        $this.closest('.searchbar_helper_section').remove();
      }
      // 해당 검색어 삭제
      else {
        $searchHelperItem.remove();
      }
    })
    // 헤더 searchbar 포커스아웃되면 search helper 닫기
    .on('keydown', '.header_search .searchbar_btn_group .searchbar_btn:not(.is-hide):last', function(e){
      if(e.keyCode == 9 && !e.shiftKey){
        $('.header')
          .removeClass('is-search')
          .find('.searchbar_ip').val('');
      }
    })
    .on('click', '.header_util_item button', function(e){
      e.preventDefault();

      var $index = $(this).parent().index();

      $('.header_util_item').each(function(idx, item){
        var $item = $(item);
        if(idx == $index ){
          $item.hasClass('is-active') ? $item.removeClass('is-active') : $item.addClass('is-active');
        }
        else {
          $item.removeClass('is-active');
        }
      })
    })
    // 모바일 gnb 활성화
    .on('click', '.header_m_gnb_btn', function(e){
      e.preventDefault();

      var $this = $(this);
      if($this.hasClass('is-active')){
        $this.removeClass('is-active');
        $('.m_gnb').removeClass('is-active');
        $comp.body.removeClass('is-fixed');
      }
      else {
        $this.addClass('is-active');
        $('.m_gnb').addClass('is-active');
        $comp.body.addClass('is-fixed');
      }
    })
    // 모바일 gnb 비활성화
    .on('click', '.m_gnb_close_btn', function(e){
      e.preventDefault();

      $('.header_m_gnb_btn').removeClass('is-active');
      $('.m_gnb').removeClass('is-active');
      $comp.body.removeClass('is-fixed');
    })
    .on('click', '.footer_site_btn', function(e){
      e.preventDefault();

      var $footerSiteList = $(this).closest('.footer_site_group');

      if($footerSiteList.hasClass('is-active')){
        $('.footer_site_group').removeClass('is-active');
      }
      else {
        $('.footer_site_group').removeClass('is-active');
        $footerSiteList.addClass('is-active');
      }
    })
    // sns share popup 링크 복사 클릭 시 토스트 팝업 활성화, 링크 복사
    .on('click', '.popup_share_copy', function(e){
      e.preventDefault();

      var $this = $(this);
      // 링크 복사
      var val = $(this).find('.popup_share_link').text();
      navigator.clipboard.writeText(val).then(function(){
        // 토스트 팝업 활성화
        showToastPopup($this);
      });
    })
    // 팝업 열기
    .on('click', '[data-popup-target]', function(e){
      e.preventDefault();
      
      var $this = $(this);
      var $popupId = $this.attr('data-target-id');
      var $popup = $('[data-popup-name="' + $this.attr('data-popup-target') + '"]');

      openPopup($popup, $popupId);

      // sns 공유 팝업은 모바일에서만 dim 처리
      if($popup.hasClass('popup_share') && isMobile()){
        setDim(true);
      }

      // 파일보기 팝업은 모바일에서만 dim 처리
      if($popup.hasClass('popup_file') && isMobile()){
        setDim(true);
      }
    })
    // 팝업 닫기
    .on('click', '.popup_close', function(e){
      e.preventDefault();
      closePopup($(this).closest('.popup'));

    })
    // 탑버튼 클릭시
    .on('click', '.top_button_link', function(e){
      gsap.to(window, 1, {ease: 'circ.inOut', scrollTo: 0});
      
      return false;
    })
    // 퀴즈 토글 버튼
    .on('click', 'button.toggle_item', function(e){
      e.preventDefault();

      var $this = $(e.target);
      
      if($this.hasClass('is-disabled')){
        return ;
      }

      if($this.closest('.together_opinion_state').length){
        return ;
      }

      if ($this.closest('.toggle_list').length > 0) {
        if ($this.hasClass('is-active')) {
          $this.closest('.toggle_list .toggle_item').removeClass('is-active');
        } else {
          $this.closest('.toggle_list').find('.toggle_item').removeClass('is-active');
          $this.addClass('is-active');
        }
      } else {
        this.classList.toggle('is-active');
      }
    })
    // 카드 컴포넌트 호버 시 썸네일 이미지 크기 확대
    .on('mouseover', '.card', function(e){
      e.stopPropagation();
      $(this).addClass('is-hover');
    })
    // 카드 컴포넌트 썸네일 이미지 크기 원복
    .on('mouseleave', '.card', function(e){
      e.stopPropagation();
      $(this).removeClass('is-hover');
    })
    // 메인 배너 닫기
    .on('click', '.banner_close', function(e){
      e.preventDefault();
      $(this).closest('.main_banner').remove();
      $comp.body.removeClass('is-fixed with-banner');
    });
  ;
  
  // resize event handlers
  $(window).on('resize', function(){
    if($('.popup_share.is-active').length){
      isMobile() ? setDim(true) : setDim(false);
    }
    if($('.popup_file.is-active').length){
      isMobile() ? setDim(true) : setDim(false);
    }
    // 모바일 gnb가 활성화 상태일 때 body 영역 스크롤 고정 여부 반응형 적용
    if($('.m_gnb').hasClass('is-active')){
      isMobile() ? $comp.body.addClass('is-fixed') : $comp.body.removeClass('is-fixed');
    }

    if($('.filter_item').length && $('.filter_item').hasClass('is-open')){
      isMobile() ? $comp.body.addClass('is-fixed') : $comp.body.removeClass('is-fixed');
    }
  })

  // scroll event handlers
  $(window).on('scroll', function(e){
    if($('.header').hasClass('is-search')){
      return ;
    }

    var currentPos = $(window).scrollTop();
    var $banner = $('.main_banner');
    
    // top banner 있을 경우
    if ($banner.length) {
      var bannerH = $banner.innerHeight();
      // top banner 있을 경우 fix
      if(currentPos <= bannerH + 88){
        $comp.body.css({'padding-top': 0});
        $comp.header.removeClass("fix-hide is-fixed")
        $banner.show();
      }
      // 스크롤 시 fix 해제
      else if(currentPos > bannerH + 88 && currentPos > g_prevPos) {
        $comp.body.css({'padding-top': bannerH + 88 + 'px'});
        $banner.hide();
        $comp.header
          .addClass("fix-hide")
          .removeClass("is-fixed");
      }
      // 백스크롤 시 fix
      else {
        $banner.hide();
        $comp.header.addClass("is-fixed fix-hide");
      }
    } 
    else {
      // 백스크롤 시 헤더 최상단에 고정
  
      // 스크롤 위치가 최상단일 경우 fix 해제
      if(currentPos == 0){
        $comp.header
          .removeClass("fix-hide")
          .removeClass("is-fixed");
      }
      // 스크롤 시 fix 해제
      else if(currentPos > 0 && currentPos > g_prevPos) {
        $comp.header
          .addClass("fix-hide")
          .removeClass("is-fixed");
      }
      // 백스크롤 시 fix
      else {
        $comp.header.addClass("is-fixed");
      }

    }

    g_prevPos = currentPos;
  });


  // popup event handlers
  $('.popup')
    // 팝업 내 키보드 포커스 이동 제어
    .on('keydown', 'a, button, input' , function(e){
      var $this = $(e.target);
      
      // 드롭다운 팝업 제외
      if($this.closest('.popup_dropdown').length){
        return ;
      }

      if(e.keyCode === 9){
        var $focusItems = $this.closest('.popup').find('a, button, input');
        var idx = $focusItems.index($this);

        // 포커스 받는 제일 첫 번째 요소에서 back tab 입력 시 현재 요소에 포커스 유지
        if(e.shiftKey && idx === 0){
          return false;
        }
        // 포커스 받는 제일 마지막 요소에서 tab 입력 시 현재 요소에 포커스 유지
        else if(!e.shiftKey && idx === $focusItems.length - 1){
          return false;
        }
      }
    });

})


/* ========================
* Datepicker
* ======================== */
$(function() {
  if(!$('input[name="daterange"]').length){
    return ;
  }

  $(window).on('resize', function(){
    if( isMobile() ){
      $('.cancelBtn').text("");
      if($('.daterangepicker:visible').length){
        setDim(true);
        $('.filter.stick').css({'z-index': 1});
      }
    }else {
      $('.cancelBtn').text("취소");
      if($('.daterangepicker:visible').length){
        setDim(false);
      }
    }
  });

  if( isMobile() ){
    $('.filter_date').prop("readonly", "readonly"); 
  }
  
  if( !isMobile() ){
    $('input[name="daterange"]').daterangepicker({
      "autoApply": false,
      "autoUpdateInput": false,
      "locale": {
        "format": "YY.MM.DD",
        "separator": " ~ ",
        "applyLabel": "적용",
        "cancelLabel": "취소",
        "fromLabel": "From",
        "toLabel": "To", 
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"], 
        "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], },
    });
  }else {
    $('input[name="daterange"]').daterangepicker({
      "autoApply": false,
      "autoUpdateInput": false,
      "locale": {
        "format": "YY.MM.DD",
        "separator": " ~ ",
        "applyLabel": "적용하기",
        "cancelLabel": "",
        "fromLabel": "From",
        "toLabel": "To", 
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"], 
        "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"], },
    });
  }
  $('.drp-calendar.right').hide();
  $('.drp-calendar.left').addClass('single');

  $('.calendar-table').on('DOMSubtreeModified', function() {
    var el = $(".prev.available").parent().children().last();
    if (el.hasClass('next available')) {
      return;
    }
    el.addClass('next available');
    el.append('<span></span>');
  });

  $('input[name="daterange"]').on('apply.daterangepicker', function (ev, picker) {
    var $this = $(this);
    var $filterItem = $this.parents('.filter_item');
    
    $this.val(picker.startDate.format('YY.MM.DD') + ' ~ ' + picker.endDate.format('YY.MM.DD'));
    $filterItem.addClass('is-selected');

    //날짜적용 함수 추가(back 요청)
    applyBtn();
  })

  $('input[name="daterange"]').on('focusin', function(e){
    e.preventDefault();

    if( $(this).val() == "기간" ){
      $(this).val("");
    }

    if( isMobile() ){
      setDim(true);
      $('.filter.stick').css({'z-index': 1});
    }
  });

  $('input[name="daterange"]').on('focusout', function(e){
    e.preventDefault();

    var $this = $(this);
    var $filterItem = $this.parents('.filter_item');
    
    if( $(this).val() == "" ){
      $(this).val("기간");
      $filterItem.removeClass('is-selected');
    }else {
      $filterItem.addClass('is-selected');
    }
  });

  $('input[name="daterange"]').on('hide.daterangepicker', function(ev, picker) {
    setDim(false);
    $('.filter').css({'z-index': 101});
    $('.daterangepicker').css({'position': 'absolute'});
  });
});


/* ========================
* Swiper: sortSwiper
* ======================== */
$(function(){
  if(!$('.sortSwiper').length){
    return ;
  }

  var swiper = new Swiper(".sortSwiper", {
    observer: true,
    observeParents: true,
    watchOverflow: true,
    slidesPerView: 'auto',
    threshold: 10,
    freeMode: true
  });
  
  $(window).on({
    load: function(){
      $(this).trigger('resize');
    } 
  });

  $(window).on('resize', function(){
    if(typeof swiper !== 'undefined'){
      if(swiper.length > 1) {
        swiper.forEach(function(item){
          item.update();
        })
      }
      else {
        swiper.update();
      }
    }
  });

});

/* ========================
* top_button
* ======================== */
$(function() {
  var $topBtn = $('.top_button');

  if( $topBtn.length>0 ){
    calcScreenH();
    fixTopbtn();
    
    $(window).on('resize', function(){
      calcScreenH();
      fixTopbtn();
    });

    $(window).on('scroll', function(){
      fixTopbtn();
    });
  }
});

//컨테이너에 스크롤이 있는 경우만 탑버튼 노출
function calcScreenH(){
  var $topBtn = $('.top_button'),
  $containerH = $('#container').height(),
  $headerH = $('.header').outerHeight(),
  $footerH = $('.footer').outerHeight(),
  $screenH = $(window).height(),
  $minHeight = $screenH - $headerH; //컨테이너 영역 최소 높이
  
  if( $minHeight >= ($containerH - 1) ){
    $topBtn.addClass('is-hide');
  }else {
    $topBtn.removeClass('is-hide');
  }
}

//탑버튼 푸터 이전 픽스
function fixTopbtn(){
  var $topBtn = $('.top_button'),
  $footer = $('.footer'),
  $footerPos = $footer.position(),
  $windowpos = $(window).scrollTop(),
  $windowH = $(window).height(),
  $stdPos = $windowpos + $windowH,
  $containerH = $('#container').height();

  if( !$topBtn.hasClass('is-hide') ){ //탑버튼 노출시에만
    if( $windowpos >= 200 ){
      $topBtn.addClass('is-show');
    }
    else {
      $topBtn.removeClass('is-show');
    }

    if( $stdPos >= $footerPos.top ){
      $topBtn.addClass('is-fix');
      if( isMobile() ){
        $topBtn.css('top', $containerH - 10);
      }else {
        $topBtn.css('top', $containerH);
      }
    }else {
      $topBtn.removeClass('is-fix');
      $topBtn.css('top', 'auto');
    }
  }
}