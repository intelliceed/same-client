// outsource dependencies
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { memo, useCallback, useMemo } from 'react';

// local dependencies
import { FInput } from '@/components/form/input.tsx';
import { SubmitPayload, useController, useControllerState } from './controller.ts';

// assets
import logo from '@/assets/logo.svg';
import signUpImage from '@/assets/sign-up.png';
import { Link } from 'react-router-dom';

// configure
const initialValues = {
  email: '',
  password: '',
  lastName: '',
  firstName: '',
  occupation: '',
  confirmPassword: '',
};

const SignUp = memo(() => {
  const [, { submit }] = useController();

  const validationSchema = useMemo(() => yup.object().shape({
    email: yup.string()
      .nullable()
      .email('Invalid email')
      .required('Something is missing'),
    firstName: yup.string()
      .nullable()
      .required('Something is missing')
      .min(2, '${min} characters is minimum'),
    lastName: yup.string()
      .nullable()
      .required('Something is missing')
      .min(2, '${min} characters is minimum'),
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
            <h1 className="text-2xl font-semibold mb-10">Register</h1>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              <SignUpForm/>
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

export default SignUp;

const SignUpForm = memo(() => {
  const { disabled } = useControllerState();

  return <Form>
    <FInput name="firstName" type="text" label="First name" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-6"/>
    <FInput name="lastName" type="text" label="Last name" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-6"/>
    <FInput name="email" type="email" label="Email" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-6"/>
    <FInput
      name="password"
      type="password"
      label="Password"
      disabled={disabled}
      classNameFormGroup="mb-6"
      classNameLabel="text-sm font-medium"
    />
    <FInput
      type="password"
      disabled={disabled}
      name="confirmPassword"
      label="Confirm password"
      classNameFormGroup="mb-6"
      classNameLabel="text-sm font-medium"
    />
    <div className="flex justify-end">
      <button disabled={disabled} type="submit" className="btn-primary">Submit</button>
    </div>
  </Form>;
});
