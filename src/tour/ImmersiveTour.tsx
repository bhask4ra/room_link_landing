import {
  lazy,
  Suspense,
  useReducer,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowDown,
  Eye,
  EyeSlash,
  HouseLine,
  Pause,
  Play,
  Sparkle,
} from "@phosphor-icons/react";
import { useJourney } from "./useJourney";
import {
  initialPersonalization,
  personalizationReducer,
} from "./personalization";
import { RentCalculator } from "../components/RentCalculator";
import {
  BalconyControls,
  BedroomControls,
  ResetPersonalization,
  RoomiePreferences,
} from "../components/RoomControls";

const ApartmentWorld = lazy(() => import("./ApartmentWorld"));
const rooms = [
  {
    id: "bienvenido",
    label: "Bienvenido a casa",
    short: "Entrada",
    category: "TU ESPACIO. TU GENTE.",
  },
  {
    id: "sala",
    label: "La sala",
    short: "Sala",
    category: "CONOCE A TU GENTE",
  },
  {
    id: "cocina",
    label: "La cocina",
    short: "Cocina",
    category: "COMPARTIR SABE MEJOR",
  },
  {
    id: "habitacion",
    label: "Tu habitación",
    short: "Habitación",
    category: "HAZLO MUY TUYO",
  },
  {
    id: "balcon",
    label: "El balcón",
    short: "Balcón",
    category: "AQUÍ EMPIEZA LA CONVIVENCIA",
  },
];

export default function ImmersiveTour({ openApp }: { openApp: () => void }) {
  const { container, progress, stage, opacity, interactive, reducedMotion } =
    useJourney();
  const [state, dispatch] = useReducer(
    personalizationReducer,
    initialPersonalization,
  );
  const [paused, setPaused] = useState(false);
  const [detailsHidden, setDetailsHidden] = useState(false);
  const panelHidden = detailsHidden || (!interactive && !reducedMotion);
  const room = rooms[stage];
  return (
    <div
      className={`immersive-tour ${state.sunset ? "is-sunset" : ""}`}
      ref={container}
    >
      {rooms.map((item, index) => (
        <div
          className="tour-anchor"
          aria-hidden="true"
          key={item.id}
          id={item.id}
          style={{ "--stop": index / 4 } as CSSProperties}
        />
      ))}
      <div className="immersive-stage">
        <Suspense
          fallback={
            <div className="world-loading" aria-label="Preparando la visita">
              <div />
              <p>Estamos abriendo la puerta…</p>
            </div>
          }
        >
          <ApartmentWorld
            progress={progress}
            reducedMotion={reducedMotion || paused}
            personalization={state}
          />
        </Suspense>
        <div className="tour-atmosphere" aria-hidden="true">
          <span>ROOMLINK / UN HOGAR POR IMAGINAR</span>
          <span>Hecho para compartir</span>
        </div>
        <div className="experience-overlay">
          <section
            key={stage}
            className={`stage-panel panel-${stage}`}
            aria-labelledby={`stage-title-${stage}`}
            aria-hidden={panelHidden}
            inert={panelHidden}
            style={{
              opacity: detailsHidden ? 0 : reducedMotion ? 1 : opacity,
              transform: `translateY(${reducedMotion ? 0 : (1 - opacity) * 20}px)`,
            }}
          >
            <p className="eyebrow">
              <span className="stage-sparkle">
                <Sparkle size={14} weight="fill" />
              </span>
              {room.category}
            </p>
            {stage === 0 && (
              <>
                <h1 id="stage-title-0">
                  Un lugar para vivir.
                  <br />
                  <em>
                    Personas para
                    <br />
                    compartirlo.
                  </em>
                </h1>
                <p className="stage-description">
                  Pasa, imagina tu hogar y descubre con quién te gustaría
                  compartirlo.
                </p>
                <button className="button button-dark" onClick={openApp}>
                  Conoce RoomLink
                </button>
                <a className="immersive-scroll-prompt" href="#sala">
                  <ArrowDown size={18} />
                  Haz scroll. La visita empieza contigo.
                </a>
                <p className="caption">
                  Una experiencia de ejemplo. Tú le das tu estilo.
                </p>
              </>
            )}
            {stage === 1 && (
              <>
                <h2 id="stage-title-1">
                  El mejor match
                  <br />
                  no es con el sofá.
                </h2>
                <p className="stage-description">
                  Es con quien comparte tu forma de vivir. Elige lo que va
                  contigo.
                </p>
                <RoomiePreferences state={state} dispatch={dispatch} />
              </>
            )}
            {stage === 2 && (
              <>
                <h2 id="stage-title-2">
                  Las cuentas claras.
                  <br />
                  <em>El café, compartido.</em>
                </h2>
                <p className="stage-description">
                  Una taza para cada quien. Elige cuántos serán y mira cómo
                  cambia la mesa.
                </p>
                <RentCalculator
                  people={state.people}
                  onPeopleChange={(value) =>
                    dispatch({ type: "people", value })
                  }
                />
              </>
            )}
            {stage === 3 && (
              <>
                <h2 id="stage-title-3">
                  Compartir casa.
                  <br />
                  <em>Conservar tu espacio.</em>
                </h2>
                <p className="stage-description">
                  Tu color favorito. Un libro antes de dormir. Los detalles que
                  hacen que un cuarto sea tuyo.
                </p>
                <BedroomControls state={state} dispatch={dispatch} />
              </>
            )}
            {stage === 4 && (
              <>
                <h2 id="stage-title-4">
                  Una buena charla.
                  <br />
                  <em>Un nuevo comienzo.</em>
                </h2>
                <p className="stage-description">
                  Elijan la luz, hablen de lo importante y hagan espacio para
                  una vida compartida.
                </p>
                <BalconyControls state={state} dispatch={dispatch} />
                <a className="tour-next" href="#como-funciona">
                  Conoce cómo funciona RoomLink
                </a>
              </>
            )}
          </section>
        </div>
        <div className="scene-location" aria-hidden="true">
          <HouseLine size={18} />
          <span>{room.label}</span>
          <span className="location-line" />
          <span>Tu próxima historia</span>
        </div>
        <div className="tour-bottom-bar">
          <nav
            className="immersive-navigation"
            aria-label="Espacios del departamento"
          >
            {rooms.map((item, index) => (
              <a
                href={`#${item.id}`}
                key={item.id}
                aria-current={stage === index ? "step" : undefined}
              >
                <span />
                {item.short}
              </a>
            ))}
          </nav>
          <div className="tour-utilities">
            <button
              className="details-toggle"
              type="button"
              aria-pressed={detailsHidden}
              onClick={() => setDetailsHidden((v) => !v)}
            >
              {detailsHidden ? <Eye size={16} /> : <EyeSlash size={16} />}
              {detailsHidden ? "Mostrar detalles" : "Ver solo el depa"}
            </button>
            <ResetPersonalization dispatch={dispatch} />
            <button
              className="icon-button"
              type="button"
              aria-label={
                paused ? "Reanudar recorrido" : "Fijar vista del departamento"
              }
              aria-pressed={paused}
              disabled={reducedMotion}
              onClick={() => setPaused((v) => !v)}
            >
              {paused || reducedMotion ? (
                <Play size={16} />
              ) : (
                <Pause size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
