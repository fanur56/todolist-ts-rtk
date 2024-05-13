import { useAppDispatch } from "common/hooks/useAppDispatch";
import { FormikHelpers, useFormik } from "formik";
import { LoginParamsType } from "features/Login/authAPI";
import { authThunks } from "features/Login/auth-reducer";
import { BaseResponseType } from "common/types";

type FormikErrorType = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
      }

      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more";
      }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
      dispatch(authThunks.login(values))
        .unwrap()
        .catch((error: BaseResponseType) => {
          error.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error);
          });
        });
    },
  });
  return { formik };
};
