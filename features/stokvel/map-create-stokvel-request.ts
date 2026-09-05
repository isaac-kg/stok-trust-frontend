import type { CreateStokvelFormValues } from './schemas/create-stokvel.schema';
import type { CreateStokvelRequest } from './model/types';

function buildLocation(values: CreateStokvelFormValues): string {
  const extra = values.locationDescription?.trim();
  if (values.scope === 'Local') {
    const city = values.city?.trim() ?? '';
    const province = values.province?.trim() ?? '';
    const base = [city, province].filter(Boolean).join(', ');
    if (base && extra) return `${base} (${extra})`;
    if (base) return base;
    return extra ?? '';
  }
  return extra?.length ? `South Africa (${extra})` : 'South Africa';
}

export function mapFormValuesToCreateStokvelRequest(
  values: CreateStokvelFormValues,
): CreateStokvelRequest {
  const monthlyContribution = Number(
    String(values.defaultContributionAmount).replace(/,/g, ''),
  );
  const body: CreateStokvelRequest = {
    name: values.name.trim(),
    type: values.type,
    description: values.description?.trim() ?? '',
    location: buildLocation(values),
    monthlyContribution,
  };

  if (values.isNasasaRegistered) {
    const n = values.nasasaRegistrationNumber?.trim();
    if (n) body.nasasaRegistrationNumber = n;
  }

  return body;
}
