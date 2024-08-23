import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import FileUploaderTest from "@/components/custom/upload-xlsx";

export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-zinc-900 relative text-white">
        <p className="absolute top-0 right-0">Hello {data.user.email}</p>
        <div>
          <div>
            {/* <FileUploaderTest /> */}
          </div>
        </div>
      </div>
    </>
  );
}