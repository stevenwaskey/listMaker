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
			/* provides access to other plugin methods (i.e. self.build ) */
			var self = this;
			//console.log( "self", typeof self, self );

			/* Set elem html */
			/* <div class='dropadd'></div> <- the element to add the list to */
			self.elem = elem;
			//console.log( "self.elem", typeof self.elem, self.elem );

			/* Set elem jquery object */
			/* Provides access to jQuery API to html elem above ( self.elem )*/
			self.$elem = $( elem );
			//console.log( "self.$elem", typeof self.$elem, self.$elem );

/*
			-- REMOVE -- 
			ONLY ACCEPT OBJECTS AS OPTIONS

			self.search = ( typeof options === 'string' )
				? options
				: options.search;
*/

			/* Add user supplied options */
			self.options = $.extend( {}, $.fn.listMaker.options, options );

			self.build();

		},

		build: function(){	

			/* Create HTML List Containers */
			this.createTemplate();

			/* Populate Data */
			this.loadData();

			/* Create HTML List Headers */
			this.createHeader();

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

			var dynamic_title_css	=	{'position':'absolute','width':this.$elem.find("li:first-child").width() };

			/* Create Headers */
			var $avail_hdr		=		jQuery( "<li></li>" ).addClass( 'LM_item_title LM_bg_white_to_gray' )
															.text( this.options.avail_title )
															.append( jQuery("<div></div>").addClass('LM_item_select') )
															.css( dynamic_title_css );

			var $select_hdr		=		jQuery( "<li></li>" ).addClass( 'LM_item_title LM_bg_white_to_gray' )
															.text( this.options.select_title )
															.append( jQuery("<div></div>").addClass('LM_item_deselect') )
															.css( dynamic_title_css );

			/* Append Headers */
			this.$elem.find("ul[name='available']").prepend( $avail_hdr.data('id','title') );
			this.$elem.find("ul[name='selected']").prepend( $select_hdr.data('id','title') );

			/* Shift 1st selectable items down behind the title element */

			$("body").prepend( jQuery( "<div></div>" ).css({'border':'thin solid red','height':'200px','width':'200px'}).text('test') );
			

		},


		loadData : function(){

			var self = this;
			/* Convert object literals into jQuery DOM objects */
			var count = 0;
			this.options.avail_items	= 	$.map( this.options.avail_items,function( obj,i ){ 

				var $li					=	jQuery( "<li></li>" );

				/* Just Incase the Title is Missing */
				if( !obj.hasOwnProperty( 'title' ) )$li.text( "Error: Missing Title" );

				/* Get Item Title */
				if( obj.hasOwnProperty( 'title' ) ){

					/* Get Title Length ? */
					dots 				=	obj[ 'title' ].length > self.options.item_substr ? " ..." : "" ;
					$li.text( obj[ 'title' ].substr( 0,self.options.item_substr ) + dots );
				}

				/* Set Item Data Attributes */
				for( var attr in obj )		if( obj.hasOwnProperty( attr ) )	$li.data( attr,obj[ attr ] );

				/* Add Position Counter */
				count++;					$li.data( 'lm-pos',count );

				/* Add Item Class */
				$li.addClass( 'LM_item' );

				//return $li;
				self.$elem.find("ul[name='available']").append( $li );

			});
			
			
			//console.log( this.options.avail_items );

/*
			for( var item in this.options.avail_items ){
				if( this.options.avail_items.hasOwnProperty( item ) ){
					/* Get List Item 
					item 		=		this.options.avail_items[ item ];
					
					for( var item in this.options.avail_items ){
				}

			}
*/
			
			
/*
			if( 
			console.log( this.options.avail_items );
*/

			//$("li",".dropadd").css({'cursor':'pointer','background':'#ede9f3','margin-top':'3px','margin-bottom':'3px'});

			//	/* Set the first LI in each UL as a title bar. Set CSS & Remove Events.  */
			//	$("li:first-child",".dropadd").unbind().css({'background':'','cursor':'default','position':'absolute','height':'25px','margin-bottom':'20px','padding-top':'4px'});

		},

		refresh: function( length ) {
			var self = this;

			setTimeout(function() {
				self.fetch().done(function( results ) {
					results = self.limit( results.results, self.options.limit );

					self.buildFrag( results );

					self.display();

					if ( typeof self.options.onComplete === 'function' ) {
						self.options.onComplete.apply( self.elem, arguments );
					}

					if ( self.options.refresh ) {
						self.refresh();
					}
				});
			}, length || self.options.refresh );
		},

		fetch: function() {
			return $.ajax({
				url: this.url,
				data: { q: this.search },
				dataType: 'jsonp'
			});
		},

		buildFrag: function( results ) {
			var self = this;

			self.tweets = $.map( results, function( obj, i) {
				return $( self.options.wrapEachWith ).append ( obj.text )[0];
			});
		},

		display: function() {
			var self = this;

			if ( self.options.transition === 'none' || !self.options.transition ) {
				self.$elem.html( self.tweets ); // that's available??
			} else {
				self.$elem[ self.options.transition ]( 500, function() {
					$(this).html( self.tweets )[ self.options.transition ]( 500 );
				});
			}
		},

		limit: function( obj, count ) {
			return obj.slice( 0, count );
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
/*
		search: '@tutspremium',
		wrapEachWith: '<li></li>',
		limit: 10,
		refresh: null,
		onComplete: null,
		transition: 'fadeToggle'
*/
	};

})( jQuery, window, document );