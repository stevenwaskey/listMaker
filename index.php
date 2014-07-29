<?php

if( file_exists( 'data.php' ) ) require_once( 'data.php' );

/* Data key/value pairs will be used as element attributes to the individual list items. */
if( !file_exists( 'data.php' ) )
	$data = array(
					array("value"=>"A","title"=>"A."),
					array("value"=>"B","title"=>"B."),
					array("value"=>"C","title"=>"C."),
					array("value"=>"D","title"=>"D."),
					array("value"=>"E","title"=>"E."),
					array("value"=>"F","title"=>"F.")
	);

?>
<html>
  <head>
    <title>Sample jQuery Plugin</title>
    <link href="listMaker.css" media="all" rel="stylesheet" />
  </head>
  <body bgcolor=white>
  	<div class='title_bar'><span>List Maker Plugin</span></div>
  	<input name='data' value='<?php echo json_encode( $data ); ?>' type='hidden'>
  	<div id='listmaker'></div>
  	<script type='text/javascript' src="jquery-1.11.1.js"></script>
  	<script type='text/javascript' src="listMaker.jquery.js"></script>
  	<script type='text/javascript'>

  	var options = {

	'avail_items'	:		$.parseJSON( $("input[name='data']").val() ),
	'select_items'	:		{},

	/* Middle Display */
	'middle'		:		"<center>Adding &<br>Removing Items</center>"
					+		"<hr style='border:none;border-bottom:thin solid #999;margin-top:10px;margin-bottom:10px;'>"
					+		"<p style='margin-bottom:15px;padding:3px;'>1. Select Item</p>"
					+		"<p style='margin-bottom:15px;padding:3px;'>2. Click Arrow to<br>Add or Remove</p>"
					+		"<p style='margin-bottom:15px;padding:3px;'>3. Repeat as Needed</p>",

	/* Labels */
	'avail_title'	:		"Available",
	'select_title'	:		"Selected",
	'item_substr'	:		100,									// Set to 0 to turn off.

	/* Config */
	'multiple'		:		true,									// true = checkbox, false = radio
	'match_height'	:		true									// when true, all li items will share the height of the tallest item.

	}

	$('#listmaker').listMaker( options );

	$(document).ready(function(){

		$lm = $('#listmaker');
		$lm.addData();

	});

  	</script>
  </body>
</html>
