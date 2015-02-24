(function( DualListPicker, Utils ){

	var Select = function( instance, config ){
		this._listeners = [];
		debugger
		this.dlInstance = instance;
		this._initialize( config );
		this.render();
		this.attachListeners();
	};

	Select.fn = Select.prototype;

	Select.fn._initialize = function( config ){
		this.config = config
	};

	Select.fn.render = function(){
		this.el = document.createElement( 'div' );
		this.picker = document.createElement('select');
		this.picker.multiple = true;
		this.pickerButton = document.createElement('button');
		this.pickerButton.innerText = this.config.buttonText;
		
		this.el.appendChild( this.picker );
		this.el.appendChild( this.pickerButton );
	};

	Select.fn.refresh = function(){
		this.picker.innerHTML = '';
		this.picker.innerHTML = this.generateOptionsStringFromOptions( this.options );
	};

	Select.fn.generateOptionsStringFromOptions = function( options ){
		var optionsString = '';

		options.forEach(function( option ){
			optionsString += '<option rel="' + option.id + '">' + option.displayName + '</option>';
		});

		return optionsString;
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

	Select.fn.buttonClicked = function( evt ){
		this.config.buttonAction.call( this.dlInstance, this.getSelectedOptions() );
	};

	Select.fn.setOptions = function( options ){
		this.options = options;
	};

	Select.fn.attachListeners = function(){
		var buttonListener = Utils.attachEventListener( this.pickerButton, 'click', this.buttonClicked.bind( this ) );
		this._listeners.push( buttonListener );

		var pickerListener = Utils.attachEventListener( this.picker, 'click', this.updateOptionsFromDom.bind( this ) );
		this._listeners.push( pickerListener );
	};

	Select.fn.removeAllListeners = function(){
		while ( this._listeners.length ){
			this._listeners.pop().remove();
		}
	};

	DualListPicker.MultiSelectBox = Select;
})( DualListPicker || {}, DualListPicker.Utils );