$(document).ready(function() {
  $(".left-sb").sidebar();
  $(".toggleLeftSb").on('click', function() {
    $(".left-sb").trigger("sidebar:toggle");
	});

  $(".right-sb").sidebar({side: "right"});
  $(".toggleRightSb").on('click', function() {
    $(".right-sb").trigger("sidebar:toggle");
	});
});
