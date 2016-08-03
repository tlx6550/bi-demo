  $(document).ready(function(){
    // 闭包一
      (function($,window,document,undefined){
     // 超过指定数值 改变字体颜色
    function colorChange(value,ele){
      //在需要改变颜色的元素添加id值，并获取
        var elet = "#"+ele;
        var elevalue = $(elet).html();
        var newstr=elevalue.replace(/%/, "");
        return newstr>value?true:false;
    }

    function initColorChange(){
      //添加需要判断改颜色的元素
      if (colorChange(2000,'current-status-dtjg')) {
        $("#current-status-dtjg").css({
              // 改为红色
              color:'red'
        })
      } ;
      if(colorChange(140,'target-relative')){
         $("#target-relative").css({
              // 改为绿色
              color:'green'
        })
      }
   }

    initColorChange();
    $(".bi-view-open").click(function(e){
      e.stopPropagation();
      var that = $(this);
      if(that.hasClass("bi-open-change")){
        that.removeClass("bi-open-change");
      } else {
        that.addClass("bi-open-change");
      }
      $(".current-status-detail").fadeToggle(400,"swing");
    });

    function showUnusualDetail(){
      $(".unusual-status canvas").hover(function(){
        $(this).prev().toggle();
      })
    };
    showUnusualDetail();
  })(jQuery,window,document)//闭包一结束
  });

