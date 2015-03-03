window.DualListPicker = (function(){

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
				return !opt.selected;
			});
		};

		Picker.fn.getSelectedOptions = function(){
			return this.getAllOptions().filter(function( opt ){
				return opt.selected;
			});
		};

		Picker.fn.moveItems = function( type ){

			var moveFn = function( selectedItems ){
				var selected = ( type === 'selected' );
				var self = this;

				selectedItems.forEach(function( item ){
					for ( var i = 0; i < self.options.length; i++ ){
						if ( self.options[ i ].id === parseInt( item.id, 10 ) ){
							self.options[ i ].selected = selected;
							break;
						}
					}
				});

				this.refresh();

				if ( typeof this.config.onUpdate === 'function' ){
					this.config.onUpdate({
						selected: this.getSelectedOptions(),
						available: this.getAvailableOptions(),
						all: this.getAllOptions()
					});
				}

			}.bind( this );
			
			return moveFn;

		};

		Picker.fn.render = function(){

			this.el.className = this.el.className + ' ' + DualListPicker.Constants.PICKER_CLASSNAME;

			this.availablePicker = new Picker.MultiSelectBox( this, {
				clearSearchButtonContent: this.config.clearSearchButtonContent,
				buttonContent: this.config.addButtonContent || 'Add',
				buttonAction: this.moveItems( 'selected' ),
				placeholderText: this.config.availablePlaceholderText,
				className: 'available-' + DualListPicker.Constants.SELECTBOX_CLASSNAME,
				labelText: this.config.availableLabelText
			});

			this.selectedPicker = new Picker.MultiSelectBox( this, {
				clearSearchButtonContent: this.config.clearSearchButtonContent,
				buttonContent: this.config.removeButtonContent || 'Remove',
				buttonAction: this.moveItems( 'available' ),
				placeholderText: this.config.selectedPlaceholderText,
				className: 'selected-' + DualListPicker.Constants.SELECTBOX_CLASSNAME,
				labelText: this.config.selectedLabelText
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
	}
)();
(function( DualListPicker ){
	var Utils = {};

	Utils.attachEventListener = function( el, event, callback, useCapture ){
		el.addEventListener( event, callback, useCapture );

		function removeListener(){
			el.removeEventListener( event, callback, useCapture );
		}

		return {
			remove: removeListener
		};
	};

	DualListPicker.Utils = Utils;
})( DualListPicker || {} );
(function( DualListPicker ){
	var Constants = {};

	Constants.PICKER_CLASSNAME = 'dual-list-picker';

	Constants.SELECTBOX_CLASSNAME = 'select-box';

	Constants.FILTER_LABEL_CLASSNAME = 'filter-label';

	Constants.CLEAR_BUTTON_CLASSNAME = 'clear-button';

	DualListPicker.Constants = Constants;
})( DualListPicker || {} );
(function( DualListPicker, Utils, Constants ){

	var Select = function( instance, config ){
		this._listeners = [];
		this.dlInstance = instance;
		this._initialize( config );
		this.render();
		this.attachListeners();
	};

	Select.fn = Select.prototype;

	Select.fn._initialize = function( config ){
		this.options = [];
		this.config = config;
	};

	Select.fn.render = function(){

		this.el = document.createElement( 'div' );
		this.el.className = this.el.className + ' ' + this.config.className;

		this.picker = document.createElement('select');
		this.picker.multiple = true;

		this.filterLabel = document.createElement('span');
		this.filterLabel.className = Constants.FILTER_LABEL_CLASSNAME;
		this.filterLabel.innerText = this.getFilterLabelText();

		var searchWrapper = document.createElement('div');
		searchWrapper.className = 'search-wrapper';

		this.searchBox = document.createElement('input');
		this.searchBox.type = 'search';
		this.searchBox.placeholder = this.config.placeholderText || 'Search';

		this.clearSearchButton = document.createElement('button');
		this.clearSearchButton.className = Constants.CLEAR_BUTTON_CLASSNAME;
		this.clearSearchButton.style.display = 'none';
		this.clearSearchButton.type = 'button';
		this.clearSearchButton.innerHTML = this.config.clearSearchButtonContent || 'x';

		this.pickerButton = document.createElement('button');
		this.pickerButton.innerHTML = this.config.buttonContent;
		this.pickerButton.type = 'button';


		searchWrapper.appendChild( this.searchBox );
		searchWrapper.appendChild( this.clearSearchButton );

		this.el.appendChild(searchWrapper);
		this.el.appendChild( this.filterLabel );
		this.el.appendChild( this.picker );
		this.el.appendChild( this.pickerButton );

	};

	Select.fn.updateFilterOptions = function( searchText ){
		var self = this;

		this.filterActive = !!searchText;
		this.filterText = searchText;
		
		this.filterOptions = this.options.filter(function( opt ){
			return self.filterText && opt.displayName && opt.displayName.toLowerCase().match( self.filterText.toLowerCase() );
		});
	};

	Select.fn.getFilterLabelText = function(){
		if ( this.options ){
			return this.config.labelText + ' (' + this.options.length + ')';
		}
	};

	Select.fn.getFilterOptions = function(){
		return this.filterOptions;
	};

	Select.fn.refresh = function(){
		this.updateFilterOptions( this.filterText );
		var options = ( this.filterActive ) ? this.getFilterOptions() : this.options;

		this.picker.innerHTML = '';
		this.picker.innerHTML = this.generateOptionsStringFromOptions( options );

		this.filterLabel.innerText = this.getFilterLabelText();
	};

	Select.fn.generateOptionsStringFromOptions = function( options ){
		var optionsString = '';

		options.forEach(function( option ){
			optionsString += '<option rel="' + option.id + '">' + option.displayName + '</option>';
		});

		return optionsString;
	};

	Select.fn.deselectAll = function(){

		this.getFilterOptions().forEach(function( option ){
			option.selected = false;
		});

		this.options.forEach(function( option ){
			option.selected = false;
		});
	};

	Select.fn.updateOptionsFromDom = function(){
		var domOptions = Array.prototype.slice.call( this.picker.options );
		this.options = domOptions.map(function( opt ){

			return {
				displayName: opt.text,
				selected: opt.selected,
				id: opt.attributes.rel.value
			};
		});
	};

	Select.fn.getSelectedOptions = function(){
		return this.options.filter(function( opt ){
			return opt.selected; 
		});
	};

	Select.fn.buttonClicked = function(){
		this.updateOptionsFromDom();
		this.config.buttonAction.call( this.dlInstance, this.getSelectedOptions() );
	};

	Select.fn.searchSubmitted = function( evt ){
		if ( evt ){
			evt.preventDefault();
		}

		this.updateFilterOptions( this.searchBox.value );
		this.refresh();
	};

	Select.fn.clearSearch = function(){
		this.searchBox.value = '';
		this.searchSubmitted();
		this.clearSearchButton.style.display = 'none';
	};

	Select.fn.hideShowClearButton = function(){
		if ( this.searchBox.value ){
			this.clearSearchButton.style.display = 'inline-block';
		} else {
			this.clearSearchButton.style.display = 'none';
		}
	};

	Select.fn.setOptions = function( options ){
		this.options = options;
	};

	Select.fn.attachListeners = function(){
		var buttonListener = Utils.attachEventListener( this.pickerButton, 'click', this.buttonClicked.bind( this ) );
		this._listeners.push( buttonListener );

		// var pickerListener = Utils.attachEventListener( this.picker, 'click', this.updateOptionsFromDom.bind( this ) );
		// this._listeners.push( pickerListener );

		var pickerDblClickListener = Utils.attachEventListener( this.picker, 'dblclick', this.buttonClicked.bind( this ) );
		this._listeners.push( pickerDblClickListener );

		var searchBoxListener = Utils.attachEventListener( this.searchBox, 'search', this.searchSubmitted.bind( this ) );
		this._listeners.push( searchBoxListener );

		var hideShowClearListener = Utils.attachEventListener( this.searchBox, 'keyup', this.hideShowClearButton.bind( this ) );
		this._listeners.push( hideShowClearListener );

		var searchBoxClearListener = Utils.attachEventListener( this.clearSearchButton, 'click', this.clearSearch.bind( this ) );
		this._listeners.push( searchBoxClearListener );
	};

	Select.fn.removeAllListeners = function(){
		while ( this._listeners.length ){
			this._listeners.pop().remove();
		}
	};

	DualListPicker.MultiSelectBox = Select;
})( DualListPicker || {}, DualListPicker.Utils, DualListPicker.Constants );