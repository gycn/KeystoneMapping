$(document).ready(function() {
  setupMap();
  $("g").click(function (e) {
  		e.stopPropagation();
        if (document.getElementById("mySidenav").style.width == "250px"){
        	document.getElementById("mySidenav").style.width = "0";
        }
        else {
        	document.getElementById("mySidenav").style.width = "250px";
        }
    });
});