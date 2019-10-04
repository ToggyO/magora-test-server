const userValidate = {
	firstName: {
		isLength: {
			options: {
				min: 1,
				max: 150,
			},
			errorMessage: 'First name length must be greater then 1 and less then 150',
		},
		rtrim: {
			options: ' ',
		},
	},
	lastName: {
		isLength: {
			options: {
				min: 1,
				max: 150,
			},
			errorMessage: 'Last name length must be greater then 1 and less then 150',
		},
		rtrim: {
			options: ' ',
		},
	},
	age: {
		isInt: {
			options: {
				gt: 1,
				lt: 150,
			},
			errorMessage: 'Age must be greater then 1 and less then 150',
		},
		rtrim: {
			options: ' ',
		},
	},
	email: {
		isEmail: true,
		errorMessage: 'Email is invalid',
		rtrim: {
			options: ' ',
		},
	},
};

const userCreateValidate = {
	...userValidate,
	password: {
		isLength: {
			options: {
				min: 6,
				max: 20,
			},
			errorMessage: 'Password length must be greater then 6 and less then 20',
		},
		rtrim: {
			options: ' ',
		},
		// rtrim: {
		// 	options: [[' ', ' -']],
		// },
	},
};

const authValidate = {
	email: {
		isEmail: true,
		errorMessage: 'Email is invalid',
		rtrim: {
			options: ' ',
		},
	},
	password: {
		isLength: {
			options: {
				min: 6,
				max: 20,
			},
			errorMessage: 'Password length must be greater then 6 and less then 20',
		},
		rtrim: {
			options: ' ',
		},
	},
};


module.exports = {
	userValidate,
	userCreateValidate,
	authValidate,
};
