import { Suspense } from "react";
import CitasClient from "./citas-client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CitasClient />
    </Suspense>
  );
}
