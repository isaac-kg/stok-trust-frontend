"use client";

import { useField } from 'formik';
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
  const hasError = meta.touched && meta.error;

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
