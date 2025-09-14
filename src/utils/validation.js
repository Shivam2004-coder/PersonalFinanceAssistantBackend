const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateEditProfileData = (req) => {

  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "gender",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

const validateFormData = (form) => {
  const { type, category, amount, date } = form;
  if (!type || !['income', 'expense'].includes(type)) {
    throw new Error("Type is not valid!");
  } else if (!category) {
    throw new Error("Category is required!");
  } else if (!amount || isNaN(amount) || amount <= 0) {
    throw new Error("Amount should be a positive number!");
  } else if (!date || isNaN(new Date(date).getTime())) {
    throw new Error("Date is not valid!");
  }
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateFormData
};