import { Suspense } from "react"
import QuedadasClient from "./QuedadasClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Cargando quedadas...</div>}>
      <QuedadasClient />
    </Suspense>
  )
}
