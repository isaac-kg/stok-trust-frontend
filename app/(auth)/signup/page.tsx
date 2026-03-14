import { SignUpForm } from '@/features/auth/components/sign-up-form';

export default function SignUpPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding/Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 opacity-90" />
        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-white">Join StokTrust</h1>
          <p className="text-lg text-white/90">
            Create your account today and start managing your stock portfolio with confidence.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
