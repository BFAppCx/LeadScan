import { AuthCard } from "@/components/auth/auth-card";

type AuthPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;

  return <AuthCard callbackError={params?.error === "callback"} />;
}
