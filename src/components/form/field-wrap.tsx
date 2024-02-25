// outsource dependencies
import cn from 'classnames';
import { FC, ReactNode, memo, HTMLAttributes } from 'react';

// configure
type FieldWrapProps = {
  id: string,
  valid: boolean,
  invalid: boolean,
  label?: ReactNode,
  explanation?: ReactNode,
  description?: ReactNode,
  children: ReactNode | null,
  success?: string | undefined,
  className?: string | undefined,
  error?: string | null | undefined,
  classNameLabel?: string | undefined,
  classNameInputWrap?: string | undefined,
  inputWrapProps?: HTMLAttributes<HTMLDivElement>,
}

// Show description, label and form error using prepared components
export const FieldWrap: FC<FieldWrapProps> = memo((props:FieldWrapProps) => {
  const {
    success, error, description, explanation, label, className,
    inputWrapProps, valid, invalid, id, children, classNameLabel, classNameInputWrap
  } = props;
  return <div className={className}>
    { label && <label htmlFor={id} className={classNameLabel}>
      { label }
    </label> }
    { explanation }
    <div className={cn('relative', classNameInputWrap)} {...inputWrapProps}>
      { children }
    </div>
    { invalid && <p id={id} className="d-block text-secondary text-sm">
      { error }
    </p> }
    { valid && <p id={id} className="d-block text-green-600 text-sm">{ success }</p> }
    { description }
  </div>;
});

FieldWrap.defaultProps = {
  error: null,
  success: '',
  label: null,
  className: '',
  explanation: null,
  description: null,
  classNameLabel: '',
  classNameInputWrap: '',
  inputWrapProps: undefined,
};
