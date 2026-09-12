"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";
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
} from "../../../../features/auth/schemas/sign-up.schema";
import {
  signInSchema,
  type SignInFormValues,
} from "../../../../features/auth/schemas/sign-in.schema";

const CONSTITUTION_SECTIONS = [
  { key: "purpose", label: "1. Purpose" },
  { key: "membershipRules", label: "2. Membership Rules" },
  { key: "contributionRules", label: "3. Contribution Rules" },
  { key: "payoutRules", label: "4. Payout Rules" },
  { key: "meetingRules", label: "5. Meeting Rules" },
  { key: "disputeRules", label: "6. Dispute Resolution" },
  {
    key: "constitutionAmendmentRules",
    label: "7. Amendment of the Constitution",
  },
] as const;

export default function JoinStokvelPage(): React.ReactElement {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useGetInviteByCodeQuery(code);
  const dispatch = useAppDispatch();
  const [updateInvite, { isLoading: isUpdating }] = useUpdateInviteMutation();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

  const loader = isUpdating || isSigningIn || isSigningUp;

  const [step, setStep] = useState<"invite" | "auth">("invite");

  const handleUpdateInvite = async (newInviteStatus: string) => {
    try {
      await updateInvite({ code, newInviteStatus }).unwrap();
      toast.success(`Invite ${newInviteStatus}`);
    } catch {
      toast.error("Failed to decline invite");
    }
  };

  const handleAuthSubmit = async (
    values: SignUpFormValues | SignInFormValues,
  ) => {
    let result;
    try {
      // TODO: wire to your actual auth mutations
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

      console.log("Auth result:", result);
      dispatch(setAuth(result));
      if (result) {
        await handleUpdateInvite("accepted");
      }
      toast.success(`Welcome to ${data!.stokvel.name}!`);
      router.push(`/dashboard/group/${data!.stokvel._id}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  const handleDecline = async () => {
    try {
      await handleUpdateInvite("declined");
      toast.success("Invite declined");
      router.push("/");
    } catch {
      toast.error("Failed to decline invite");
    }
  };

  if (isLoading) return <Loader fullPage message="Loading invite…" />;
  if (isError || !data)
    return (
      <div className="p-6">
        <ErrorState
          title="Invalid invite link"
          message="This invite link is invalid or may have been removed."
          onRetry={refetch}
        />
      </div>
    );

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
  // Already joined
  if (data.inviteStatus === "accepted") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto" />
          <h1 className="text-xl font-bold">You&apos;re already a member</h1>
          <p className="text-sm text-slate-500">
            You&apos;ve already accepted this invite to {data.stokvel.name}.
          </p>
          <Button asChild className="w-full">
            <Link href={`/dashboard/group/${data.stokvel._id}`}>
              Go to group
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  // ── STEP 2: authenticate (password only; everything else readonly) ──
  if (step === "auth") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <Card className="max-w-md w-full p-8 space-y-5">
          <div>
            <h1 className="text-xl font-bold">
              {data.hasAccount ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {data.hasAccount
                ? "Sign in to accept your invite."
                : "Set a password to join the stokvel."}
            </p>
          </div>

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
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        name="firstName"
                        label="First Name"
                        placeholder="John"
                        readOnly
                      />

                      <FormField
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        readOnly
                      />
                    </div>

                    <FormField
                      name="cellNumber"
                      label="Cellphone Number"
                      type="tel"
                      placeholder="+27821234567"
                      readOnly
                    />
                  </>
                )}

                <FormField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john.doe@example.com"
                  readOnly={true}
                />
                <FormField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                />

                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("invite")}
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1"
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
        </Card>
      </div>
    );
  }

  // ── STEP 1: invite preview ──
  const isDeclined = data.inviteStatus === "declined";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>

        <Card className="p-8 text-center space-y-3">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 mx-auto flex items-center justify-center text-white font-bold text-2xl">
            {data.stokvel.name?.[0] || "S"}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {data.stokvel.name}
          </h1>
          <p className="text-sm text-slate-500">{data.stokvel.description}</p>
        </Card>

        {/* Constitution */}
        <Card className="p-8 space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold">
              Constitution
              {data.constitution ? ` (v${data.constitution.version})` : ""}
            </h2>
          </div>

          {data.constitution ? (
            CONSTITUTION_SECTIONS.map(({ key, label }) => (
              <div key={key}>
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  {label}
                </h3>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  {data.constitution![key]}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">
              This stokvel hasn&apos;t published a constitution yet.
            </p>
          )}
        </Card>

        {/* Disclaimer */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            By choosing to accept and join <strong>{data.stokvel.name}</strong>,
            you agree to uphold the rules listed in the constitution above,
            including contribution, payout, and membership rules.
          </p>
        </div>

        {isDeclined && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            You have declined this invite. If you change your mind, ask the
            stokvel admin to send you a new one.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            disabled={isDeclined}
            onClick={() => setStep("auth")}
          >
            Accept & register
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            disabled={loader}
            onClick={handleDecline}
          >
            {loader ? "Declining…" : "Decline invite"}
          </Button>
        </div>
      </div>
    </div>
  );
}
