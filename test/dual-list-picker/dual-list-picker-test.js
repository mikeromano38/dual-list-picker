describe('DualListPicker', function () {

	describe('definition', function () {
		it('should be a constructor', function () {
			expect( DualListPicker).toBeDefined();
			expect( typeof DualListPicker).toBe('function');
		});
	});

	var pickerConfig,
		testEl,
		picker,
		selectOptions;

	beforeEach(function () {

		pickerConfig = {
			addButtonContent: 'Add Option',
			removeButtonContent: 'Remove Option',
			availableLabelText: 'Available Items',
			selectedLabelText: 'Selected Items',
			availablePlaceholderText: 'Search Available Items',
			selectedPlaceholderText: 'Search Available Items',
			onUpdate: jasmine.createSpy()
		};

		selectOptions = [];
		var _i = 0;

		while ( _i < 200 ){
			_i++;
			selectOptions.push({
				displayName: 'Option ' + _i,
				id: _i,
				selected: _i % 8 === 0
			});
		}

		testEl = document.createElement('div');
		picker = new DualListPicker( testEl, selectOptions, pickerConfig );
	});

	describe('instantiation', function () {

		it('should render correctly', function () {
			expect( picker.el ).toBe( testEl );
			expect( picker.el.children[ 0 ] ).toBe( picker.availablePicker.el );
			expect( picker.el.children[ 1 ] ).toBe( picker.selectedPicker.el );

			expect( picker.availablePicker.pickerButton.tagName ).toBe( 'BUTTON' );
			expect( picker.availablePicker.pickerButton.innerText ).toBe( pickerConfig.addButtonContent );
			expect( picker.availablePicker.searchBox.tagName).toBe('INPUT');
			expect( picker.availablePicker.searchBox.placeholder).toBe(pickerConfig.availablePlaceholderText);
			expect( picker.availablePicker.filterLabel.tagName).toBe( 'SPAN' );
			expect( picker.availablePicker.picker.tagName ).toBe('SELECT')

			expect( picker.selectedPicker.pickerButton.tagName ).toBe( 'BUTTON' );
			expect( picker.selectedPicker.pickerButton.innerText ).toBe( pickerConfig.removeButtonContent );
			expect( picker.selectedPicker.searchBox.tagName).toBe('INPUT');
			expect( picker.selectedPicker.searchBox.placeholder).toBe(pickerConfig.selectedPlaceholderText);
			expect( picker.selectedPicker.filterLabel.tagName).toBe( 'SPAN' );
			expect( picker.selectedPicker.picker.tagName ).toBe('SELECT')

		});

	});

	describe('instance methods', function () {
		describe('getAllOptions', function () {
			it('should return all of the options, both selected and unselected', function () {
				expect( picker.getAllOptions().length ).toBe( selectOptions.length )
			});
		});

		describe('getAvailableOptions', function () {
			it('should return the options that are not selected', function () {
				var options = [
					{ displayName: 'Test 1', selected: true },
					{ displayName: 'Test 2', selected: false },
					{ displayName: 'Test 3', selected: false },
					{ displayName: 'Test 4', selected: true }
				];

				picker = new DualListPicker( testEl, options, pickerConfig );
				var availableOptions = picker.getAvailableOptions();

				expect( availableOptions.length ).toBe( 2 );
				expect( availableOptions[ 0].displayName).toBe( 'Test 2' );
				expect( availableOptions[ 1].displayName).toBe( 'Test 3' );
			});
		});

		describe('getSelectedOptions', function () {
			it('should return the options that are not selected', function () {
				var options = [
					{ displayName: 'Test 1', selected: true },
					{ displayName: 'Test 2', selected: false },
					{ displayName: 'Test 3', selected: false },
					{ displayName: 'Test 4', selected: true }
				];

				picker = new DualListPicker( testEl, options, pickerConfig );
				var availableOptions = picker.getSelectedOptions();

				expect( availableOptions.length ).toBe( 2 );
				expect( availableOptions[ 0].displayName).toBe( 'Test 1' );
				expect( availableOptions[ 1].displayName).toBe( 'Test 4' );
			});
		});

		describe('moveItems partial application function', function () {
			it('should return a function', function () {
				expect(typeof picker.moveItems('test') ).toBe('function');
			});

			it('the returned function should call refresh', function () {
				spyOn( picker, 'refresh' );

				var partialApplication = picker.moveItems('test');

				partialApplication([]);

				expect( picker.refresh).toHaveBeenCalled()
			});

			describe('passing "selected"', function () {
				var setSelected;

				beforeEach(function () {
					setSelected = picker.moveItems('selected');
				});

				it('should return a function that sets the passed items matching options to selected even if id\'s are text', function () {

					//set all selected to false
					picker.getAllOptions().forEach(function( opt ){
						opt.selected = false;
					});

					var items = [{ id: '1' }, { id: '45' }, { id: '72'} ];

					var selectedOpts = picker.getAllOptions().filter(function( opt ){
						return opt.id === 1 || opt.id === 45 || opt.id === 72;
					});

					expect( selectedOpts[ 0].selected ).toBe( false );
					expect( selectedOpts[ 1].selected ).toBe( false );
					expect( selectedOpts[ 2].selected ).toBe( false );

					setSelected( items );

					expect( selectedOpts[ 0].selected ).toBe( true );
					expect( selectedOpts[ 1].selected ).toBe( true );
					expect( selectedOpts[ 2].selected ).toBe( true );
				});

				it('should call the configs onUpdate function passing the pickerData object', function () {

					var items = [
						{ id: '1', displayName: 'test', selected: false },
						{ id: '45', displayName: 'test', selected: false  },
						{ id: '72', displayName: 'test', selected: false }
					];

					picker = new DualListPicker( testEl, items, pickerConfig );

					picker.availablePicker.options[0].selected = true;
					picker.availablePicker.options[1].selected = true;

					setSelected = picker.moveItems('selected');

					setSelected( items );

					expect( pickerConfig.onUpdate ).toHaveBeenCalledWith({
						selected: [ items[0], items[1] ],
						available: [ items[2] ],
						all: [ items[0], items[1], items[2] ]
					})
				});
			});

			describe('passing "available"', function () {
				var setAvailable;

				beforeEach(function () {
					setAvailable = picker.moveItems('available');
				});

				it('should return a function that sets the passed items matching options to available even if id\'s are text', function () {

					//set all selected to false
					picker.getAllOptions().forEach(function( opt ){
						opt.selected = true;
					});

					var items = [{ id: 1 }, { id: 45 }, { id: 72} ];

					var selectedOpts = picker.getAllOptions().filter(function( opt ){
						return opt.id === 1 || opt.id === 45 || opt.id === 72;
					});

					expect( selectedOpts[ 0].selected ).toBe( true );
					expect( selectedOpts[ 1].selected ).toBe( true );
					expect( selectedOpts[ 2].selected ).toBe( true );

					setAvailable( items );

					expect( selectedOpts[ 0].selected ).toBe( false );
					expect( selectedOpts[ 1].selected ).toBe( false );
					expect( selectedOpts[ 2].selected ).toBe( false );
				});

				it('should call the configs onUpdate function passing the pickerData object', function () {

					var items = [
						{ id: '1', displayName: 'test', selected: true },
						{ id: '45', displayName: 'test', selected: true  },
						{ id: '72', displayName: 'test', selected: true }
					];

					picker = new DualListPicker( testEl, items, pickerConfig );

					picker.selectedPicker.options[0].selected = false;
					picker.selectedPicker.options[1].selected = false;

					var setAvailable = picker.moveItems('available');

					setAvailable( items );

					expect( pickerConfig.onUpdate ).toHaveBeenCalledWith({
						selected: [ items[2], ],
						available: [ items[0], items[1] ],
						all: [ items[0], items[1], items[2] ]
					})
				});
			});

			describe('updateOptionsFromDom method', function () {
				beforeEach(function () {
					pickerConfig = {
						addButtonText: 'Add Option',
						removeButtonText: 'Remove Option',
						availableLabelText: 'Available Items',
						selectedLabelText: 'Selected Items',
						availablePlaceholderText: 'Search Available Items',
						selectedPlaceholderText: 'Search Available Items'
					};

					selectOptions = [
						{ displayName: 'Test 1', selected: false },
						{ displayName: 'Test 2', selected: false },
						{ displayName: 'Test 3', selected: true },
						{ displayName: 'Test 4', selected: false },
						{ displayName: 'Test 5', selected: true },
						{ displayName: 'Test 6', selected: false },
					];

					testEl = document.createElement('div');
					picker = new DualListPicker( testEl, selectOptions, pickerConfig );
				});

				it('should update a picker based on the current selections in the dom', function () {
					expect( picker.availablePicker.picker.options[ 0 ].selected ).toBe( false );
					expect( picker.availablePicker.options[ 0 ].selected ).toBe( false );

					//update the DOM element
					picker.availablePicker.picker.options[0].selected = true;
					picker.availablePicker.updateOptionsFromDom();

					expect( picker.availablePicker.picker.options[ 0 ].selected ).toBe( true );
					expect( picker.availablePicker.options[ 0 ].selected ).toBe( true );

				});
			});

			describe('buttonClicked method', function () {
				beforeEach(function () {
					pickerConfig = {
						addButtonText: 'Add Option',
						removeButtonText: 'Remove Option',
						availableLabelText: 'Available Items',
						selectedLabelText: 'Selected Items',
						availablePlaceholderText: 'Search Available Items',
						selectedPlaceholderText: 'Search Available Items'
					};

					selectOptions = [
						{ displayName: 'Test 1', id: 1, selected: false },
						{ displayName: 'Test 2', id: 2, selected: false },
						{ displayName: 'Test 3', id: 3, selected: true },
						{ displayName: 'Test 4', id: 4, selected: false },
						{ displayName: 'Test 5', id: 5, selected: true },
						{ displayName: 'Test 6', id: 6, selected: false },
					];

					testEl = document.createElement('div');
					picker = new DualListPicker( testEl, selectOptions, pickerConfig );
				});

				it('should update a the dual-picker if the add button is clicked', function () {
					expect( picker.availablePicker.picker.options.length ).toBe( 4 );
					expect( picker.availablePicker.picker.options[ 0 ].selected ).toBe( false );

					//update the DOM element
					picker.availablePicker.picker.options[0].selected = true;
					picker.availablePicker.buttonClicked();

					expect( picker.availablePicker.picker.options.length ).toBe( 3 );

					//expect( picker.availablePicker.picker.options.length ).toBe( 3 );
					//expect( picker.availablePicker.options[ 0 ].selected ).toBe( true );

				});

				it('should update a the dual-picker if the remove button is clicked', function () {
					expect( picker.selectedPicker.picker.options.length ).toBe( 2 );
					expect( picker.availablePicker.picker.options.length ).toBe( 4 );
					expect( picker.selectedPicker.picker.options[ 0 ].selected ).toBe( false );

					//update the DOM element
					picker.selectedPicker.picker.options[0].selected = true;
					picker.selectedPicker.buttonClicked();

					expect( picker.selectedPicker.picker.options.length ).toBe( 1 );
					expect( picker.availablePicker.picker.options.length ).toBe( 5 );


					//expect( picker.availablePicker.picker.options.length ).toBe( 3 );
					//expect( picker.availablePicker.options[ 0 ].selected ).toBe( true );

				});
			});

			describe('picker.getSelectedOptions', function () {
				beforeEach(function () {
					pickerConfig = {
						addButtonText: 'Add Option',
						removeButtonText: 'Remove Option',
						availableLabelText: 'Available Items',
						selectedLabelText: 'Selected Items',
						availablePlaceholderText: 'Search Available Items',
						selectedPlaceholderText: 'Search Available Items'
					};

					selectOptions = [
						{ displayName: 'Test 1', selected: false },
						{ displayName: 'Test 2', selected: false },
						{ displayName: 'Test 3', selected: true },
						{ displayName: 'Test 4', selected: false },
						{ displayName: 'Test 5', selected: true },
						{ displayName: 'Test 6', selected: false },
					];

					testEl = document.createElement('div');
					picker = new DualListPicker( testEl, selectOptions, pickerConfig );
				});

				it('should return all selected options for a sub picker', function () {
					expect( picker.availablePicker.getSelectedOptions().length).toBe( 0 );

					picker.availablePicker.options[ 0].selected = true;

					expect( picker.availablePicker.getSelectedOptions().length).toBe( 1 );
				});
			});

			describe('filtering', function () {

				beforeEach(function () {
					pickerConfig = {
						addButtonText: 'Add Option',
						removeButtonText: 'Remove Option',
						availableLabelText: 'Available Items',
						selectedLabelText: 'Selected Items',
						availablePlaceholderText: 'Search Available Items',
						selectedPlaceholderText: 'Search Available Items'
					};

					selectOptions = [
						{ displayName: 'Test 1', selected: false },
						{ displayName: 'Test 2', selected: false },
						{ displayName: 'Test 3', selected: true },
						{ displayName: 'Test 4', selected: false },
						{ displayName: 'Test 5', selected: true },
						{ displayName: 'Test 6', selected: false }
					];

					testEl = document.createElement('div');
					picker = new DualListPicker( testEl, selectOptions, pickerConfig );
				});

				it('should update the filter options and refresh when a search is submitted', function () {
					spyOn( picker.availablePicker, 'updateFilterOptions' );
					spyOn( picker.availablePicker, 'refresh' );

					picker.availablePicker.searchSubmitted();

					expect( picker.availablePicker.updateFilterOptions).toHaveBeenCalled();
					expect( picker.availablePicker.refresh).toHaveBeenCalled();
				});



				it('should filter available options based on the search text', function () {
					expect( picker.availablePicker.filterOptions.length ).toBe( 0 );
					expect( picker.availablePicker.filterActive ).toBe( false );

					var searchText = 'Test 1';

					picker.availablePicker.updateFilterOptions( searchText );

					expect( picker.availablePicker.filterText).toBe( searchText );
					expect( picker.availablePicker.filterActive ).toBe( true );
					expect( picker.availablePicker.filterOptions.length ).toBe( 1 );
					expect( picker.availablePicker.filterOptions[0] ).toBe( selectOptions[0] );

					searchText = 'Test';

					picker.availablePicker.updateFilterOptions( searchText );

					expect( picker.availablePicker.filterText).toBe( searchText );
					expect( picker.availablePicker.filterActive ).toBe( true );
					expect( picker.availablePicker.filterOptions.length ).toBe( 4 );

				});

				it('should filter selected options based on the search text', function () {
					expect( picker.selectedPicker.filterOptions.length ).toBe( 0 );
					expect( picker.selectedPicker.filterActive ).toBe( false );

					var searchText = 'Test 3';

					picker.selectedPicker.updateFilterOptions( searchText );

					expect( picker.selectedPicker.filterText).toBe( searchText );
					expect( picker.selectedPicker.filterActive ).toBe( true );
					expect( picker.selectedPicker.filterOptions.length ).toBe( 1 );

					searchText = 'Test';

					picker.selectedPicker.updateFilterOptions( searchText );

					expect( picker.selectedPicker.filterText).toBe( searchText );
					expect( picker.selectedPicker.filterActive ).toBe( true );
					expect( picker.selectedPicker.filterOptions.length ).toBe( 2 );

				});
			});
		});

	});
});