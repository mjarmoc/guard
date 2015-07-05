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
		parentClass: 'form-group'
	},

	// Default english errors
	errors: {
		required: 'Please enter a value',
		requiredSelect: 'Please select an option',
		requiredCheckbox: 'Please check the input',
		requiredRadio: 'Please select an option',
		email: 'Please enter a valid email format - login@host.domain',
		number: 'Please enter a numerical value',
		minLength: 'The field has to contain at least {x} signs',
		maxLength: 'The field has to contain at most {x} signs'
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
		maxLength: function(node, maxLength, length){
    	return length <= maxLength || guard.errors.maxLength.replace('{x}', maxLength);
		},
    minLength: function(node, minLength, length){
    	return length >= minLength || guard.errors.minLength.replace('{x}', minLength);
    }
	},

	// Public method: validate single field
	validate: function(field){
		var field = $(field),
				rules = field.data('guard').split(','),
				argument, valid;

		$.each(rules, function(index,rule){

      // If rule is complex, split name and argument
      if(rule.indexOf('{') !== -1){
        argument = rule.slice(rule.indexOf('{') + 1, rule.indexOf('}'));
        rule = rule.slice(0, rule.indexOf('{'));
      }

			// Validate only required and non-empty fields
			if (field.attr('type') == 'text' || field.is('textarea')){
				var length = field.val().length;
				if (length !== 0 || rule === 'required') valid = guard.rules[rule](field,argument,length);
				else valid = true;
			}
			else {
				valid = guard.rules[rule](field,argument);
			}

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
	init: function (options, errors, rules, form) {

		// Mix in the passed-in options with the default options
		this.options = $.extend({}, this.options, options);

		// Mix in the passed custom errors with the default errors
		this.errors = $.extend({}, this.errors, errors);

		// Mix in the passed custom errors with the default errors
		this.rules = $.extend({}, this.rules, rules);

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
			if(guard.check()){
				if(typeof(guard.options.onSubmit) == 'function' ) guard.options.onSubmit.call(this,e);
				else this.submit();
			}
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
  $.fn.guard = function(options, errors, rules) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        // Create a new speaker object via the Prototypal Object.create
        var myGuard = Object.create(guard);

        // Run the initialization function of the guard
        guard.init(options, errors, rules, this); // `this` refers to the element

        // Save the instance of the guard object in the element's data store
        $.data(this, 'guard', guard);
      });
    }
  };
})(jQuery);
