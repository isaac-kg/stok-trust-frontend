"use client";

import { Formik, Form, useField, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Wallet,
  ShoppingCart,
  TrendingUp,
  Heart,
  MoreHorizontal,
  MapPin,
  Globe,
  Navigation,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/features/auth/components/form-field";
import { cn } from "@/lib/utils";
import {
  createStokvelSchema,
  type CreateStokvelFormValues,
} from "../schemas/create-stokvel.schema";
import { useCreateStokvelMutation } from "../stokvel-api";
import { mapFormValuesToCreateStokvelRequest } from "../map-create-stokvel-request";
import { toast } from "sonner";

const groupTypes = [
  {
    value: "Savings",
    label: "Savings",
    icon: Wallet,
    description: "Pool money for future goals",
    color: "emerald",
  },
  {
    value: "Grocery",
    label: "Grocery",
    icon: ShoppingCart,
    description: "Bulk buying power",
    color: "blue",
  },
  {
    value: "Investment",
    label: "Investment",
    icon: TrendingUp,
    description: "Grow wealth together",
    color: "purple",
  },
  {
    value: "Burial",
    label: "Burial",
    icon: Heart,
    description: "Support in difficult times",
    color: "rose",
  },
  {
    value: "Other",
    label: "Other",
    icon: MoreHorizontal,
    description: "Custom purpose",
    color: "slate",
  },
] as const;

const initialValues: CreateStokvelFormValues = {
  name: "",
  description: "",
  type: "" as CreateStokvelFormValues["type"],
  scope: "Local",
  province: "",
  city: "",
  locationDescription: "",
  defaultContributionAmount: "",
  contributionFrequency: "Monthly",
  isNasasaRegistered: false,
  nasasaRegistrationNumber: "",
};

function FormTextareaField({
  name,
  label,
  placeholder,
  rows = 3,
}: {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}): React.ReactElement {
  const [field, meta] = useField(name);
  const { submitCount } = useFormikContext();
  const hasError = Boolean(meta.error) && (meta.touched || submitCount > 0);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        {...field}
        className={cn(hasError && "border-destructive")}
      />
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}

function FormSelectField({
  name,
  label,
  placeholder,
  children,
}: {
  name: string;
  label: string;
  placeholder: string;
  children: React.ReactNode;
}): React.ReactElement {
  const [field, meta, helpers] = useField(name);
  const { submitCount } = useFormikContext();
  const hasError = Boolean(meta.error) && (meta.touched || submitCount > 0);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select
        value={field.value ? String(field.value) : undefined}
        onValueChange={(v) => {
          // setTouched(true) defaults to shouldValidate=true in Formik and can re-validate before
          // the new value is applied, flashing "required". Update value + validate, then touch without re-validating.
          void helpers.setValue(v, true);
          void helpers.setTouched(true, false);
        }}
      >
        <SelectTrigger id={name} className={cn(hasError && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}

function ContributionAmountField(): React.ReactElement {
  const [field, meta] = useField("defaultContributionAmount");
  const { submitCount } = useFormikContext();
  const hasError = Boolean(meta.error) && (meta.touched || submitCount > 0);

  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Default Contribution Amount (Rands) *</Label>
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          R
        </span>
        <Input
          id="amount"
          type="number"
          min={0}
          step="0.01"
          placeholder="500"
          {...field}
          className={cn("pl-8", hasError && "border-destructive")}
        />
      </div>
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}

export function CreateStokvelForm(): React.ReactElement {
  const router = useRouter();
  const [createStokvel] = useCreateStokvelMutation();

  async function handleSubmit(values: CreateStokvelFormValues): Promise<void> {
    const body = mapFormValuesToCreateStokvelRequest(values);
    try {
      const result = await createStokvel(body).unwrap();
      console.log("Result: ", result);
      toast.success("Stokvel created");
      return;
      const nextId = result.id?.trim() ? result.id : "new";
      router.push(`/dashboard/constitution-builder/${encodeURIComponent(nextId)}`);
    } catch {
      toast.error("Could not create stokvel", {
        description: "Check your details and try again.",
      });
    }
  }

  return (
    <Formik<CreateStokvelFormValues>
      initialValues={initialValues}
      validationSchema={createStokvelSchema}
      validateOnBlur={true}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Group Details
            </h2>

            <div className="space-y-4">
              <FormField
                name="name"
                label="Stokvel Name"
                placeholder="e.g., Soweto Sisters Savings"
              />

              <FormSelectField
                name="type"
                label="Stokvel Type"
                placeholder="Select stokvel type"
              >
                {groupTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </FormSelectField>

              <FormTextareaField
                name="description"
                label="Description"
                placeholder="Tell members what this stokvel is about..."
              />

              <div>
                <Label>Stokvel Scope</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setFieldValue("scope", "Local")}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                      values.scope === "Local"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    <Navigation className="h-6 w-6 text-emerald-600" />
                    <div className="text-center">
                      <p className="font-medium text-sm">Local</p>
                      <p className="text-xs text-slate-500">
                        Specific region/city
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFieldValue("scope", "National")}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                      values.scope === "National"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300",
                    )}
                  >
                    <Globe className="h-6 w-6 text-blue-600" />
                    <div className="text-center">
                      <p className="font-medium text-sm">National</p>
                      <p className="text-xs text-slate-500">
                        Across South Africa
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {values.scope === "Local" && (
                <div className="space-y-4">
                  <FormSelectField
                    name="province"
                    label="Province/Region"
                    placeholder="Select province"
                  >
                    <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                    <SelectItem value="Free State">Free State</SelectItem>
                    <SelectItem value="Gauteng">Gauteng</SelectItem>
                    <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                    <SelectItem value="Limpopo">Limpopo</SelectItem>
                    <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                    <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                    <SelectItem value="North West">North West</SelectItem>
                    <SelectItem value="Western Cape">Western Cape</SelectItem>
                  </FormSelectField>

                  <CityField />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="location">
                  Additional Location Details (Optional)
                </Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <LocationDescriptionInput />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Contribution Settings
            </h2>

            <div className="space-y-4">
              <ContributionAmountField />

              <FormSelectField
                name="contributionFrequency"
                label="Contribution Frequency"
                placeholder="Select frequency"
              >
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
              </FormSelectField>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              NASASA Registration
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  Registered with NASASA?
                </p>
                <p className="text-sm text-slate-500">
                  National Stokvel Association of South Africa
                </p>
              </div>
              <NasasaSwitch />
            </div>

            {values.isNasasaRegistered && (
              <div className="mt-4">
                <FormField
                  name="nasasaRegistrationNumber"
                  label="NASASA Registration Number"
                  placeholder="Enter registration number"
                />
              </div>
            )}
          </Card>

          <div className="flex gap-3 justify-end">
            <Button type="submit" disabled={isSubmitting}>
              Create & Set Up Constitution
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function CityField(): React.ReactElement {
  const [field, meta] = useField("city");
  const { submitCount } = useFormikContext();
  const hasError = Boolean(meta.error) && (meta.touched || submitCount > 0);

  return (
    <div className="space-y-2">
      <Label htmlFor="city">City/Town</Label>
      <div className="relative mt-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          id="city"
          placeholder="e.g., Johannesburg, Soweto"
          {...field}
          className={cn("pl-9", hasError && "border-destructive")}
        />
      </div>
      {hasError && (
        <p className="text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}

function LocationDescriptionInput(): React.ReactElement {
  const [field, meta] = useField("locationDescription");
  const { submitCount } = useFormikContext();
  const hasError = Boolean(meta.error) && (meta.touched || submitCount > 0);

  return (
    <Input
      id="location"
      placeholder="e.g., Meeting at Community Hall"
      {...field}
      className={cn("pl-9", hasError && "border-destructive")}
    />
  );
}

function NasasaSwitch(): React.ReactElement {
  const [field, , helpers] = useField("isNasasaRegistered");
  const { setFieldValue } = useFormikContext();

  return (
    <Switch
      checked={Boolean(field.value)}
      onCheckedChange={(checked) => {
        void helpers.setValue(checked);
        if (!checked) {
          void setFieldValue("nasasaRegistrationNumber", "");
        }
      }}
    />
  );
}
