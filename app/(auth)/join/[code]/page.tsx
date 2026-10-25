"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Shield,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Loader from "@/components/shared/loader";
import ErrorState from "@/components/shared/error-state";
import {
  useGetInviteByCodeQuery,
  useUpdateInviteMutation,
} from "@/features/stokvel/stokvel-api";
import { useSignInMutation, useSignUpMutation } from "@/features/auth/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/features/auth/auth-slice";
import { FormField } from "@/features/auth/components/form-field";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/features/auth/schemas/sign-up.schema";
import {
  signInSchema,
  type SignInFormValues,
} from "@/features/auth/schemas/sign-in.schema";

const CONSTITUTION_SECTIONS = [
  { key: "purpose", label: "Purpose" },
  { key: "membershipRules", label: "Membership" },
  { key: "contributionRules", label: "Contributions" },
  { key: "payoutRules", label: "Payouts" },
  { key: "meetingRules", label: "Meetings" },
  { key: "disputeRules", label: "Disputes" },
  { key: "constitutionAmendmentRules", label: "Amendments" },
] as const;

function PageShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-teal-200/25 blur-3xl" />
      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>
    </div>
  );
}

function BrandBar(): React.ReactElement {
  return (
    <div className="mb-6 flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
        <Shield className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">StokTrust</p>
        <p className="text-[10px] text-slate-500 -mt-0.5">Trusted Stokvels</p>
      </div>
    </div>
  );
}

export default function JoinStokvelPage(): React.ReactElement {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, refetch } = useGetInviteByCodeQuery(code);
  const [updateInvite, { isLoading: isUpdating }] = useUpdateInviteMutation();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  const loader = isUpdating || isSigningIn || isSigningUp;
  const [step, setStep] = useState<"invite" | "auth">("invite");

  async function handleUpdateInvite(newInviteStatus: string): Promise<void> {
    try {
      await updateInvite({ code, newInviteStatus }).unwrap();
    } catch {
      toast.error(
        newInviteStatus === "declined"
          ? "Failed to decline invite"
          : "Failed to accept invite",
      );
      throw new Error("invite update failed");
    }
  }

  async function handleAuthSubmit(
    values: SignUpFormValues | SignInFormValues,
  ): Promise<void> {
    try {
      let result;
      if (data!.hasAccount) {
        result = await signIn({
          email: values.email,
          password: values.password,
        }).unwrap();
      } else {
        result = await signUp({
          firstName: data!.firstName,
          lastName: data!.lastName,
          email: data!.email,
          cellNumber: data!.cellNumber,
          password: values.password,
          role: "user",
        }).unwrap();
      }

      dispatch(setAuth(result));
      await handleUpdateInvite("accepted");
      toast.success(`Welcome to ${data!.stokvel.name}!`);
      router.push(`/dashboard/stokvel/${data!.stokvel._id}`);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Something went wrong. Please try again.");
    }
  }

  async function handleDecline(): Promise<void> {
    try {
      await handleUpdateInvite("declined");
      toast.success("Invite declined");
      router.push("/");
    } catch {
      // toast already shown
    }
  }

  if (isLoading) return <Loader fullPage message="Loading invite…" />;
  if (isError || !data) {
    return (
      <PageShell>
        <BrandBar />
        <ErrorState
          title="Invalid invite link"
          message="This invite link is invalid or may have been removed."
          onRetry={refetch}
        />
      </PageShell>
    );
  }

  const signUpInitialValues: SignUpFormValues = {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    cellNumber: data.cellNumber || "",
    confirmPassword: "",
    password: "",
  };

  const signInInitialValues: SignInFormValues = {
    email: data.email || "",
    password: "",
  };

  if (data.inviteStatus === "accepted") {
    return (
      <PageShell>
        <BrandBar />
        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              You&apos;re already a member
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              You&apos;ve already accepted this invite to{" "}
              <span className="font-medium text-slate-700">
                {data.stokvel.name}
              </span>
              .
            </p>
          </div>
          <div className="p-6">
            <Button asChild className="w-full">
              <Link href={`/dashboard/stokvel/${data.stokvel._id}`}>
                Go to stokvel
              </Link>
            </Button>
          </div>
        </Card>
      </PageShell>
    );
  }

  if (step === "auth") {
    return (
      <PageShell>
        <BrandBar />
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4"
          onClick={() => setStep("invite")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to invite
        </Button>

        <Card className="overflow-hidden border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-6 py-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <UserPlus className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {data.hasAccount ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {data.hasAccount
                ? `Sign in to join ${data.stokvel.name}.`
                : `Set a password to join ${data.stokvel.name}.`}
            </p>
          </div>

          <div className="px-6 py-5">
            <Formik
              initialValues={
                data.hasAccount ? signInInitialValues : signUpInitialValues
              }
              enableReinitialize
              validationSchema={data.hasAccount ? signInSchema : signUpSchema}
              validateOnBlur={true}
              validateOnChange={false}
              onSubmit={handleAuthSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  {!data.hasAccount && (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                          name="firstName"
                          label="First name"
                          placeholder="John"
                        />
                        <FormField
                          name="lastName"
                          label="Last name"
                          placeholder="Doe"
                        />
                      </div>
                      <FormField
                        name="cellNumber"
                        label="Cellphone number"
                        type="tel"
                        placeholder="+27821234567"
                      />
                    </>
                  )}

                  <FormField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                  <FormField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                  />
                  {!data.hasAccount && (
                    <FormField
                      name="confirmPassword"
                      label="Confirm password"
                      type="password"
                      placeholder="Confirm your password"
                    />
                  )}

                  <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:flex-1"
                      onClick={() => setStep("invite")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:flex-1"
                      disabled={isSubmitting || loader}
                    >
                      {isSubmitting || loader
                        ? "Joining…"
                        : data.hasAccount
                          ? "Sign in & join"
                          : "Create account & join"}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </PageShell>
    );
  }

  const isDeclined = data.inviteStatus === "declined";

  return (
    <PageShell>
      <BrandBar />
      <Button variant="ghost" size="sm" className="-ml-2 mb-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card className="mb-4 overflow-hidden border-slate-200/80 shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50/50 px-5 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-xl font-bold text-white shadow-sm">
              {data.stokvel.name?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                You&apos;re invited
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {data.stokvel.name}
              </h1>
              {data.stokvel.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {data.stokvel.description}
                </p>
              )}
              <p className="mt-3 text-xs text-slate-500">
                Invited as{" "}
                <span className="font-medium text-slate-700">
                  {data.firstName} {data.lastName}
                </span>{" "}
                · {data.email}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-4 overflow-hidden border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Constitution
              {data.constitution ? ` · v${data.constitution.version}` : ""}
            </h2>
            <p className="text-xs text-slate-500">
              Rules you agree to when you join
            </p>
          </div>
        </div>

        <div className="space-y-0 px-5 py-2 sm:px-6">
          {data.constitution ? (
            CONSTITUTION_SECTIONS.map(({ key, label }, index) => (
              <div
                key={key}
                className={
                  index < CONSTITUTION_SECTIONS.length - 1
                    ? "border-b border-slate-100 py-4"
                    : "py-4"
                }
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {index + 1}. {label}
                </h3>
                <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {data.constitution![key]}
                </p>
              </div>
            ))
          ) : (
            <p className="py-6 text-sm italic text-slate-400">
              This stokvel hasn&apos;t published a constitution yet.
            </p>
          )}
        </div>
      </Card>

      <div className="mb-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm leading-relaxed text-amber-900">
          By accepting, you agree to follow the rules of{" "}
          <strong>{data.stokvel.name}</strong>, including contributions,
          payouts, and membership.
        </p>
      </div>

      {isDeclined && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          You declined this invite. Ask the admin to send a new one if you
          change your mind.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="w-full flex-1 bg-emerald-600 hover:bg-emerald-700"
          disabled={isDeclined}
          onClick={() => setStep("auth")}
        >
          Accept &amp; continue
        </Button>
        <Button
          variant="outline"
          className="w-full flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={loader || isDeclined}
          onClick={handleDecline}
        >
          {loader ? "Declining…" : "Decline"}
        </Button>
      </div>
    </PageShell>
  );
}
