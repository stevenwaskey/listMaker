/*
*	ListMaker jQuery Plugin
*	Author: Steven Waskey
*/

/*
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

			/* Create HTML List Headers */
			this.createHeader();

			/* Bind Event Handlers */
			this.bindHandlers();

		},


		createTemplate : function(){

			/* Left Div Elem [ Available Items ] */
			var $left			=		jQuery( "<div></div>" ).css({'float':'left','width':'39%'});

				/* Unordered List of available data elements */
				var $avail_ul	=		jQuery( "<ul></ul>" ).attr('name','available').addClass( 'LM_listBox' );
				$left.append( $avail_ul );

			/* Middle Div Elem [ Notes / Instructions / Custom HTML ] */
			var $middle			=		jQuery( "<div></div>" ).html( this.options.middle ).addClass( 'LM_middle' );

			/* Right Div Elem [ Selected Items ] */
			var $right			=		jQuery( "<div></div>" ).css({'float':'left','width':'39%'});

				/* Unordered List of available data elements */
				//LM_container
				var $select_ul	=		jQuery( "<ul></ul>" ).attr('name','selected').addClass( 'LM_listBox' );
				$right.append( $select_ul );

			this.$elem.addClass( 'LM_container' );
			this.$elem.append( $left ).append( $middle ).append( $right );

		},


		createHeader : function(){

			if( this.$elem.find("ul[name='available'] li").length > 0 ){
				var width 			=		this.$elem.find("ul[name='available'] li").outerWidth() + 6;	
			}else{
				var width 			=		this.$elem.find("ul[name='available']").width() + 6;
			}

			var dynamic_title_css=		{ 'position':'absolute',
											'width':this.$elem.find("ul[name='available'] li").outerWidth() + 6,
											'margin-left':'-3px','padding-top':'6px','margin-top':'-3px' };

			var $avail_hdr		=		jQuery( "<li></li>" ).addClass( 'LM_item_title LM_bg_white_to_gray' )
															.data('id','title')
															.text( this.options.avail_title )
															.append( jQuery("<div></div>").addClass('LM_item_select') )
															.css( dynamic_title_css );

			if( this.$elem.find("ul[name='selected'] li").length > 0 ){
				var width 			=		this.$elem.find("ul[name='selected'] li").outerWidth() + 6;	
			}else{
				var width 			=		this.$elem.find("ul[name='selected']").width() + 6;
			}

			var dynamic_title_css=		{ 'position':'absolute',
											'width':width,
											'margin-left':'-3px','padding-top':'6px','margin-top':'-3px' };

			var $select_hdr		=		jQuery( "<li></li>" ).addClass( 'LM_item_title LM_bg_white_to_gray' )
															.data('id','title')
															.text( this.options.select_title )
															.append( jQuery("<div></div>").addClass('LM_item_deselect') )
															.css( dynamic_title_css );

			/* Append Headers */
			this.$elem.find("ul[name='available']").prepend( $avail_hdr );
			this.$elem.find("ul[name='selected']").prepend( $select_hdr );

			/* If selectable list items exist, move beneath newly positioned header */
			if( this.$elem.find("ul[name='available'] li").length > 0 ){
				this.$elem.find("li","ul[name='available']").eq(1)
							.css('margin-top',this.$elem.find("li","ul[name='available']").eq(0).outerHeight() );	
			}
			if( this.$elem.find("ul[name='selected'] li").length > 0 ){
				this.$elem.find("li","ul[name='selected']").eq(1)
							.css('margin-top',this.$elem.find("li","ul[name='selected']").eq(0).outerHeight() );
			}

		},


		loadData : function(){

			var self 					= 	this;
			/* Convert object literals into jQuery DOM objects */
			var position 				= 	1;
			this.options.avail_items	= 	$.map( this.options.avail_items,function( obj,i ){ 

				/* Add Item */
				self.add('available',obj,position );

				position++;

			});

			var position 				= 	1;
			this.options.select_items	= 	$.map( this.options.select_items,function( obj,i ){ 

				/* Add Item */
				self.add('selected',obj,position );

				position++;

			});
		},


		add : function( list_name,data,position ){

			var self				=	this;
			var $li					=	jQuery( "<li></li>" );

			/* Was a title supplied to for the item ? */
			if( !data.hasOwnProperty( 'title' ) )	$li.text( "Error: Missing Title" );

			/* Get Supplied Item Title */
			if( data.hasOwnProperty( 'title' ) ){

				/* Is title too long / look bad ? */
				dots				=	self.options.item_substr != 0 ? true : false ;
				dots 				=	dots && data[ 'title' ].length > self.options.item_substr ? " ..." : "" ;
				$li.text( data[ 'title' ].substr( 0,self.options.item_substr ) + dots );
			}

			/* Set Item Data Attributes */
			for( var attr in data )		if( data.hasOwnProperty( attr ) )	$li.data( attr,data[ attr ] );

			/* Set Position # */
			$li.data( 'lm-pos',position );

			/* Set Item to Inactive 
			*	Items will be 'active' when clicked, prior to switching between lists 	
			*/
			$li.data( 'lm-active','0' );

			/* Add Item Class */
			$li.addClass( 'LM_item' );

			/* Update DOM */
			if( self.$elem.find("ul[name='" + list_name + "']").length > 0 )
										self.$elem.find("ul[name='" + list_name + "']").append( $li );

		},

		/* move element to selected list */
		select : function(){

			/* Filter for selected items */
			var $item = $(this).closest("ul").children("li").filter( function(){
				return			$(this).data('lm-active') == 1;
			})

			/* Was an item selected ? */
			if( $item.length < 1 ){
				console.log("ERROR:  ","Please select an item before clicking add.");
				return 			null;
			}

			/* Remove mouseover styling from the element to be moved & set to unactive */
			$item.css({'background':'#ede9f3'}).removeClass('LM_bg_blue_w_border').data('active','0');

			/* Clone the item */
			$clone	=	$item.clone( true );

			/* Is the newly selected item the first in the selected list ? */
			if( $(this).closest(".LM_container").find("ul[name='selected'] li").length == 1 ){

				/* Set top margin */
				$clone.css({'margin-top':$(this).closest(".LM_container").find("ul[name='selected'] li").eq(0).outerHeight()});

			}else{

				/* Set top margin */
				$clone.css({'margin-top':'3px'});

			}


			/* Move the element to the new list */
			$(this).closest(".LM_container").find("ul[name='selected']").append( $clone );

			/* Remove element from this list */
			$item.empty().remove();
	
			/* Reorder List */
			var $list = $(this).closest(".LM_container").find("ul[name='selected']");

			/* Does the list item belong before or after it's siblings ? */
			var $listItems 	= 		$list.find('li').sort(function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); });

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 		= 		$listItems.clone(true);
	
			/* Remove the LI element in the wrong position */
			$(this).closest(".LM_container").find("ul[name='selected']").find('li').remove();
	
			/* Append the cloned LI element */
			$(this).closest(".LM_container").find("ul[name='selected']").append( $listItems );

		},


		/* move element to available [ shortcut method ] */
		deselect : function(){

			/* Filter for selected items */
			var $item = $(this).closest("ul").children("li").filter( function(){
				return			$(this).data('lm-active') == 1;
			})

			/* Was an item selected ? */
			if( $item.length < 1 ){
				console.log("ERROR:  ","Please select an item before clicking remove.");
				return null;
			}

			/* Remove mouseover styling from the element to be moved & set to unactive */
			$item.css({'background':'#ede9f3'}).removeClass('LM_bg_blue_w_border').data('active','0');

			/* Clone the item */
			$clone	=	$item.clone( true );

			/* Is the newly selected item the first in the selected list ? */
			if( $(this).closest(".LM_container").find("ul[name='available'] li").length == 1 ){

				/* Set top margin */
				$clone.css({'margin-top':$(this).closest(".LM_container").find("ul[name='available'] li").eq(0).outerHeight()});

			}else{

				/* Set top margin */
				$clone.css({'margin-top':'3px'});

			}


			/* Move the element to the new list */
			$(this).closest(".LM_container").find("ul[name='available']").append( $clone );

			/* Remove element from this list */
			$item.empty().remove();

			/* Reorder List */
			var $list = $(this).closest(".LM_container").find("ul[name='available']");

			/* Does the list item belong before or after it's siblings ? */
			var $listItems 	= 		$list.find('li').sort(function(a,b){ return $(a).data('lm-pos') - $(b).data('lm-pos'); });

			/* Clone the item to be moved. .clone(true) keeps data / event handlers */
			$listItems 		= 		$listItems.clone(true);
	
			/* Remove the LI element in the wrong position */
			$(this).closest(".LM_container").find("ul[name='available']").find('li').remove();
	
			/* Append the cloned LI element */
			$(this).closest(".LM_container").find("ul[name='available']").append( $listItems );

		},

		positionInUse : function( list_name,position ){
		
			var previous = $("ul[name='" + list_name + "'] li").filter(function() { 
								return $(this).data("lm-pos") == position;
							});

			if( previous ){
				//console.log( "found", position );
			}else{
				//console.log( "not found" );
			}

			return previous;
		},

		bindHandlers : function(){

			var self	=	this;

			/* List Items (excluding header/title li item) */
			self.$elem.find("li").filter(function(){ 
           		return			$(this).data('id') != 'title';
		   	}).on({

				'mouseover' : function(){
					$(this).css('background','').addClass('LM_bg_blue_w_border');
				},

				'mouseout' : function(){

					/* Remove 'Hover' style IF list is not active */
					if( $(this).data('lm-active') != 1 ){
						$(this).css('background','#ede9f3').removeClass('LM_bg_blue_w_border');	
					}
				},

				'click' : function(){

					/* Is the element active ? */
					active			=			$(this).data('lm-active');

					/* If $(this) element IS active */
					if( active == 1 || active == '1' ){
		
						/* Remove active flag. 'mouseout' event will remove style class */
						$(this).data('lm-active','0').css('border','thin solid transparent');
		
					/* If element IS NOT active	*/
					}else{

						/* LI all elements inactive, excluding the first LI title element */
						self.$elem.find("ul li:not(li:first-child)")
									.removeClass('LM_bg_blue_w_border')
									.css('background','#ede9f3')
									.data('lm-active','0');

						/* Highlight active element, set lm-active = 1 */
						$(this).css('background','').addClass('LM_bg_blue_w_border').data('lm-active','1');
					}
				},

				'dblclick' : function(){
					/* just add/remove the element */
					//console.log( "elelemt " );

				}

			});

			$(".LM_item_select").on({
				'mouseover':function(){		$(this).css("border","thin solid #999"); 			},
				'mouseout':function(){		$(this).css("border","thin solid transparent"); 	},
				'click':self.select
			});
			$(".LM_item_deselect").on({
				'mouseover':function(){		$(this).css("border","thin solid #999"); 			},
				'mouseout':function(){		$(this).css("border","thin solid transparent"); 	},
				'click':self.deselect
			});

		},

		onError : function( msg ){

			var self = this;

			if( typeof self.options.on_error == 'function' ){
				self.options.on_error( msg );
			}else if( self.options.on_error == 'console' ){
				console.log( msg );
			}else if( self.options.on_error == 'alert' ){
				alert( msg );
			}

		}
	};

	$.fn.listMaker = function( options ) {
	
		/* iterate through all elements in collection to apply plugin to */
		return this.each(function() {

			/* Clone master ListMaker object */
			var lm = Object.create( ListMaker );

			/* Apply user-supplied settings / default settings */
			lm.init( options, this );

			/* dont remember why its here ! */
			$.data( this, 'listMaker', lm );

		});
	};

	/* Default ListMaker Settings */
	$.fn.listMaker.options = {
		/*	search: '@tutspremium',
			wrapEachWith: '<li></li>',
			limit: 10,
			refresh: null,
			onComplete: null,
			transition: 'fadeToggle' */
	};

})( jQuery, window, document );
