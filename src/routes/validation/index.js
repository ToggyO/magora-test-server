const userValidate = {
	firstName: {
		isLength: {
			options: {
				min: 1,
				max: 150,
			},
			errorMessage: 'First name length must be greater then 1 and less then 150',
		},
		// trim: {
		// options: ' -',
		// },
	},
	lastName: {
		isLength: {
			options: {
				min: 1,
				max: 150,
			},
			errorMessage: 'Last name length must be greater then 1 and less then 150',
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
	},
	email: {
		isEmail: true,
		errorMessage: 'Email is invalid',
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
	},
};


module.exports = {
	userValidate,
	userCreateValidate,
};
