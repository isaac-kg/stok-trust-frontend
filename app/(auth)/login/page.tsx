import { SignInForm } from '@/features/auth/components/sign-in-form';

export default function LoginPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignInForm />
    </div>
  );
}
