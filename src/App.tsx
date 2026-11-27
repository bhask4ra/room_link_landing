import { useEffect, useRef, useState } from "react";
import {
  ChatsCircle,
  Heart,
  HouseLine,
  UsersThree,
} from "@phosphor-icons/react";
import ImmersiveTour from "./tour/ImmersiveTour";
import { InfoDialog, type DialogKind } from "./components/InfoDialog";

export const ROOMLINK_LOGIN_URL =
  "https://roomlink-prod-xdg80v.canadacentral.cloudapp.azure.com/login";

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
  const [dialog, setDialog] = useState<DialogKind>(null);
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
            <img src="/roomlink-logo.svg" alt="" width={40} height={35} />
          </span>
          roomlink<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#sala">El recorrido</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#preguntas">Preguntas</a>
        </nav>
        <a className="button button-dark header-cta" href={ROOMLINK_LOGIN_URL}>
          Conoce RoomLink
        </a>
      </header>
      <main id="contenido">
        <ImmersiveTour loginUrl={ROOMLINK_LOGIN_URL} />
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
          <a className="button button-dark" href={ROOMLINK_LOGIN_URL}>
            Encuentra tu próximo capítulo
          </a>
          <span className="caption">Conoce el proyecto RoomLink</span>
        </section>
      </main>
      <footer>
        <a className="brand" href="#bienvenido">
          <span className="brand-icon">
            <img src="/roomlink-logo.svg" alt="" width={32} height={28} />
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
