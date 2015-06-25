# guard
Jquery plugin that guards your forms Allows to validate single fieldsets and whole form. As simple, as it could be.

![Build Status](https://travis-ci.org/mjarmoc/guard.svg?branch=master)

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
* check()
* validate()

# Callbacks

# Version
We are in pre-release phase.

# To Do
* Documentation
* Callbacks
* Provide default styles
