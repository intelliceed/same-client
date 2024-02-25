// outsource dependencies
import cn from 'classnames';
import { useField } from 'formik';
import { FC, ReactNode, memo, InputHTMLAttributes } from 'react';

// local dependencies
import { FieldWrap } from './field-wrap.tsx';

// configure
type FInputProps = {
  name: string,
  type?: string,
  success?: string,
  label?: ReactNode,
  bordered?: boolean,
  skipTouch?: boolean,
  explanation?: ReactNode,
  classNameLabel?: string,
  description?: ReactNode,
  classNameFormGroup?: string,
  classNameInputWrap?: string,
} & InputHTMLAttributes<HTMLInputElement>

export const FInput: FC<FInputProps> = memo((props:FInputProps) => {
  const {
    name, type, label, skipTouch, success, description, explanation,
    bordered, classNameLabel, classNameFormGroup, classNameInputWrap, ...attr
  } = props;
  const [field, meta] = useField({ name, type, });
  const invalid = (skipTouch || meta.touched) && !!meta.error;
  const valid = (skipTouch || meta.touched) && !meta.error;

  return <FieldWrap
    label={label}
    valid={valid}
    id={field.name}
    invalid={invalid}
    success={success}
    description={description}
    explanation={explanation}
    className={classNameFormGroup}
    classNameLabel={classNameLabel}
    classNameInputWrap={classNameInputWrap}
    error={skipTouch || meta.touched ? meta.error : null}
  >
    <input
      {...field}
      type={type}
      id={field.name}
      value={field.value || ''}
      className={cn('p-2 block w-full rounded outline-transparent outline-0 transition disabled:bg-grey-200 border relative bg-white text-sm placeholder:text-gray-600 focus:ring-1', {
        'border-secondary focus:border-secondary focus:ring-secondary hover:border-secondary/60': invalid,
        // [`${!bordered ? 'border-transparent' : 'border-green-400'}`]: valid,
        // [`${!bordered ? 'border-transparent' : 'border-gray-400 hover:border-gray-500'} focus:ring-main focus:border-main`]: !invalid && !valid,
        [`${!bordered ? 'border-transparent' : 'border-gray-400 hover:border-gray-500'} focus:ring-main focus:border-main`]: !invalid,
      })}
      {...attr}
    />
  </FieldWrap>;
});

FInput.defaultProps = {
  label: null,
  success: '',
  type: 'text',
  bordered: true,
  skipTouch: false,
  explanation: null,
  description: null,
  classNameLabel: '',
  classNameFormGroup: '',
  classNameInputWrap: 'my-1',
};
