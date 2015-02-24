var DualListPicker = (function(){

		//constructor
		var Picker = function( el, options, config ){
			this._initialize( el, options, config );
			this.render();
			this._attachListeners();
		};

		Picker.fn = Picker.prototype;

		Picker.fn._initialize = function( el, options, config ){
			this.el = el;
			this.options = options;
			this.config = config;
		};

		Picker.fn.getAllOptions = function(){
			return this.options;
		};

		Picker.fn.getAvailableOptions = function(){
			return this.getAllOptions().filter(function( opt ){
				return 	!opt.selected;
			});
		};

		Picker.fn.getSelectedOptions = function(){
			return this.getAllOptions().filter(function( opt ){
				return 	opt.selected;
			});
		};

		Picker.fn.moveItems = function( type, selectedItems ){

			var moveFn = function( selectedItems ){
				var selected = ( type === 'selected' )
				var self = 	this;

				selectedItems.forEach(function( item ){
					for ( var i = 0; i < self.options.length; i++ ){
						if ( self.options[ i ].id === parseInt( item.id, 10 ) ){
							self.options[ i ].selected = selected;
							break;
						}
					}
				});

				this.refresh();
			}.bind( this );
			
			return moveFn;

		};

		Picker.fn.render = function(){

			this.availablePicker = new Picker.MultiSelectBox( this, {
				buttonText: this.config.addButtonText,
				buttonAction: this.moveItems( 'selected' )
			});

			this.selectedPicker = new Picker.MultiSelectBox( this, {
				buttonText: this.config.removeButtonText,
				buttonAction: this.moveItems( 'available' )
			});

			this.el.appendChild( this.availablePicker.el, this.el );
			this.el.appendChild( this.selectedPicker.el, this.el );

			this.availablePicker.setOptions( this.getAvailableOptions() );
			this.selectedPicker.setOptions( this.getSelectedOptions() );

			this.availablePicker.refresh();
			this.selectedPicker.refresh();

		};

		Picker.fn.refresh = function(){

			this.availablePicker.setOptions( this.getAvailableOptions() );
			this.selectedPicker.setOptions( this.getSelectedOptions() );

			this.availablePicker.refresh();
			this.selectedPicker.refresh();

		};

		Picker.fn._attachListeners = function(){

		};

		return Picker;
})();