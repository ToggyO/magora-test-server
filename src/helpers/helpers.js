const Validation = (value) => !(!value && (value.length < 1 || value.length >= 150));

module.exports = Validation;
