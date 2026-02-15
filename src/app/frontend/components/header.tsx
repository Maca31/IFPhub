import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-4 bg-card rounded-[14px] p-4 flex items-center justify-between shadow-md-custom backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        <Link href="/">
          <div className="w-12 h-12 rounded-[14px] bg-primary text-white flex items-center justify-center font-extrabold cursor-pointer">N</div>
        </Link>

        <div>
          <div className="font-bold text-sm">Noticias — Campus</div>
          <div className="text-xs text-muted">Portal de noticias y eventos</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/search">
          <input
            aria-label="Buscar noticias"
            placeholder="Buscar noticias, eventos..."
            className="w-64 max-w-[40vw] p-2 rounded-md border border-[#dde5ea] bg-[#f9fcfd] cursor-pointer focus:outline-none"
            readOnly
          />
        </Link>

        <Link href="/detail">
          <button className="px-4 py-2 rounded-md font-bold bg-accent text-white hover:opacity-90">Publicar</button>
        </Link>
      </div>
    </header>
  )
}