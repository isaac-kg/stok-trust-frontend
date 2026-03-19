"use client";

import { useField, useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export function FormField({ name, label, type = 'text', placeholder }: FormFieldProps): React.ReactElement {
  const [field, meta] = useField(name);
  const { submitCount } = useFormikContext();
  const hasError = Boolean(meta.error) && (meta.touched || submitCount > 0);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...field}
        className={hasError ? 'border-destructive' : ''}
      />
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}
