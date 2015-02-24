(function( DualListPicker ){
	Utils = {};

	Utils.attachEventListener = function( el, event, callback, useCapture ){
		el.addEventListener( event, callback, useCapture );

		function removeListener(){
			el.removeEventListener( event, callback, useCapture );
		}

		return {
			remove: removeListener
		}
	};

	DualListPicker.Utils = Utils;
})( DualListPicker || {} );