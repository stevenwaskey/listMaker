<?php require_once( 'data.php' ); ?>
<html>
  <head>
    <title>Sample jQuery Plugin</title>
    <link href="listMaker.css" media="all" rel="stylesheet" />
  </head>
  <body bgcolor=white>
  	<span>List Maker Plugin</span>
  	<input name='data' value='<?php echo json_encode( $data ); ?>' type='hidden'>
  	<div class='dropadd'></div>

  	<div class='dummyAdd' style='display:none;'>

		<div style='float:left;'>

			<ul name='available' style='width:200px;height:200px;overflow-x:none;overflow-y:auto;border:thin solid #D3D3D3;list-style:none;padding:3px;background:#FFFFFF;'>

				<li data-id='title' class='txtCenter'>Available NPIs<div class='add_elem' style='float:right;margin-top:-3px;'>
					<!-- <img src='<?php echo WEB_URL; ?>imgs/bg.grnArrowRght.png'> -->
				</div></li>
									<?php
										if( FALSE ):

										$npis = "";
										$sql = "SELECT * FROM system_npi";
										$results = $db->query( $sql );
										$count	=	isset( $count ) ? $count : 0 ;
										$count++; // start count @ 1;
										while( $data = $db->fetch_array( $results ) ){

											/* Use data-id for the npi_id in the DB */
											$npis .= "<li data-id='" . $data['npi_id']

											/* Use data-active to discern if the item is currently selected */
											. "' data-active='0' "

											/* Use position to remember where items where in their respective lists */
											. " data-position='" . ($count++) . "'"

											/* Store Performance Indicator */
											. " data-npi='" . $data['npi'] . "'"

											/* 	Put the full NPI into a tool tip.
											*	This can then be an access for additional 
											*	info w/ toltip AS WELL AS will be used to 
											*	verify the entry through the next state 	*/
											. " title='" . $data['npi'] . ": " . htmlspecialchars( $data['title'] ) . "' "

											/* 	LI Classes & Styling */
											. " class='txtLeft txt10px' style='padding:1px;margin:0px;'>"

											/* LI Item Label & tag close */
											. $data['npi'] . ": " . substr(htmlspecialchars( $data['title'] ),0,50) . "..." . "</li>";

										}
										echo $npis;

										/* Unset $count variable, if only for namespace sake */
										unset($count);

										endif;
									?>
								</ul>
								</div>
								<div style='float:left;margin:20px;color:#999;' class='txtLeft'><center>Adding &<br>Removing NPIs</center><hr style='border:none;border-bottom:thin solid #999;margin-top:10px;margin-bottom:10px;'><p style='margin-bottom:15px;'>1. Select NPI</p><p style='margin-bottom:15px;'>2. Click Arrow to<br>&nbsp;&nbsp;&nbsp;&nbsp;Add or Remove</p><p style='margin-bottom:15px;'>3. Repeat if Needed</p></div>
								<div style='float:left;'>
								<ul name='selected' style='width:200px;height:200px;overflow-x:none;overflow-y:auto;border:thin solid #D3D3D3;list-style:none;padding:3px;background:#FFFFFF;'>
									<li data-id='title' class='txtCenter'>Selected NPIs<div class='remove_elem' style='float:left;margin-top:-3px;'>
										<!-- <img src='<?php echo WEB_URL; ?>imgs/bg.redArrowLft.png'> -->
									</div></li>
								</ul>
								</div>
  	
  	</div>

  	<script type='text/javascript' src="jquery-1.11.1.js"></script>
  	<script type='text/javascript' src="listMaker.jquery.js"></script>
  	<script type='text/javascript'>

  	var options = {

	/* Data */
	/* Supply array of objects. ( [{},{},{}] ) */
	/* Object parameters & values will be used as data attributes to the individual list items. */
	'avail_items'	:		$.parseJSON( $("input[name='data']").val() ),
	'select_items'	:		{},

	/* Middle Display */
	'middle'		:		"<center>Adding &<br>Removing Items</center><hr style='border:none;border-bottom:thin solid #999;margin-top:10px;margin-bottom:10px;'><p style='margin-bottom:15px;'>1. Select NPI</p><p style='margin-bottom:15px;'>2. Click Arrow to<br>&nbsp;&nbsp;&nbsp;&nbsp;Add or Remove</p><p style='margin-bottom:15px;'>3. Repeat if Needed</p>",

	/* Labels */
	'avail_title'	:		"Available",
	'select_title'	:		"Selected",
	'item_substr'	:		100,
	'title_substr'	:		10000,

	/* Config */
	'root_url' 		: 		"http://localhost/plugins",				// http://www.example.com
	'img_fldr'		:		"images",								// images -> http://www.example.com/images, Location of arrow images
	'match_height'	:		false									// when true, all li items will share the height of the tallest item.

	}
	$('div.dropadd').listMaker( options );


  	</script>
  </body>
</html>