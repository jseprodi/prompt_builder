interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ id, label, hint, required, children }: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="required-mark" aria-hidden="true"> *</span> : null}
      </label>
      {hint ? (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}
