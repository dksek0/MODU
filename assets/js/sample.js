
/* ========================
* notice: list
* ======================== */
$(function(){
  if(!$('.noticeList').length){
    return ;
  }

  if($('.notice_pagination').length){
    $('.notice_pagination').twbsPagination({
      totalPages: 35,
      visiblePages: 5,
      onPageClick: function (event, page) {
      }
    });
  }
});