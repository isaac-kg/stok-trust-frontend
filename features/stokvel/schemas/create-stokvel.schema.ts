import * as Yup from 'yup';

export const STOKVEL_TYPES = [
  'Savings',
  'Grocery',
  'Investment',
  'Burial',
  'Other',
] as const;

export const CONTRIBUTION_FREQUENCIES = [
  'Weekly',
  'Bi-Weekly',
  'Monthly',
  'Quarterly',
] as const;

export const createStokvelSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name is too short')
    .required('Stokvel name is required'),
  type: Yup.string()
    .oneOf([...STOKVEL_TYPES], 'Select a stokvel type')
    .required('Select a stokvel type'),
  description: Yup.string().trim().default(''),
  scope: Yup.string().oneOf(['Local', 'National']).required(),
  province: Yup.string().when('scope', {
    is: 'Local',
    then: (schema) => schema.required('Province is required for local stokvels'),
    otherwise: (schema) => schema.optional(),
  }),
  city: Yup.string().when('scope', {
    is: 'Local',
    then: (schema) => schema.trim().required('City or town is required'),
    otherwise: (schema) => schema.optional(),
  }),
  locationDescription: Yup.string().trim().default(''),
  defaultContributionAmount: Yup.string()
    .required('Contribution amount is required')
    .test('amount', 'Enter a valid positive amount', (val) => {
      if (val === undefined || val === '') return false;
      const n = Number(String(val).replace(/,/g, ''));
      return !Number.isNaN(n) && n > 0;
    }),
  contributionFrequency: Yup.string()
    .oneOf([...CONTRIBUTION_FREQUENCIES])
    .required(),
  isNasasaRegistered: Yup.boolean().default(false),
  nasasaRegistrationNumber: Yup.string().when('isNasasaRegistered', {
    is: true,
    then: (schema) =>
      schema.trim().required('NASASA registration number is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

export type CreateStokvelFormValues = Yup.InferType<typeof createStokvelSchema>;
