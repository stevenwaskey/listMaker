<?php

/* Data key/value pairs will be used as element attributes to the individual list items. */
$data = array(
				array("value"=>"A","name"=>"letters","title"=>"A."),
				array("value"=>"B","name"=>"letters","title"=>"B."),
				array("value"=>"C","name"=>"letters","title"=>"C."),
				array("value"=>"D","name"=>"letters","title"=>"D."),
				array("value"=>"E","name"=>"letters","title"=>"E."),
				array("value"=>"F","name"=>"letters","title"=>"F.")
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
  	<table width='100%'>
	  	<tr>
		  	<td><div id='listMaker1'></div></td>
		  	<td><div id='listMaker2'></div></td>
	  	</tr>
  	</table>
  	<script type='text/javascript' src="jquery-1.11.1.js"></script>
  	<script type='text/javascript' src="listMaker.jquery.js"></script>
  	<script type='text/javascript'>

  	var options = {

	/* Initialize listMaker with data */
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

	$(document).ready(function(){

		console.log( options );
		$('#listMaker1').listMaker( options );
		$('#listMaker2').listMaker( options );

	});

  	</script>
  </body>
</html>
