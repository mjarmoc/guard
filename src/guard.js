/*!
* Guard | Jquery validation plugin
* Author: Michal Jarmoc 
* Author page: http://github.com/mjarmoc
* Licensed under the MIT license
*/

// Guard Object
var guard = {
	
	// Array for fields
	fields: [],
	
	// Array for invalid fields
	invalid: [],
	
	// Default options
	options: {
		sections: false,
		live: true,
		parentClass: 'form-control'
	},
	
	// Default english errors
	errors: {
		required: 'Please enter a value',
		requiredSelect: 'Please select an option',
		requiredCheckbox: 'Please check the input',
		requiredRadio: 'Please select an option',
		email: 'Please enter a valid email format - login@host.domain',
		number: 'Please enter a numerical value',
		zipcode: 'Please enter a valid zip code format xx-xxx'
	},
	
	// Rules 
	rules: {
      required: function(node){
			if(node.is('input')){
				switch (node.attr('type')){
					default: 
						return node.val().length > 0 || guard.errors.required;
					break;
					case 'checkbox':
						return node.prop('checked') || guard.errors.requiredCheckbox;
					break;
					case 'radio':
						var checked = $('[name="' + node.attr('name') + '"]:checked').length;
						return checked > 0 || guard.errors.requiredRadio;
					break;
				}
			}
			else if (node.is('select')){
					return node[0].selectedIndex !== 0 || guard.errors.requiredSelect;				
			}
			else if (node.is('textarea')){
				return node.val().length > 0 || guard.errors.required;
			}
		},
		email: function(node){
			var expression = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
			return expression.test(node.val()) || guard.errors.email;
		},
		number: function(node){
			var expression = new RegExp(/^[\-\+]?(\d+|\d+\.?\d+)$/);
			return expression.test(node.val()) || guard.errors.number;
		},
		zipcode: function(node){
			var expression = new RegExp(/^\d{2}\-\d{3}$/);
			return expression.test(node.val()) || guard.errors.zipcode;
		}
	},
	
	// Public method: validate single field
	validate: function(field){
		var field = $(field), 
			rules = field.data('guard').split(','),
			valid;
		$.each(rules, function(index,rule){
			valid = guard.rules[rule](field);
			if(valid === true){
				guard._cleanError(field);
			}
			else {
				guard._createError(field,valid);
				return false;
			}
			return valid;
		});
	},
	
	// Collect fields to validate 
	_collect: function(form, section){
		
		// If there are no sections or a section is not specified get all fields
		if(!this.options.sections || section === undefined){
			this.fields = form.find('[data-guard]');
		}
		
		// Get the particular section	
		else {
			this.fields = form.find(this.options.sections).eq(section).find('[data-guard]');
		}
		
	},

	_cleanError: function(field){
		var parent = field.parents('.' + this.options.parentClass),
			 error = parent.find('.guard-error');
		if (parent.hasClass('guard-invalid')){
			parent.removeClass('guard-invalid');
		}
		if(error.length){
			error.remove();
		}
	},
	
	_createError: function(field, error){
		var parent = field.parents('.' + this.options.parentClass);
		if (!parent.hasClass('guard-invalid')){
			parent.addClass('guard-invalid').append('<div class="guard-error">' + error + '</div>');
		}
		guard.invalid.push(field);
	},
	
	// Public method: check section or form
	check: function(section){
		
		// Reset state
		guard.invalid = [];
		
		// Collect fields
		this._collect(this.$form, section);
		$.each(this.fields, function(index,field){
			guard.validate(field);
		});
		
		return (guard.invalid.length == 0) ? true : false;
		
	},
	
	// Init
	init: function (options, errors, form) { 

		// Mix in the passed-in options with the default options
		this.options = $.extend({}, this.options, options);
		
		// Mix in the passed custom errors with the default errors
		this.errors = $.extend({}, this.errors, errors);

		// Save the element reference, both as a jQuery reference and a normal reference
		this.form  = form;
		this.$form = $(form);
		
		// Bind events for live validation
		if(this.options.live){
			$('[data-guard]').bind('change', function(event, element){
				guard.validate(this);
			});
		}
		
		// Call validation on submit
		this.$form.submit(function(e){
			e.preventDefault();
			if(guard.check()) this.submit();
		});
		
		// return this so that we can chain and use the bridge with less code. 
		return this;
	}
	
};

// Object.create support test, and fallback for browsers without it
if (typeof Object.create !== "function") {
	Object.create = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}

(function($){
  // Start a plugin
  $.fn.guard = function(options, errors) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        // Create a new speaker object via the Prototypal Object.create
        var myGuard = Object.create(guard);

        // Run the initialization function of the guard
        guard.init(options, errors, this); // `this` refers to the element

        // Save the instance of the guard object in the element's data store
        $.data(this, 'guard', guard);
      });
    }
  };
})(jQuery);