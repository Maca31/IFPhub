import { Suspense } from "react"
import ReunionesClient from "./ReunionesClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Cargando reuniones...</div>}>
      <ReunionesClient />
    </Suspense>
  )
}
