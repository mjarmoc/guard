var pl = {
  errors: {
    required: 'Proszę wypełnić pole',
    requiredSelect: 'Proszę wybrać opcję',
    requiredCheckbox: 'Proszę zaznaczyć pole',
    requiredRadio: 'Proszę zaznaczyć jedną opcję',
    email: 'Proszę podać poprawny adres email w formacie login@host.domain',
    number: 'Proszę wprowadzić jedynie cyfry',
    minLength: 'Pole musi mieć co najmniej {x} znaków',
    maxLength: 'Pole może mieć co najwyżej {x} znaków',
    minValue: 'Wartość pola musi być większa od {x}',
    maxValue: 'Wartość pola musi być mniejsza od {x}',
    zipcode: 'Proszę podać poprawny kod pocztowy w formacie xx-xxx'
  },
  rules: {
    zipcode: function(node){
      var expression = new RegExp(/^\d{2}\-\d{3}$/);
      return expression.test(node.val()) || guard.errors.zipcode;
    }
  }
}
