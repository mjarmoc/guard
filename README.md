# guard
Jquery plugin that guards your forms Allows to validate single fieldsets and whole form. As simple, as it could be.

![Build Status](https://travis-ci.org/mjarmoc/guard.svg?branch=master)


# Usage


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
We are in pre-release phase.

# To Do
* Documentation
* Callbacks
* Provide default styles
