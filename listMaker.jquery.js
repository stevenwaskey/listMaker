/*
*	ListMaker jQuery Plugin
*	Does .create() method exist ?
*	If not, prototype	
*/
if ( typeof Object.create !== 'function' ) {
	Object.create = function( obj ) {
		function F() {};
		F.prototype = obj;
		return new F();
	};
}

/* Define ListMaker Plugin */
(function( $, window, document, undefined ) {

	var ListMaker = {

		init: function( options, elem ) {

			/* Set current object as self */
			var self 						= 		this;

			/* Set elem html */
			self.elem 						= 		elem;

			/* Set elem jquery object */
			self.$elem 						= 		$( elem );

			/* Add user supplied options */
			self.options 					= 		$.extend( {}, $.fn.listMaker.options, options );

			/* Build ListMaker */
			self.build();

			/* Store Options for Future Use */
			self.storeOptions();

		},

		update : function( elem,args ){

			/* Set current object as self */
			var self 						= 		this;

			/* Set elem html */
			self.elem 						= 		elem;

			/* Set elem jquery object */
			self.$elem 						= 		$( elem );

			/* Set list to update */
			self.active_list				=		arguments[1][1];

			/* Set data */
			self.upd_data					=		arguments[1][2];

			if( typeof self[arguments[1][0]] != 'function' )
				return 								null;

			return									self[arguments[1][0]]();

		},

		build: function(){	

			/* Create HTML List Containers */
			this.createTemplate();

			/* Populate Data */
			this.loadData();

			/* Bind Event Handlers */
			this.bindHandlers();

		},

		storeOptions : function(){

			var stored_options				=		jQuery.extend( true, {}, this.options );
			var delete_props				=		['template','avail_items','select_items','middle']; // <- take up additional space & are not neccessary. delete em' if you disagree :)

			for( var i in delete_props )
				if( stored_options.hasOwnProperty( delete_props[i] ) )
					delete 							stored_options[ delete_props[i] ];
 

			this.$elem.data( 'options',JSON.stringify( stored_options ) );

		},

		fetchOptions : function(){

			if( typeof this.$elem.data('options') == 'string' )
				return 								$.parseJSON( this.$elem.data('options') );

			return 									{};

		},

		/* Build HTML List Containers */
		createTemplate : function(){

			this.createShell();

			this.createHeader();

			this.createContainers();

		},

		createShell	 :	function(){

			/* Add listMaker class to main container & update height */
			this.$elem.addClass( "LM_container" );
			var height 						=		String( this.options.height ).match(/\d+/)[0];
			if( !isNaN( height ) )					this.$elem.css( 'height',height + 'px' );

			/* Left Div Elem [ Available Items ] */
			var $left						=		jQuery( "<div></div>" )
														.attr('name','available')
														.addClass('LM_listBox')
														.css({'width':this.options.template.left_width});
														this.$elem.append( $left );

			/* Middle Div Elem [ Notes / Instructions / Custom HTML ] */
			var $middle						=		jQuery( "<div></div>" )
														.html( this.options.middle )
														.addClass( 'LM_middle' );
														this.$elem.append( $middle );

			/* Right Div Elem [ Selected Items ] */
			var $right						=		jQuery( "<div></div>" )
														.attr('name','selected')
														.addClass('LM_listBox')
														.css({'width':this.options.template.right_width});
														this.$elem.append( $right );
		},

		createHeader : function(){

			/* Available List Items */
			var $left						=		jQuery( "<div></div>" )
														.addClass( 'LM_item_title LM_bg_white_to_gray' )
														.attr('name','title')
														.text( this.options.avail_title )
														.append( jQuery("<div></div>").addClass('LM_item_select') )
														.css( { 'padding-top':'6px','margin-top':'-3px' } );
														this.$elem.find('[name="available"]').append( $left );
			/* Selected List Items */
			var $right						=		jQuery( "<div></div>" ).addClass( 'LM_item_title LM_bg_white_to_gray' )
														.attr('name','title')
														.text( this.options.select_title )
														.append( jQuery("<div></div>").addClass('LM_item_deselect') )
														.css( { 'padding-top':'6px','margin-top':'-3px' } );
														this.$elem.find('[name="selected"]').append( $right );
		},

		createContainers : function(){

			var height						=		this.$elem.find("[name='available']").innerHeight() 
											- 		this.$elem.find("[name='available']").find("[name='title']").outerHeight();
													this.$elem.find("[name='available']")
														.append( jQuery( "<div></div>" )
																	.attr('name','list')
																	.height( height )
																	.css({'overflow-y':'auto','overflow-x':'hidden'})
																);

			var height						=		this.$elem.find("[name='selected']").innerHeight() 
											- 		this.$elem.find("[name='selected']").find("[name='title']").outerHeight();
													this.$elem.find("[name='selected']")
														.append( jQuery( "<div></div>" )
																	.attr('name','list')
																	.height( height )
																	.css({'overflow-y':'auto','overflow-x':'hidden'})
																);
		},

		loadData : function(){

			var self 						= 		this;

			/* Convert object literals into jQuery DOM objects */
			var position 					= 		1;
			this.options.avail_items		= 		$.map( this.options.avail_items,function( obj,i ){ 

				/* Add Item */
				self.add('available',obj,position );

				position++;

			});

			var position 					= 		1;
			this.options.select_items		= 		$.map( this.options.select_items,function( obj,i ){ 

				/* Add Item */
				self.add('selected',obj,position );

				position++;

			});

			if( self.options.match_height )
				self.matchHeight();
		},

		addData : function(){

			/* Make sure user supplied an object */
			if( typeof this.upd_data != 'object' || this.upd_data.length == 0 )
				return								null;

			for( var i in this.upd_data ){
				if( typeof this.upd_data[i] != 'object' ) 	
													continue;

				/* Add Data Element */
				this.add( this.active_list,this.upd_data[i] );
			}

			/* Update Event Handlers */
			this.unbindItems();
			this.bindItems();

			/* Reorder */
			this.reorderList( this.active_list );

			/* Update Item Heights */
			if( typeof this.fetchOptions() == 'object' )
				if( this.fetchOptions().hasOwnProperty('match_height') )
					if( this.fetchOptions()['match_height'] )
						this.matchHeight();
			
		},

		removeData 							:		function(){

			/* Filter for selected items */
			var $item 						= 		this.$elem.find(".LM_item")
														.filter( function(){
															return	$(this).data('lm-active') == 1;
													});

			/* Was an item selected ? */
			if( $item.length < 1 ){
				$.fn.listMaker.onError( "Please select an item before attempting to remove." );
				return 								null;
			}

			$item.empty().remove();
		},

		clearData							:		function(){

			/* Filter for selected items */
			var $item 						= 		this.$elem.find(".LM_item")
														.filter( function(){ return	1; });

			$item.empty().remove();

		},

		add 								: 		function( list_name,data,options ){

			var self						=		this;

			/* If user didnt supply a data object to load the list with, just carry on ... */
			if( typeof data != 'object' )
				return								false;

			/* Check for incoming method options in arguments */
			var position,bind_event;
			if( typeof options != 'undefined' ){
				if( options.hasOwnProperty( 'position' ) )
					position					=		options[ 'position' ];
				if( options.hasOwnProperty( 'bind_event' ) )
					bind_event					=		options[ 'bind_event' ] ? true : false ;
			}

			/* Get Options */
			var options 					=		typeof self.options == 'object' ? self.options : this.fetchOptions() ;

			/* Did the user supply position number ? */
			if( data.hasOwnProperty('lm-pos') ){

				/* Did user supply position number ? */
				position					=		data.hasOwnProperty('lm-pos') ? data['lm-pos'] : null ;

				/* Get all used positions */
				var used_positions			=		self.$elem.find("[name='" + list_name + "'] .LM_item").map(
														function(){return $(this).data("lm-pos");}
													).get();

				/* Is the user supplied number valid ? */
				if( isNaN( position ) ){

					$.fn.listMaker.onError( "An invalid position number was used. Please make sure all item numbers are integers." );
					position 				= 		Math.max.apply( Math, used_positions );

				/* Is the user supplied number in use ? */
				}else if( used_positions.indexOf( parseInt(position) ) > 0 ){

					/* Filter all list items >= position, increase their position by 1 */
					self.$elem.find( "div[name='" + list_name + "'] .LM_item" ).filter( function(){
						if( $(this).data('lm-pos') >= position ){
							$(this).data('lm-pos',$(this).data('lm-pos') + 1);
						};
					});

					
				}

			}else{

				if( isNaN( position ) ){

					/* Get all used positions, find highest position number, increase by 1 */
					var used_positions		=		self.$elem.find("[name='" + list_name + "'] .LM_item").map(
														function(){return $(this).data("lm-pos");}
													).get();

					position 				= 		( Math.max.apply( Math, used_positions ) ) + 1;

				}
			}

 
			var $item						=		jQuery( "<div></div>" ).addClass("LM_item");

			/* Was a title supplied to for the item ? */
			if( !data.hasOwnProperty( 'title' ) )	
				title 						= 		"Error: Missing Title";

			/* Get Supplied Item Title */
			data['title']					=		data.hasOwnProperty( 'title' ) ? data['title'] : "" ;
			if( data['title'].length ){

				/* Is title too long / look bad ? */
				dots						=		options.item_substr != 0 ? true : false ;
				dots 						=		dots && data[ 'title' ].length > options.item_substr ? " ..." : "" ;
				title						=		( data[ 'title' ].substr( 0,options.item_substr ) + dots );
				$item.attr( 'title',data[ 'title' ] );

			}else{
				title 						= 		"Error: Missing Title";
			}

			/* Checkboxes or Radio Buttons */
			type 							=		options.multiple ? "checkbox" : "radio" ;

			/* Hide Input */
			var $input						=		jQuery( "<input>" ).attr("type",type).css('display','none').prop("checked",( list_name == 'selected' ? "checked" : false ) );

			/* Set Input Elem Attributes */
			for( var attr in data )
				if( data.hasOwnProperty( attr ) )	$input.attr( attr,data[ attr ] );

			/* Build Item */
			$item.html( title ).append( $input );

			/* Set Position # */
			$item.data( 'lm-pos',position );

			/* Set Item to Inactive 
			*	Items will be 'active' when clicked, prior to switching between lists 	
			*/
			$item.data( 'lm-active','0' );

			/* Add Item Class */
			$item.addClass( 'LM_item' );

			/* Rebind Event Listeners. Item may have been added AFTER initial event binding */
			if( bind_event )						self.bindItem( $item );

			/* Update DOM */
			self.$elem.find("div[name='" + list_name + "'] div[name='list']").append( $item );


		},

		getData								:		function( list_name ){

			list_name						=		typeof list_name == 'undefined' ? 'selected' : list_name ;
			var self						=		this;

			if( !self.$elem.find( "div[name='" + list_name + "']" ).length )
				return								false;

			var output 						=		{};
			self.$elem.find( "div[name='" + list_name + "'] input" ).each(function(){

				output[ $(this).val() ]		=		{};
				for (var i = 0, atts = this.attributes, n = atts.length; i < n; i++)
					output[ $(this).val() ][ atts[i].nodeName ]
											=		$(this).attr( atts[i].nodeName );

				output[ $(this).val() ]		=		$.extend( output[ $(this).val() ],$(this).data() );
			});

			return									output;

		},

		matchHeight 						: 		function(){

			var height 						= 		0;

			this.$elem.find(".LM_item").each(function(k,i){
				if( $(this).height() > height )
					height 					= 		$(this).height();
			})
			
			this.$elem.find(".LM_item").height( height );

		},

		bindHandlers 						: 		function(){

			this.bindItems();
			
			this.bindButtons();

		},

		bindItem							:		function( $LM_item ){

			var self						=		this;

			$LM_item.on({

				'mouseover' : function(){
													$(this).css('background','')
														.addClass('LM_bg_blue_w_border');
				},

				'mouseout' : function(){

					/* Remove 'Hover' style IF list is not active */
					if( $(this).data('lm-active') != 1 )
													$(this).css('background','#ede9f3')
														.removeClass('LM_bg_blue_w_border');	

				},

				'click' : function(){

					/* Is the element active ? */
					active					=		$(this).data('lm-active');
					$input					=		$(this).find("input");

					/* If $(this) element IS active */
					if( active == 1 || active == '1' ){

						/* Remove active flag. 'mouseout' event will remove style class */
						$(this).data('lm-active','0')
									.css('border','thin solid transparent');

					/* If element IS NOT active	*/
					}else{

						/* LI all elements inactive, excluding the first LI title element */
						self.$elem.find(".LM_item")
									.removeClass('LM_bg_blue_w_border')
									.css('background','#ede9f3')
									.data('lm-active','0');

						/* Highlight active element, set lm-active = 1 */
						$(this).css('background','')
									.addClass('LM_bg_blue_w_border')
									.data('lm-active','1');
					}
				}

			});

		},

		bindItems							:		function(){

			var self						=		this;

			self.$elem.find(".LM_item").on({

				'mouseover' : function(){
													$(this).css('background','')
														.addClass('LM_bg_blue_w_border');
				},

				'mouseout' : function(){

					/* Remove 'Hover' style IF list is not active */
					if( $(this).data('lm-active') != 1 )
													$(this).css('background','#ede9f3')
														.removeClass('LM_bg_blue_w_border');	

				},

				'click' : function(){

					/* Is the element active ? */
					active					=		$(this).data('lm-active');
					$input					=		$(this).find("input");

					/* If $(this) element IS active */
					if( active == 1 || active == '1' ){

						/* Remove active flag. 'mouseout' event will remove style class */
						$(this).data('lm-active','0')
									.css('border','thin solid transparent');

					/* If element IS NOT active	*/
					}else{

						/* LI all elements inactive, excluding the first LI title element */
						self.$elem.find(".LM_item")
									.removeClass('LM_bg_blue_w_border')
									.css('background','#ede9f3')
									.data('lm-active','0');

						/* Highlight active element, set lm-active = 1 */
						$(this).css('background','')
									.addClass('LM_bg_blue_w_border')
									.data('lm-active','1');
					}
				}

			});
		},

		bindButtons							:		function(){
			var self 						=		this;
			self.$elem.find(".LM_item_select").on({
				'mouseover':function(){				$(this).css("border","thin solid #999"); 			},
				'mouseout':function(){				$(this).css("border","thin solid transparent"); 	},
				'click':							self.select
			});
			self.$elem.find(".LM_item_deselect").on({
				'mouseover':function(){				$(this).css("border","thin solid #999"); 			},
				'mouseout':function(){				$(this).css("border","thin solid transparent"); 	},
				'click':							self.deselect
			});
		},
			
		unbindItems 						: 		function(){

			var self						=		this;

			self.$elem.find(".LM_item").off();
		},

		/* move element to selected list */
		select : function(){

			/* Filter for selected items */
			var $item 						= 		$(this).closest(".LM_item_title")
														.next("div[name='list']")
														.find(".LM_item")
														.filter( function(){
															return	$(this).data('lm-active') == 1;
													})

			/* Was an item selected ? */
			if( $item.length < 1 ){
				$.fn.listMaker.onError( "Please select an item before clicking add." );
				return 								null;
			}

			/* IF radio options, only permit 1 item to move */
			items							=		$(this).closest(".LM_container")
														.find("div[name='selected'] div[name='list']")
														.find(".LM_item").length > 0;
			type 							=		$item.find("input").attr('type').toLowerCase() == "radio";

			if( items && type ){

				$.fn.listMaker.onError( "You may only select 1 item at a time." );

													$(this).closest(".LM_container")
														.find("div[name='available'] .LM_item")
														.css('background','#ede9f3')
														.removeClass('LM_bg_blue_w_border')
														.data('lm-active','0');
				return 								null;
			}

			/* Remove mouseover styling from the element to be moved & set to unactive */
			$item.css({'background':'#ede9f3'}).removeClass('LM_bg_blue_w_border').data('lm-active','0');

			/* Check Input */
			$item.find("input").prop("checked",true);

			/* Clone the item */
			$clone							=		$item.clone( true );

			/* Remove element from this list */
			$item.empty().remove();

			/* Move the element to the new list */
			$(this).closest(".LM_container").find("div[name='selected'] div[name='list']").append( $clone );

			/* Reorder List */
			var $list 						= 		$(this).closest(".LM_container")
														.find("div[name='selected']  div[name='list']");

			/* Does the list item belong before or after it's siblings ? */
			var $listItems 					= 		$list.find('.LM_item').sort(
														function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); }
													);

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 						= 		$listItems.clone(true);

			/* Set new elements */
			$(this).closest(".LM_container").find("div[name='selected'] div[name='list']").html( $listItems );
		},

		/* move element to available [ shortcut method ] */
		deselect : function(){

			/* Filter for selected items */
			var $item 						= 		$(this).closest(".LM_item_title")
														.next("div[name='list']")
														.find(".LM_item")
														.filter( function(){
															return	$(this).data('lm-active') == 1;
													});

			/* Was an item selected ? */
			if( $item.length < 1 ){
				$.fn.listMaker.onError("Please select an item before clicking remove.");
				return 								null;
			}

			/* Remove mouseover styling from the element to be moved & set to unactive */
			$item.css({'background':'#ede9f3'}).removeClass('LM_bg_blue_w_border').data('lm-active','0');

			/* Check Input */
			$item.find("input").prop("checked",false);

			/* Clone the item */
			$clone							=		$item.clone( true );

			/* Remove element from this list */
			$item.empty().remove();

			/* Move the element to the new list */
			$(this).closest(".LM_container").find("div[name='available'] div[name='list']").append( $clone );

			/* Reorder List */
			var $list 						= 		$(this).closest(".LM_container").find("div[name='available']  div[name='list']");

			/* Does the list item belong before or after it's siblings ? */
			var $listItems 					= 		$list.find('.LM_item').sort(
														function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); }
													);

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 						= 		$listItems.clone(true);

			/* Set new elements */
			$(this).closest(".LM_container").find("div[name='available'] div[name='list']").html( $listItems );

		},

		reorderList							:		function( list_name ){

			var $list 						= 		this.$elem.closest(".LM_container")
																.find("div[name='" + list_name + "']  div[name='list']");

			/* Does the list item belong before or after it's siblings ? */
			var $listItems 					= 		$list.find('.LM_item').sort(
														function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); }
													);

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 						= 		$listItems.clone(true);

			/* Append the cloned list elements */
			this.$elem.closest(".LM_container").find("div[name='" + list_name + "'] div[name='list']").html( $listItems );

		}

	};

	$.fn.listMaker = function( options ) {

		/* Initialize listMaker Object */
		if( arguments.length == 1 && typeof arguments[0] == 'object'  ){

				/* iterate through all elements in collection to apply plugin to */
				return this.each( function() {

					/* Clone master ListMaker object */
					var lm 					= 		Object.create( ListMaker );

					/* Apply user-supplied settings / default settings */
					lm.init( options, this );

					/* Store data object */
					$.data( this, 'listMaker', lm );

				});
		}

		/* Update listMaker Object */
		if( ['addData','removeData'].indexOf( arguments[0] ) > -1 ){

				/* Clone master ListMaker object */
				var lm 						= 		Object.create( ListMaker );

				/* Apply user-supplied settings / default settings */
				lm.update( this, arguments );

		}

	};

	$.fn.listMaker.onError 					= 		function( msg ) {

		var options				 			=	 	$.fn.listMaker.options;

		if( options.on_error 				== 		'console' ){
			console.log( msg );
		}else if( options.on_error 			== 		'alert' ){
			alert( msg );
		}else if( typeof options.on_error 	== 		'function' ){
			options.on_error( msg );
		}

	}

	/* Default ListMaker Settings */
	$.fn.listMaker.options 					= 		{
			avail_items						:		{},										// Object, Preloads the the left hand menu on init.
			select_items					:		{},										// Object, Preloads the the right hand menu on init.
			middle							:		"",										// String, HTML content to display between the lists.
			avail_title						:		"",										// String, Title to left hand list.
			select_title					:		"",										// String, Title to right hand list.
			item_substr						:		0	,									// Int, Set to 0 to turn off. Anything > 0 will cut the item title short. This is handy for working with small real estate.
			multiple						:		true,									// true = checkbox, false = radio
			height							:		'500px',								// Int, Default height in pixels
			match_height					:		true,									// when true, all items will share the same height as the tallest item.
			template						: 		{ left_width:'39%', right_width:'39%' },// Percentage of overall width of listMaker Container. Can also be PX.
			on_error						: 		function( msg ){ 						// Additional Error Handling

														/* Build additional custom error messaging here */
														console.log( 'Custom Error: ',msg );

														/* Call external functions */
														if( typeof do_this_on_error == 'function' ) do_this_on_error( msg );

													}
	};

})( jQuery, window, document );

function do_this_on_error( msg ){
	/* Put custom error handling inside here */
}
