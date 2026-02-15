import { Suspense } from "react"
import OfertasClient from "./OfertasClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Cargando ofertas...</div>}>
      <OfertasClient />
    </Suspense>
  )
}
