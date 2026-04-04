"use client";

import { useField, useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { HTMLInputTypeAttribute, useState } from 'react';

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type as HTMLInputTypeAttribute}
          placeholder={placeholder}
          {...field}
          className={`${hasError ? 'border-destructive' : ''} ${type === 'password' ? 'pr-8' : ''}`}
        />
        {type === 'password' && (
          <Button variant="transparent" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 -mr-2" onClick={(e) => {
            e.preventDefault();
            setShowPassword(!showPassword);
          }}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>


      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}
