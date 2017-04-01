;(function(global){

var originWidth=window.ORIGIN_WIDTH||1680,
    minWidth=window.MIN_WIDTH||800,
    maxWidth=window.MAX_WIDTH||1680;
onresize=onload=function(){
  function GetRoot(){return document.documentElement||document.body.parentElement;}
  function WinWidth(){return window.innerWidth||GetRoot().clientWidth;}
  var ratio=WinWidth()/originWidth;
  if(WinWidth()<=minWidth)GetRoot().style.fontSize=minWidth/originWidth*100+"px";
  else if(WinWidth()<=maxWidth)GetRoot().style.fontSize=ratio*100+"px";
  else GetRoot().style.fontSize=maxWidth/originWidth*100+"px";
  GetRoot().style.opacity=1;
  if(window.LoadDeferred)LoadDeferred.resolve();
};
onscroll=function(){
  if((window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)==0){
    document.getElementsByTagName("header")[0].style.backgroundColor="rgba(255,255,255,0.7)";
  }else{
    document.getElementsByTagName("header")[0].style.backgroundColor="rgba(255,255,255,1)";
  }
};

})(window);
