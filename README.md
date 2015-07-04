# guard
Jquery plugin that guards your forms Allows to validate single fieldsets and whole form. As simple, as it could be.

![Build Status](https://travis-ci.org/mjarmoc/guard.svg?branch=master)


# Usage


# Options
* `parentClass` : `string` || default : `form-group` || class of the parent containing the field, the element will get the `guard-invalid` class and an error node appened
* `sections` : `string` or `false` || default : `false` || if the form contains sections, that needs to be validated separatly (i.e. form steps) then pass the DOM selector
* `live` : `boolean` || default : `true` || whether a form should validate on go or after a submit event

# Rules
* required
* number
* email
* maxLength[x]
* minLength[x]

# Public Methods
* `check(section)` : `section` is `int` and represents section index number : returns `boolean` || check if the section is valid (there are no invalid fields). If section argument is empty, then it will check whole form.
* `validate(field)` : `field` is DOM selector : return `boolean` || check if the particular field is valid

# Callbacks

# Version
We are in pre-release phase.

# To Do
* Documentation
* Callbacks
* Provide default styles
