"use client";

import { Formik, Form } from 'formik';
import { profileEditSchema, type ProfileEditFormValues } from '../schemas/profile-edit.schema';
import { FormField } from '@/features/auth/components/form-field';
import { Button } from '@/components/ui/button';

export interface ProfileEditFormProps {
  initialValues: ProfileEditFormValues;
  onCancel: () => void;
  onSubmit: (values: ProfileEditFormValues) => void | Promise<void>;
}

export function ProfileEditForm({
  initialValues,
  onCancel,
  onSubmit,
}: ProfileEditFormProps): React.ReactElement {
  return (
    <Formik<ProfileEditFormValues>
      initialValues={initialValues}
      validationSchema={profileEditSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ isSubmitting }) => (
        <Form className="mt-4 space-y-4">
          <FormField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="0821234567"
          />
          <div>
            <FormField
              name="nationalIdNumber"
              label="National ID Number"
              type="text"
              placeholder="Enter your SA ID number"
            />
            <p className="mt-1 text-xs text-muted-foreground sm:w-full">
              Your ID is stored securely and only the last 4 digits are shown to others.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
