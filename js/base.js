onresize=onload=function(){
  function GetRoot(){return document.documentElement||document.body.parentElement;}
  function WinWidth(){return window.innerWidth||GetRoot().clientWidth;}
  var ratio=WinWidth()/1680;
  if(WinWidth()<=800)GetRoot().style.fontSize=800/1680*100+"px";
  else if(WinWidth()<=1200)GetRoot().style.fontSize=ratio*100+"px";
  else GetRoot().style.fontSize=1200/1680*100+"px";
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
