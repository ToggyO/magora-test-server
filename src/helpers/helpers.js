const ValidationString = (value) => !(!value && (value.length < 1 || value.length >= 150));

const ValidationNumber = (value) => {
	const raw = parseInt(value, 10);
	return !!(value && (raw > 18 && raw <= 150));
};

module.exports = {
	ValidationString,
	ValidationNumber,
};
