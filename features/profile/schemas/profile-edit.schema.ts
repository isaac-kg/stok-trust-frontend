import * as Yup from 'yup';

function normalizeSaPhone(value: string): string {
  return value.replace(/\s/g, '');
}

export const profileEditSchema = Yup.object({
  phoneNumber: Yup.string()
    .trim()
    .test(
      'phone',
      'Enter a valid SA phone (e.g. 0821234567 or +27821234567)',
      (val) => {
        if (!val || val.length === 0) return true;
        const n = normalizeSaPhone(val);
        return /^(0\d{9}|\+27\d{9})$/.test(n);
      },
    ),
  nationalIdNumber: Yup.string()
    .trim()
    .test('id', 'SA ID must be exactly 13 digits', (val) => {
      if (!val || val.length === 0) return true;
      return /^\d{13}$/.test(val);
    }),
});

export type ProfileEditFormValues = Yup.InferType<typeof profileEditSchema>;
