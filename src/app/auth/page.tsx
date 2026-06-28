import { AuthCard } from "@/components/auth/auth-card";
import { getAuthViewState } from "@/server/leadcard-auth";

type AuthPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const auth = await getAuthViewState();

  return <AuthCard callbackError={params?.error === "callback"} runtime={auth.runtime} />;
}
