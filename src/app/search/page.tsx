// src/app/search/page.tsx
import Header from '../frontend/components/header'
import Sidebar from '../frontend/components/sidebar-noticias'

export default function SearchPage() {
  const resultados = [
    {
      title: 'Investigadores del campus desarrollan sistema de IA para análisis ambiental',
      desc: 'El nuevo modelo utiliza datos satelitales para predecir contaminación y cambio climático.',
      meta: 'Publicado el 6 noviembre 2025 • Categoría: Tecnología'
    },
    {
      title: 'Seminario sobre Inteligencia Artificial aplicada a la educación',
      desc: 'Docentes y expertos compartieron experiencias sobre herramientas de IA en el aula.',
      meta: 'Publicado el 3 noviembre 2025 • Categoría: Educación'
    },
    {
      title: 'Club de programación organiza hackathon centrado en IA generativa',
      desc: 'Participarán más de 200 estudiantes de distintas facultades.',
      meta: 'Publicado el 29 octubre 2025 • Categoría: Innovación'
    }
  ]

  return (
    <main className="wrap">
      <Header />

      <section className="bg-card rounded-[14px] shadow-md p-7 mt-10">
        <h2 className="text-2xl font-extrabold mb-5">
          Resultados para: <span className="text-accent">“Inteligencia Artificial”</span>
        </h2>

        <div className="flex flex-wrap gap-4 items-center">
          <label>
            Desde <input type="date" className="p-2 rounded-lg border border-gray-300" />
          </label>
          <label>
            Hasta <input type="date" className="p-2 rounded-lg border border-gray-300" />
          </label>
          <select className="p-2 rounded-lg border border-gray-300">
            <option>Ordenar por relevancia</option>
            <option>Más recientes</option>
            <option>Más leídas</option>
          </select>
          <button className="bg-accent text-white font-bold px-5 py-2 rounded-lg hover:opacity-90 transition">
            Filtrar
          </button>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          {resultados.map((r) => (
            <div key={r.title} className="flex gap-4 bg-card p-4 rounded-lg border border-[#eef3f6] shadow-sm hover:shadow-md transition-transform">
              <div className="w-36 h-24 rounded-lg bg-gradient-to-br from-[var(--soft)] to-[#ffeaf0]" />
              <div className="flex flex-col justify-center">
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <p className="text-gray-700 text-sm">{r.desc}</p>
                <div className="text-muted text-xs">{r.meta}</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="sidebar">
          <Sidebar />
        </aside>
      </div>

      <footer className="mt-10 text-center text-sm text-muted border-t pt-4">
        © 2025 Portal Noticias — Diseño Pro++
      </footer>
    </main>
  )
}