// outsource dependencies
import * as yup from 'yup';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { memo, useCallback, useMemo, Fragment, useEffect, useState } from 'react';

// local dependencies
import { FInput } from '@/components/form/input.tsx';
import { SubmitPayload, useController, useControllerState } from './controller.ts';

// assets
import logo from '@/assets/logo.svg';
import signUpImage from '@/assets/sign-up.png';

// configure
const initialValues = {
  email: '',
};

const ForgotPassword = memo(() => {
  const [, { submit, initialize, clear }] = useController();

  const validationSchema = useMemo(() => yup.object().shape({
    email: yup.string()
      .nullable()
      .email('Invalid email')
      .required('Something is missing'),
  }), []);

  const handleSubmit = useCallback((values:SubmitPayload) => submit(values), [submit]);

  useEffect(() => {
    initialize();
    return clear;
  }, [clear, initialize]);

  return <div className="flex flex-col flex-grow min-h-screen">
    <LinkDialog/>
    <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
      <div className="p-10 flex flex-col flex-grow">
        <Link to="/">
          <img src={logo} alt="samefame" width="130" height="78"/>
        </Link>
        <div className="flex flex-col flex-grow justify-center items-center py-10">
          <div className="w-full xl:w-[58%]">
            <h1 className="text-2xl font-semibold mb-10">Forgot password</h1>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              <ForgotPasswordForm/>
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

export default ForgotPassword;

const ForgotPasswordForm = memo(() => {
  const { disabled, link } = useControllerState();

  return <Form>
    <FInput name="email" type="email" label="Email" disabled={disabled || Boolean(link)} classNameLabel="text-sm font-medium" classNameFormGroup="mb-6" placeholder="example@example.com"/>
    <div className="flex justify-between md:gap-x-2 max-md:gap-y-4 max-md:flex-col md:items-start">
      <p className="max-md:order-2">Haven&apos;t created an account yet? <Link to="/auth/register" className="text-blue-600 transition hover:text-blue-600/70 active:text-blue-600">register</Link></p>
      <button disabled={disabled || Boolean(link)} type="submit" className="btn-primary max-md:order-1">Send</button>
    </div>
  </Form>;
});

const LinkDialog = memo(() => {
  const { link } = useControllerState();
  const [show, setShow] = useState(false);

  const close = () => setShow(false);

  useEffect(() => { setShow(Boolean(link)); }, [link]);

  return <Transition appear show={show} as={Fragment} >
    <Dialog as="div" className="relative z-10" onClose={close}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/25" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Reset password</Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">
                  Use button below to reset your password
                </p>
                <Link
                  onClick={close}
                  to={link || '/auth/forgot-password'}
                  className="mb-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Reset password
                </Link>
                <p className="text-sm text-gray-500 mb-2">
                  Or copy and paste link to browser tab
                </p>
                <p className="text-sm text-blue-500 break-words">{ link }</p>
              </div>

              <div className="mt-4 flex">
                <button
                  type="button"
                  onClick={close}
                  className="ml-auto inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Got it, thanks!
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>;
});
