export default function Hero() {
  return (
    <section className="grid lg:grid-cols-[2fr_1fr] gap-5 items-start">
      <div className="relative h-[340px] rounded-[14px] overflow-hidden flex items-end p-4">
        
        {/* IMAGEN */}
        <img
          src="/imagenes/home_hero.png"
          alt="Evento del campus"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAY OSCURO */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

        {/* BADGE */}
        <div className="relative z-10">
          <span className="bg-primary text-white font-bold px-3 py-1 rounded-md">
            EN DIRECTO
          </span>
        </div>
      </div>

      {/* TEXTO DERECHO */}
      <div>
        <div className="uppercase tracking-widest text-xs text-muted font-semibold">
          Campus News
        </div>

        <h2 className="text-2xl mt-2 leading-tight">
          Actividades del campus: Feria tecnológica y charlas
        </h2>

        <p className="text-sm text-muted mt-2 line-clamp-4">
          El centro IFP acogerá el próximo 15 de marzo una jornada formativa centrada en nuevas tecnologías, que tendrá lugar en el aula magna del campus y estará abierta a todo el alumnado.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[45%] bg-gradient-to-b from-white to-[var(--soft)] p-3 rounded-md border border-[#eef3f6] hover:shadow-md-custom transition-transform">
            <div className="font-extrabold text-sm">Horario y ubicación</div>
            <div className="text-sm text-muted">
              Viernes 12 • Edificio A • Entrada libre
            </div>
          </div>

          <div className="flex-1 min-w-[45%] bg-gradient-to-b from-white to-[var(--soft)] p-3 rounded-md border border-[#eef3f6] hover:shadow-md-custom transition-transform">
            <div className="font-extrabold text-sm">Invitados</div>
            <div className="text-sm text-muted">
              Ponentes, empresas y talleres prácticos
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
