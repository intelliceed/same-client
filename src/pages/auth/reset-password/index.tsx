// outsource dependencies
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { memo, useCallback, useMemo } from 'react';

// local dependencies
import { FInput } from '@/components/form/input.tsx';
import { SubmitPayload, useController, useControllerState } from './controller.ts';

// assets
import logo from '@/assets/logo.svg';
import signUpImage from '@/assets/sign-up.png';

// configure
const initialValues = {
  password: '',
  confirmPassword: '',
};

const ResetPassword = memo(() => {
  const [, { submit }] = useController();

  const validationSchema = useMemo(() => yup.object().shape({
    password: yup.string()
      .nullable()
      .required('Something is missing')
      .min(8, '${min} characters is minimum'),
    confirmPassword: yup.string()
      .nullable()
      .required('Something is missing')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  }), []);

  const handleSubmit = useCallback((values:SubmitPayload) => submit(values), [submit]);

  return <div className="flex flex-col flex-grow min-h-screen">
    <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
      <div className="p-10 flex flex-col flex-grow">
        <Link to="/">
          <img src={logo} alt="samefame" width="130" height="78"/>
        </Link>
        <div className="flex flex-col flex-grow justify-center items-center py-10">
          <div className="w-full xl:w-[58%]">
            <h1 className="text-2xl font-semibold mb-10">Reset password</h1>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              <ResetPasswordForm/>
            </Formik>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow max-md:hidden bg-blue-600/80 justify-end">
        <img src={signUpImage} width="960" height="700" alt="sign-up" className="w-full h-auto"/>
      </div>
    </div>
  </div>;
});

export default ResetPassword;

const ResetPasswordForm = memo(() => {
  const { disabled } = useControllerState();

  return <Form>
    <FInput
      name="password"
      type="password"
      label="Password"
      disabled={disabled}
      placeholder="********"
      classNameFormGroup="mb-3"
      classNameLabel="text-sm font-medium"
    />
    <FInput
      type="password"
      disabled={disabled}
      name="confirmPassword"
      placeholder="********"
      label="Confirm password"
      classNameFormGroup="mb-3"
      classNameLabel="text-sm font-medium"
    />
    <div className="flex justify-between md:gap-x-2 max-md:gap-y-4 max-md:flex-col md:items-start">
      <p className="max-md:order-2">Create new password for your account</p>
      <button disabled={disabled} type="submit" className="btn-primary max-md:order-1">Send</button>
    </div>
  </Form>;
});

