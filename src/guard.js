/*!
* Guard | Jquery validation plugin
* Author: Michal Jarmoc
* Author page: http://github.com/mjarmoc
* Licensed under the MIT license
*/

// Guard Contructor
var Guard = function(options, errors, rules, form){

	var guard = this;

	// Save the element reference, both as a jQuery reference and a normal reference
	this.form  = form;
	this.$form = $(form);

	// Array for fields
	this.fields = [],

	// Array for invalid field
	this.invalid = [],

	// Default options
	this.options = {
		sections: false,
		live: true,
		parentClass: 'form-group'
	},

	// Default english errors
	this.errors = {
		required: 'Please enter a value',
		requiredSelect: 'Please select an option',
		requiredCheckbox: 'Please check the input',
		requiredRadio: 'Please select an option',
		email: 'Please enter a valid email format - login@host.domain',
		number: 'Please enter a numerical value',
		minLength: 'The field has to contain at least {x} signs',
		maxLength: 'The field has to contain at most {x} signs',
		isLength: 'The field has to contain {x} signs',
		minValue: 'The field value has to be greater than {x}',
		maxValue: 'The field value has to be less than {x}'
	},

	// Rules
	this.rules = {
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
	    },
		isLength: function(node, isLength, length){
	    	return node.val().length == isLength || guard.errors.isLength.replace('{x}', isLength);
	    },
		minValue: function(node, minValue){
			return node.val() >= minValue || guard.errors.minValue.replace('{x}', minValue);
		},
		maxValue: function(node, maxValue){
			return node.val() <= maxValue || guard.errors.minValue.replace('{x}', maxValue);
		}
	},

	// Public method: validate single field
	this.validate = function(field){
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
	this._collect = function(section){

		// If there are no sections or a section is not specified get all fields
		if(!this.options.sections || section === undefined){
			this.fields = this.$form.find('[data-guard]');
		}

		// Get the particular section
		else {
			this.fields = this.$form.find(this.options.sections).eq(section).find('[data-guard]');
		}
	},

	this._cleanError = function(field){
		var parent = field.parents('.' + this.options.parentClass),
			  error = parent.find('.guard-error');
		if (parent.hasClass('guard-invalid')){
			parent.removeClass('guard-invalid');
		}
		if(error.length){
			error.remove();
		}
	},

	this._createError = function(field, error){
		var parent = field.parents('.' + this.options.parentClass);
		if (!parent.hasClass('guard-invalid')){
			parent.addClass('guard-invalid').append('<div class="guard-error">' + error + '</div>');
		}
		guard.invalid.push(field);
	},

	// Public method: check section or form
	this.check = function(form,section){

		// Reset state
		guard.invalid = [];

		// Collect fields
		this._collect(form, section);
		$.each(this.fields, function(index,field){
			guard.validate(field);
		});

		return (guard.invalid.length == 0) ? true : false;
	},

	// Init
	this.init = function () {

		// Mix in the passed-in options with the default options
		guard.options = $.extend({}, this.options, options);

		// Mix in the passed custom errors with the default errors
		guard.errors = $.extend({}, this.errors, errors);

		// Mix in the passed custom errors with the default errors
		guard.rules = $.extend({}, this.rules, rules);

 		// Bind events for live validation
		if(guard.options.live == true){
			guard.$form.find('[data-guard]').bind('change', function(event){
				guard.validate(this);
			});
		}

		// Call validation on submit
		guard.$form.submit(function(e){
			e.preventDefault();
			if(guard.check()){
				if(typeof(guard.options.beforeSubmit) == 'function' ) guard.options.beforeSubmit.call(this,e);
				if(typeof(guard.options.onSubmit) == 'function' ) guard.options.onSubmit.call(this,e);
				else this.submit();
			}
		});
	};

	this.init();

};


(function($){
  // Start a plugin
  $.fn.guard = function(options, errors, rules) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){

		var myGuard = new Guard (options, errors, rules, this);

        // Save the instance of the guard object in the element's data store
        $.data(this, 'guardApi', myGuard);

      });

    }
  };
})(jQuery);
