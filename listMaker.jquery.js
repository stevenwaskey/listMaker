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
			var self = this;

			/* Set elem html */
			self.elem = elem;

			/* Set elem jquery object */
			self.$elem = $( elem );

			/* Add user supplied options */
			self.options = $.extend( {}, $.fn.listMaker.options, options );

			/* Build ListMaker */
			self.build();

		},

		build: function(){	

			/* Create HTML List Containers */
			this.createTemplate();

			/* Populate Data */
			this.loadData();

			/* Bind Event Handlers */
			this.bindHandlers();

		},

		/* Build HTML List Containers */
		createTemplate : function(){

			this.createShell();

			this.createHeader();

			this.createContainers();

		},

		createShell	 :	function(){

			/* Add listMaker class to main container */
			this.$elem.addClass( "LM_container" );

			/* Left Div Elem [ Available Items ] */
			var $left						=		jQuery( "<div></div>" ).attr('name','available').addClass('LM_listBox').css({'width':this.options.template.left_width});
													this.$elem.append( $left );

			/* Middle Div Elem [ Notes / Instructions / Custom HTML ] */
			var $middle						=		jQuery( "<div></div>" ).html( this.options.middle ).addClass( 'LM_middle' );
													this.$elem.append( $middle );

			/* Right Div Elem [ Selected Items ] */
			var $right						=		jQuery( "<div></div>" ).attr('name','selected').addClass('LM_listBox').css({'width':this.options.template.right_width});
													this.$elem.append( $right );
		},

		createHeader : function(){

			/* Available List Items */
			var $left						=		jQuery( "<div></div>" ).addClass( 'LM_item_title LM_bg_white_to_gray' )
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

			var height						=		this.$elem.find("[name='available']").innerHeight() - this.$elem.find("[name='available']").find("[name='title']").outerHeight();
			this.$elem.find("[name='available']").append( jQuery( "<div></div>" ).attr('name','list').height( height ).css({'overflow-y':'auto','overflow-x':'hidden'}) );

			var height						=		this.$elem.find("[name='selected']").innerHeight() - this.$elem.find("[name='selected']").find("[name='title']").outerHeight();
			this.$elem.find("[name='selected']").append( jQuery( "<div></div>" ).attr('name','list').height( height ).css({'overflow-y':'auto','overflow-x':'hidden'}) );

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

		addData								:		function(){

			console.log( "External Call to Add New Data" );

		},

		add : function( list_name,data,position ){
			console.log('Adding Item ...');
			var self						=		this;
			var $item						=		jQuery( "<div></div>" ).addClass("LM_item");

			/* Was a title supplied to for the item ? */
			if( !data.hasOwnProperty( 'title' ) )	
				title 						= 		"Error: Missing Title";

			/* Get Supplied Item Title */
			if( data['title'].length ){

				/* Is title too long / look bad ? */
				dots						=		self.options.item_substr != 0 ? true : false ;
				dots 						=		dots && data[ 'title' ].length > self.options.item_substr ? " ..." : "" ;
				title						=		( data[ 'title' ].substr( 0,self.options.item_substr ) + dots );
				$item.attr( 'title',data[ 'title' ] );

			}else{
				title 						= 		"Error: Missing Title";
			}

			/* Checkboxes or Radio Buttons */
			type 							=		self.options.multiple ? "checkbox" : "radio" ;

			/* Hide Input */
			var $input						=		jQuery( "<input>" ).attr("type",type).css('display','none');

			/* Set Input Elem Attributes */
			for( var attr in data )		if( data.hasOwnProperty( attr ) )	$input.attr( attr,data[ attr ] );

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

			/* Update DOM */
			self.$elem.find("div[name='" + list_name + "'] div[name='list']").append( $item );

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

			var self	=	this;

			self.$elem.find(".LM_item").on({

				'mouseover' : function(){
													$(this).css('background','').addClass('LM_bg_blue_w_border');
				},

				'mouseout' : function(){

					/* Remove 'Hover' style IF list is not active */
					if( $(this).data('lm-active') != 1 )
													$(this).css('background','#ede9f3').removeClass('LM_bg_blue_w_border');	

				},

				'click' : function(){

					/* Is the element active ? */
					active					=		$(this).data('lm-active');
					$input					=		$(this).find("input");

					/* If $(this) element IS active */
					if( active == 1 || active == '1' ){

						/* Remove active flag. 'mouseout' event will remove style class */
						$(this).data('lm-active','0').css('border','thin solid transparent');

					/* If element IS NOT active	*/
					}else{

						/* LI all elements inactive, excluding the first LI title element */
						self.$elem.find(".LM_item")
									.removeClass('LM_bg_blue_w_border')
									.css('background','#ede9f3')
									.data('lm-active','0');

						/* Highlight active element, set lm-active = 1 */
						$(this).css('background','').addClass('LM_bg_blue_w_border').data('lm-active','1');
					}
				}

			});

			$(".LM_item_select").on({
				'mouseover':function(){				$(this).css("border","thin solid #999"); 			},
				'mouseout':function(){				$(this).css("border","thin solid transparent"); 	},
				'click':							self.select
			});
			$(".LM_item_deselect").on({
				'mouseover':function(){				$(this).css("border","thin solid #999"); 			},
				'mouseout':function(){				$(this).css("border","thin solid transparent"); 	},
				'click':							self.deselect
			});

		},


		/* move element to selected list */
		select : function(){

			/* Filter for selected items */
			var $item 						= 		$(this).closest(".LM_item_title").next("div[name='list']").find(".LM_item").filter( function(){
														return	$(this).data('lm-active') == 1;
													})

			/* Was an item selected ? */
			if( $item.length < 1 ){
				$.fn.listMaker.onError( "Please select an item before clicking add." );
				return 			null;
			}

			/* IF radio options, only permit 1 item to move */
			items							=		$(this).closest(".LM_container").find("div[name='selected'] div[name='list']").find(".LM_item").length > 0;
			type 							=		$item.find("input").attr('type').toLowerCase() == "radio";
			if( items && type ){
				$.fn.listMaker.onError( "You may only select 1 item at a time." );
				$(this).closest(".LM_container").find("div[name='available'] .LM_item").css('background','#ede9f3').removeClass('LM_bg_blue_w_border').data('lm-active','0');
				return 			null;
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
			var $list 						= 		$(this).closest(".LM_container").find("div[name='selected']  div[name='list']");

			/* Does the list item belong before or after it's siblings ? */
			var $listItems 					= 		$list.find('.LM_item').sort(function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); });

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 						= 		$listItems.clone(true);

			/* Remove the list item elements in the wrong position */
			$(this).closest(".LM_container").find("div[name='selected'] div[name='list']").find('.LM_item').remove();
	
			/* Append the cloned LI element */
			$(this).closest(".LM_container").find("div[name='selected'] div[name='list']").append( $listItems );

		},

		/* move element to available [ shortcut method ] */
		deselect : function(){

			/* Filter for selected items */
			var $item 						= 		$(this).closest(".LM_item_title").next("div[name='list']").find(".LM_item").filter( function(){
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
			var $listItems 					= 		$list.find('.LM_item').sort(function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); });

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 						= 		$listItems.clone(true);

			/* Remove the list item elements in the wrong position */
			$(this).closest(".LM_container").find("div[name='available'] div[name='list']").find('.LM_item').remove();
	
			/* Append the cloned LI element */
			$(this).closest(".LM_container").find("div[name='available'] div[name='list']").append( $listItems );

		}

	};

	$.fn.listMaker = function( options ) {

		/* iterate through all elements in collection to apply plugin to */
		return this.each(function() {

			/* Clone master ListMaker object */
			var lm 							= 		Object.create( ListMaker );

			/* Apply user-supplied settings / default settings */
			lm.init( options, this );

			/* dont remember why its here ! */
			$.data( this, 'listMaker', lm );

			$.data( this, 'listMaker',{'add1':function(){ console.log('test 1 ');}}  );
			/* attach the method to the actual item ? */
			

		});
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
		template							: 		{ left_width:'39%', right_width:'39%' },
		on_error							: 		function( msg ){ 

														/* Build additional custom error messaging here */
														console.log( 'Custom Error: ',msg );

														/* Simply call external functions from here */
														if( typeof do_this_on_error == 'function' ) do_this_on_error( msg );

													}
	};

})( jQuery, window, document );
