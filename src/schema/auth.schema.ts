import * as yup from "yup";

export const LoginShcema = yup.object().shape({
  email: yup
    .string()
    .required("*Email is required")
    .email("*Invalid email format"),
  password: yup
    .string()
    .required("*Password is required")
    .min(6, "*Must be at least 6 characters"),
});
