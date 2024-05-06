// outsource dependencies
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { memo, useCallback, useMemo } from 'react';
import { Form, Formik, useFormikContext } from 'formik';
import { FileRejection, useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/react/24/outline';

// local dependencies
import { FInput } from '@/components/form/input.tsx';
import { SubmitPayload, useController, useControllerState } from './controller.ts';

// assets
import logo from '@/assets/logo.svg';
import userImage from '@/assets/user.png';
import signUpImage from '@/assets/sign-up.png';

// configure
const initialValues = {
  email: '',
  password: '',
  avatar: null,
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
  const { setFieldValue, values } = useFormikContext<SubmitPayload>();

  const banner = useMemo(() => !values.avatar ? null : URL.createObjectURL(values.avatar), [values.avatar]);

  const onDrop = useCallback(async (accepted:Array<File>, rejected:Array<FileRejection>) => {
    if (!rejected?.length) {
      await setFieldValue('avatar', accepted[0]);
    } else {
      const getErrorMessage = (rejected: Array<FileRejection>) => {
        return rejected.map(({ file, errors }) => {
          switch (errors[0].code) {
            case 'file-invalid-type':
              return `File has type ${file.type} which is not supported"`;
            case 'file-too-large':
              return 'File is too large';
            default:
              return errors[0].message;
          }
        }).join(', ');
      };
      toast.error(getErrorMessage(rejected));
    }
  }, [setFieldValue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    disabled,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 15,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    validator: file => {
      const condition = /(\.jpg|\.jpeg|\.png)$/i;
      if (!condition.test(file.name)) { return { message: 'ERROR', code: 'file-invalid-type', }; }
      return null;
    }
  });

  return <Form>
    <div className="flex justify-center items-center">
      <div className="relative group">
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden flex items-center justify-center relative border border-grey-400">
          <img src={banner || userImage} alt="profile image" width="130" height="130" className="h-full w-auto object-cover"/>
          <button type="button" disabled={disabled} className="absolute top-0 left-0 flex justify-center items-center w-full h-full opacity-0 group-hover:opacity-100 transition bg-black/50" {...getRootProps()}>
            <ArrowUpTrayIcon className="w-10 h-10 text-white"/>
          </button>
        </div>
        <button type="button" disabled={disabled} className="absolute mb-2 mr-2 bottom-0 right-0 flex justify-center items-center !p-1 btn-primary !rounded-full" {...getRootProps()}>
          <PhotoIcon className="w-5 h-5 text-white"/>
        </button>
      </div>
      <input name="userImageUpload" id="userImageUpload-file-input" {...getInputProps()} />
    </div>
    <FInput name="firstName" type="text" label="First name" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-3" placeholder="First name"/>
    <FInput name="lastName" type="text" label="Last name" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-3" placeholder="Last name"/>
    <FInput name="email" type="email" label="Email" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-3" placeholder="example@example.com"/>
    <FInput name="occupation" type="text" label="Occupation" disabled={disabled} classNameLabel="text-sm font-medium" classNameFormGroup="mb-3" placeholder="Occupation"/>
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
      <p className="max-md:order-2">Already have an account? <Link to="/auth/login" className="text-blue-600 transition hover:text-blue-600/70 active:text-blue-600">login</Link></p>
      <button disabled={disabled} type="submit" className="btn-primary">Submit</button>
    </div>
  </Form>;
});
