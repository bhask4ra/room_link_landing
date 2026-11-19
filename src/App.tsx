import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  Check,
  ChatsCircle,
  Heart,
  HouseLine,
  Leaf,
  Pause,
  Play,
  Sparkle,
  Sun,
  UsersThree,
} from "@phosphor-icons/react";
import { useJourney } from "./tour/useJourney";
import { RentCalculator } from "./components/RentCalculator";
import { InfoDialog, type DialogKind } from "./components/InfoDialog";

const ApartmentWorld = lazy(() => import("./tour/ApartmentWorld"));
const rooms = [
  { id: "bienvenido", label: "La entrada", short: "Entrada" },
  { id: "sala", label: "La sala", short: "Sala" },
  { id: "cocina", label: "La cocina", short: "Cocina" },
  { id: "habitacion", label: "Tu habitación", short: "Habitación" },
  { id: "balcon", label: "El balcón", short: "Balcón" },
];
const faqs = [
  [
    "¿Qué es RoomLink?",
    "Es una app en desarrollo para encontrar roomies, conocer sus hábitos y explorar opciones de vivienda compartida. La idea es ayudarte a encontrar tanto un espacio como personas con quienes vivir.",
  ],
  [
    "¿Cómo encuentro personas compatibles conmigo?",
    "El proyecto incluye un perfil y un cuestionario de hábitos y preferencias. Las recomendaciones ayudan a iniciar la conversación; conocer a la otra persona sigue siendo esencial.",
  ],
  [
    "¿Puedo conversar con un posible roomie?",
    "Sí, el proyecto incluye mensajería para hablar con posibles roomies dentro de la app y conocer mejor sus expectativas antes de tomar una decisión.",
  ],
  [
    "¿Las rentas y los perfiles que veo aquí son reales?",
    "No. El departamento, los personajes, los perfiles y las cifras de esta landing son ejemplos ilustrativos. No son anuncios disponibles ni estadísticas del mercado.",
  ],
  [
    "¿Y si todavía no tengo un departamento?",
    "La propuesta de RoomLink contempla conocer posibles roomies y explorar opciones de vivienda. Las opciones concretas dependerán de los anuncios y personas disponibles en la app.",
  ],
  [
    "¿RoomLink garantiza una buena convivencia?",
    "No. La compatibilidad es una ayuda para conocerse, no una garantía. Conversar sobre costos, horarios, visitas y responsabilidades permite decidir con más información.",
  ],
];

function Tagline() {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;
    let frame = 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      frame = 0;
      const rect = heading.getBoundingClientRect();
      const amount = media.matches
        ? 1
        : Math.max(
            0,
            Math.min(
              1,
              (window.innerHeight * 0.92 - rect.top) /
                (window.innerHeight * 0.45),
            ),
          );
      const words = heading.querySelectorAll<HTMLElement>("span");
      words.forEach((word, i) => {
        word.style.opacity = amount >= (i + 1) / words.length ? "1" : ".3";
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);
  return (
    <h2
      className="tagline heading-1"
      ref={ref}
      aria-label="Compartir la renta. Encontrar tu gente."
    >
      <span aria-hidden="true">Compartir </span>
      <span aria-hidden="true">la </span>
      <span aria-hidden="true">renta.</span>
      <br />
      <span aria-hidden="true">Encontrar </span>
      <span aria-hidden="true">tu </span>
      <span className="green-word" aria-hidden="true">
        gente.
      </span>
    </h2>
  );
}

export default function App() {
  const { container, progress, stage, reducedMotion } = useJourney();
  const [paused, setPaused] = useState(false);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const openApp = () => setDialog("app");
  if (
    window.location.pathname !== "/" &&
    window.location.pathname !== "/index.html"
  )
    return (
      <main className="not-found">
        <img src="/favicon.svg" alt="RoomLink" />
        <p className="eyebrow">PARECE QUE ESTA NO ES LA PUERTA</p>
        <h1>Volvamos a casa.</h1>
        <p>La página que buscas no está aquí.</p>
        <a className="button button-dark" href="/">
          Volver al recorrido
        </a>
      </main>
    );
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="site-header">
        <a className="brand" href="#bienvenido" aria-label="RoomLink, inicio">
          <span className="brand-icon">
            <HouseLine size={24} weight="bold" />
          </span>
          roomlink<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#sala">El recorrido</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
        <button className="button button-dark header-cta" onClick={openApp}>
          Conoce RoomLink
        </button>
      </header>
      <main id="contenido">
        <div className="tour" ref={container}>
          <div className="world-shell">
            <div className="world-halo" aria-hidden="true" />
            <Suspense
              fallback={
                <div
                  className="world-loading"
                  aria-label="Preparando la visita"
                >
                  <div />
                  <p>Estamos abriendo la puerta…</p>
                </div>
              }
            >
              <ApartmentWorld
                progress={progress}
                reducedMotion={reducedMotion || paused}
              />
            </Suspense>
            <div className="world-topline">
              <span>
                <span className="live-dot" /> UN HOGAR POR IMAGINAR
              </span>
              <span className="world-address">Visita virtual · RoomLink</span>
            </div>
            <div className="scene-caption" aria-hidden="true">
              <span className="scene-caption-icon">
                <HouseLine size={20} />
              </span>
              <div>
                <strong>{rooms[stage].label}</strong>
                <span>
                  {stage === 0
                    ? "Haz espacio para una nueva historia"
                    : stage === 1
                      ? "Donde las conversaciones empiezan"
                      : stage === 2
                        ? "Los gastos también se comparten"
                        : stage === 3
                          ? "Tu rincón, a tu manera"
                          : "Las pequeñas cosas hacen hogar"}
                </span>
              </div>
            </div>
            <div className="world-controls">
              <span className="caption">
                {String(stage + 1).padStart(2, "0")}{" "}
                <span className="muted">/ 05 espacios</span>
              </span>
              <button
                className="icon-button"
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={
                  paused ? "Reanudar recorrido" : "Fijar vista del departamento"
                }
                disabled={reducedMotion}
              >
                {paused || reducedMotion ? (
                  <Play size={16} />
                ) : (
                  <Pause size={16} />
                )}
              </button>
            </div>
            <nav
              className="room-navigation"
              aria-label="Espacios del departamento"
            >
              {rooms.map((room, i) => (
                <a
                  key={room.id}
                  href={`#${room.id}`}
                  aria-current={stage === i ? "step" : undefined}
                >
                  <span className="room-nav-dot" />
                  {room.short}
                </a>
              ))}
            </nav>
          </div>
          <div className="story">
            <section
              className="tour-section hero"
              id="bienvenido"
              aria-labelledby="hero-title"
            >
              <div className="section-copy">
                <div className="pill">
                  <span className="tiny-sparkle">
                    <Sparkle size={14} weight="fill" />
                  </span>
                  Tu espacio. Tu gente.
                </div>
                <h1 className="heading-1 hero-title" id="hero-title">
                  Un lugar <br />
                  para vivir.
                  <br />
                  <span className="green-word">
                    Personas para <br />
                    compartirlo.
                  </span>
                </h1>
                <p className="lead">
                  Encontrar un depa es solo el comienzo. Encuentra roomies que
                  hagan que se sienta como casa.
                </p>
                <button
                  className="button button-dark hero-cta"
                  onClick={openApp}
                >
                  Encuentra tu próximo capítulo
                </button>
                <div className="hero-note">
                  <span className="avatar-stack" aria-hidden="true">
                    <span className="avatar lavender">M</span>
                    <span className="avatar peach">D</span>
                    <span className="avatar sage">Tú</span>
                  </span>
                  <p>
                    Menos desconocidos.
                    <br />
                    <strong>Más cosas en común.</strong>
                  </p>
                </div>
                <a href="#sala" className="scroll-prompt">
                  <span>
                    <ArrowDown size={18} />
                  </span>
                  Haz scroll. Pasa, estás en casa.
                </a>
              </div>
            </section>
            <section
              className="tour-section"
              id="sala"
              aria-labelledby="sala-title"
            >
              <div className="section-copy">
                <span className="eyebrow">
                  <span className="little-line" /> LA SALA · CONECTAR
                </span>
                <h2 className="heading-2" id="sala-title">
                  El mejor match
                  <br />
                  no es con el sofá.
                </h2>
                <p className="lead">
                  Es con quien se sienta a tu lado. Conoce personas con hábitos,
                  planes y una forma de vivir que combine con la tuya.
                </p>
                <div className="match-card">
                  <div className="match-person">
                    <span className="avatar lavender large">M</span>
                    <div>
                      <strong>Mariana</strong>
                      <span>Le gusta cocinar y trabajar en casa</span>
                    </div>
                    <Heart size={24} weight="duotone" />
                  </div>
                  <div className="match-tags">
                    <span>
                      <Leaf size={14} /> Plantas por todas partes
                    </span>
                    <span>
                      <Sun size={14} /> Mañanas tranquilas
                    </span>
                  </div>
                  <div className="match-stat">
                    <div>
                      <strong>Tu estilo de vida</strong>
                      <span>Un buen punto de partida</span>
                    </div>
                    <div
                      className="affinity-bars"
                      aria-label="Afinidad ilustrativa"
                    >
                      <i />
                      <i />
                      <i />
                      <i />
                      <i className="empty" />
                    </div>
                  </div>
                  <p className="caption">
                    Perfil y afinidad ilustrativos, no resultados reales.
                  </p>
                </div>
                <p className="section-footnote">
                  <ChatsCircle size={18} /> Una buena convivencia empieza con
                  una conversación.
                </p>
              </div>
            </section>
            <section
              className="tour-section"
              id="cocina"
              aria-labelledby="cocina-title"
            >
              <div className="section-copy">
                <span className="eyebrow">
                  <span className="little-line peach-line" /> LA COCINA ·
                  COMPARTIR
                </span>
                <h2 className="heading-2" id="cocina-title">
                  Las cuentas claras.
                  <br />
                  El café, compartido.
                </h2>
                <p className="lead">
                  Más espacio para tus planes. Exploren cuánto podría aportar
                  cada quien antes de elegir dónde vivir.
                </p>
                <RentCalculator />
              </div>
            </section>
            <section
              className="tour-section"
              id="habitacion"
              aria-labelledby="habitacion-title"
            >
              <div className="section-copy">
                <span className="eyebrow">
                  <span className="little-line lavender-line" /> TU HABITACIÓN ·
                  SER TÚ
                </span>
                <h2 className="heading-2" id="habitacion-title">
                  Compartir casa.
                  <br />
                  Conservar tu espacio.
                </h2>
                <p className="lead">
                  Tu playlist, tus horarios, tu rincón favorito. Busca un lugar
                  que se adapte a tu vida, con personas que respeten tu forma de
                  vivir.
                </p>
                <div className="preferences">
                  <span>
                    <Check size={17} /> Tu presupuesto
                  </span>
                  <span>
                    <Check size={17} /> Tu zona favorita
                  </span>
                  <span>
                    <Check size={17} /> Tus propios horarios
                  </span>
                  <span>
                    <Check size={17} /> Espacio para ser tú
                  </span>
                </div>
                <div className="small-note">
                  <HouseLine size={24} />
                  <p>
                    Un hogar compartido.
                    <br />
                    <strong>Un espacio muy tuyo.</strong>
                  </p>
                </div>
              </div>
            </section>
            <section
              className="tour-section"
              id="balcon"
              aria-labelledby="balcon-title"
            >
              <div className="section-copy">
                <span className="eyebrow">
                  <span className="little-line" /> EL BALCÓN · CONVIVIR
                </span>
                <h2 className="heading-2" id="balcon-title">
                  Lo bonito de vivir
                  <br />
                  juntos empieza aquí.
                </h2>
                <p className="lead">
                  Una charla al final del día. Cuidar las plantas. Ponerse de
                  acuerdo. Porque un hogar también se construye con las pequeñas
                  cosas.
                </p>
                <div className="agreement-card">
                  <span className="agreement-sticker">
                    <Heart size={26} weight="duotone" />
                  </span>
                  <strong>Nuestra casa, nuestros acuerdos</strong>
                  <p>
                    <Check size={16} /> Hablamos de gastos desde el inicio
                  </p>
                  <p>
                    <Check size={16} /> Respetamos el tiempo de cada quien
                  </p>
                  <p>
                    <Check size={16} /> Compartimos las responsabilidades
                  </p>
                  <span className="caption">
                    Ejemplo de acuerdos de convivencia
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
        <section className="together-section" id="como-funciona">
          <span className="eyebrow">NO SOLO SE TRATA DE UN DEPARTAMENTO</span>
          <Tagline />
          <p className="lead centered">
            El siguiente paso no tiene que ser en solitario.
          </p>
          <div className="steps-grid">
            <article>
              <span className="step-icon lavender">
                <Heart size={30} weight="duotone" />
              </span>
              <h3>Primero, sé tú.</h3>
              <p>
                Cuenta cómo te gusta vivir, qué buscas y qué hace que un lugar
                se sienta como tuyo.
              </p>
            </article>
            <article>
              <span className="step-icon peach">
                <ChatsCircle size={30} weight="duotone" />
              </span>
              <h3>Encuentra tu gente.</h3>
              <p>
                Explora perfiles, descubre afinidades y conversa con tus
                posibles roomies.
              </p>
            </article>
            <article>
              <span className="step-icon sage">
                <HouseLine size={30} weight="duotone" />
              </span>
              <h3>Imaginen su hogar.</h3>
              <p>
                Exploren opciones y acuerden los detalles de su nueva vida
                compartida.
              </p>
            </article>
          </div>
        </section>
        <section className="faq-section" id="preguntas">
          <div className="faq-intro">
            <span className="eyebrow">ANTES DE TRAER LAS MALETAS</span>
            <h2 className="heading-2">
              Que no queden
              <br />
              dudas en casa.
            </h2>
            <p>
              Un poco más sobre RoomLink
              <br />y este recorrido.
            </p>
            <span className="faq-doodle" aria-hidden="true">
              <ChatsCircle size={72} weight="duotone" />
            </span>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span className="faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta">
          <div className="final-symbol" aria-hidden="true">
            <UsersThree size={50} weight="duotone" />
          </div>
          <span className="eyebrow">HAZ ESPACIO PARA LO QUE VIENE</span>
          <h2 className="heading-2">
            Tu próximo hogar
            <br />
            empieza con tu gente.
          </h2>
          <p>Y quizá esté a una buena conversación de distancia.</p>
          <button className="button button-dark" onClick={openApp}>
            Encuentra tu próximo capítulo
          </button>
          <span className="caption">Conoce el proyecto RoomLink</span>
        </section>
      </main>
      <footer>
        <a className="brand" href="#bienvenido">
          <span className="brand-icon">
            <HouseLine size={20} weight="bold" />
          </span>
          roomlink.
        </a>
        <span className="footer-message">
          Hecho para compartir algo más que la renta.
        </span>
        <div>
          <button onClick={() => setDialog("about")}>
            Acerca de esta demo
          </button>
          <button onClick={() => setDialog("privacy")}>Privacidad</button>
        </div>
      </footer>
      <InfoDialog kind={dialog} onClose={() => setDialog(null)} />
    </>
  );
}
