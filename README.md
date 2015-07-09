# guard

Jquery plugin that guards your forms.

* As simple and fast as it could be.
* Allows you to validate single fields, custom sections of form (i.e.fieldsets) and whole form.
* Provides public methods, to check validation inside your own code.
* Behaves well with form nodes styling scripts.
* Allows you to pass custom error messages and validation rules.

![Build Status](https://travis-ci.org/mjarmoc/guard.svg?branch=master)

# Usage

Download and wire the plugin:

`bower install --save-dev jquery-guard`

Make a plugin instance:

`var guard = $(formSelector).guard(options, errors, rules);`

`var guard = $(#form).guard({sections:'fieldset', onSubmit: function(e){this.submit;}}, errors, rules);`

Suppose that you have a long form with 4 steps / parts / sections. Suppose you want to validate a section, before loading the next one:

`$('.goToNextSection').click(function(e){
    e.preventDefault();
    if (guard.check($(this).parents('fieldset').index()) $.get('step2.html');
  });`

# Languages



# Options
* `parentClass` : `string` || default : `form-group` || class of the parent containing the field, the element will get the `guard-invalid` class and an error node appened
* `sections` : `string` or `false` || default : `false` || if the form contains sections, that needs to be validated separatly (i.e. form steps) then pass the DOM selector
* `live` : `boolean` || default : `true` || whether the form should validate on go or during the submit event
* callbacks (see below)

# Rules
* required
* number
* email
* maxLength[x]
* minLength[x]

# Public Methods
* `check(section)` : the `section` is an `int` and represents the section index number : returns `boolean` || check if the section is valid (there are no invalid fields). If the section argument is empty, then it will check the whole form.
* `validate(field)` : the `field` is a DOM selector : return `boolean` || check if the particular field is valid

# Callbacks
Every callback function has the form set as `this` value and `event` passed to it as an argument.
* `onSubmit(e)` : called during submit event, if the form is valid. If not specified, the form will normally submit.

# Version
1.0.0

# To Do
* Mocha Tests
