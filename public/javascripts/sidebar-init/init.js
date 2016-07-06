$(document).ready(function() {
  $(".leftSB").sidebar();
  $(".toggleLeftSb").on('click', function() {
    $(".leftSB").trigger("sidebar:toggle");
	});
});
