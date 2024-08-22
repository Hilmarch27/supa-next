import { Button } from "@/components/ui/button";
import { signOut } from "./login/actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={signOut}>
        <Button>Logout</Button>
      </form>
    </main>
  );
}
