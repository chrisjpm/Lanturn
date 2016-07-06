$(document).ready(function() {
  $(".toggleLeftSb").on('click', function() {
    $(".leftSB").sidebar().trigger("sidebar:toggle");
	});
});
