import {
  Check,
  Lamp,
  Moon,
  Sun,
  ArrowCounterClockwise,
  Leaf,
  PawPrint,
  CookingPot,
  Laptop,
  MusicNotes,
  Users,
  Sparkle,
} from "@phosphor-icons/react";
import type { Dispatch } from "react";
import {
  beddingColors,
  preferences,
  type Bedding,
  type Personalization,
  type PersonalizationAction,
} from "../tour/personalization";
import { LikeButton } from "./LikeButton";

type Props = {
  state: Personalization;
  dispatch: Dispatch<PersonalizationAction>;
};
const icons = [
  Leaf,
  Sun,
  CookingPot,
  PawPrint,
  Laptop,
  Sparkle,
  Users,
  MusicNotes,
];
export function RoomiePreferences({ state, dispatch }: Props) {
  return (
    <div className="personalization-controls">
      <div className="profile-preview">
        <span className="avatar lavender large">M</span>
        <div>
          <strong>Un roomie a tu medida</strong>
          <span>Imagina cómo les gustaría vivir</span>
        </div>
        <LikeButton
          liked={state.liked}
          onToggle={() => dispatch({ type: "toggle", key: "liked" })}
        />
      </div>
      <div
        className="preference-options"
        role="group"
        aria-label="Preferencias de convivencia"
      >
        {preferences.map((preference, index) => {
          const Icon = icons[index];
          return (
            <button
              type="button"
              key={preference.id}
              aria-pressed={state.preferences.includes(preference.id)}
              onClick={() =>
                dispatch({ type: "preference", id: preference.id })
              }
            >
              <Icon size={16} />
              {preference.label}
            </button>
          );
        })}
      </div>
      <p className="selection-feedback" aria-live="polite">
        {state.preferences.length
          ? `${state.preferences.length} ${state.preferences.length === 1 ? "preferencia" : "preferencias"} para empezar a conocerse.`
          : "Tu espacio, sin etiquetas. Elige lo que va contigo."}
      </p>
      <p className="caption">
        Plantas y mascotas cambian en el depa. Perfil ilustrativo.
      </p>
    </div>
  );
}
export function BedroomControls({ state, dispatch }: Props) {
  const labels: Record<Bedding, string> = {
    rose: "Rosa",
    mauve: "Malva",
    cream: "Crema",
  };
  return (
    <div className="personalization-controls bedroom-controls">
      <div className="control-label">Dale tu color</div>
      <div
        className="bedding-options"
        role="group"
        aria-label="Color de la ropa de cama"
      >
        {(Object.keys(beddingColors) as Bedding[]).map((color) => (
          <button
            type="button"
            key={color}
            aria-pressed={state.bedding === color}
            onClick={() => dispatch({ type: "bedding", value: color })}
          >
            <span
              className="color-swatch"
              style={{ backgroundColor: beddingColors[color] }}
            >
              {state.bedding === color && <Check size={15} />}
            </span>
            {labels[color]}
          </button>
        ))}
      </div>
      <button
        className="scene-toggle"
        type="button"
        aria-pressed={state.lamp}
        onClick={() => dispatch({ type: "toggle", key: "lamp" })}
      >
        <Lamp size={21} />
        <span>
          Mi rincón de lectura
          <small>
            {state.lamp ? "Lámpara encendida" : "Enciende la lámpara"}
          </small>
        </span>
        <span className="toggle-track" aria-hidden="true">
          <i />
        </span>
      </button>
      <p className="caption">
        Prueba los colores. El departamento cambia contigo.
      </p>
    </div>
  );
}
export function BalconyControls({ state, dispatch }: Props) {
  return (
    <div className="personalization-controls">
      <div
        className="daylight-options"
        role="group"
        aria-label="Luz del departamento"
      >
        <button
          type="button"
          aria-pressed={!state.sunset}
          onClick={() => {
            if (state.sunset) dispatch({ type: "toggle", key: "sunset" });
          }}
        >
          <Sun size={18} />
          Mañana
        </button>
        <button
          type="button"
          aria-pressed={state.sunset}
          onClick={() => {
            if (!state.sunset) dispatch({ type: "toggle", key: "sunset" });
          }}
        >
          <Moon size={18} />
          Atardecer
        </button>
      </div>
      <p className="control-label">Las pequeñas cosas que acordamos</p>
      <div
        className="agreement-options"
        role="group"
        aria-label="Acuerdos de convivencia"
      >
        {[
          ["costs", "Hablamos de los gastos"],
          ["rest", "Respetamos nuestros descansos"],
          ["chores", "Compartimos las tareas"],
        ].map(([id, label]) => (
          <button
            type="button"
            key={id}
            aria-pressed={state.agreements.includes(id)}
            onClick={() => dispatch({ type: "agreement", id })}
          >
            <span className="agreement-check">
              {state.agreements.includes(id) && (
                <Check size={14} weight="bold" />
              )}
            </span>
            {label}
          </button>
        ))}
      </div>
      <p className="selection-feedback" aria-live="polite">
        {state.agreements.length === 3
          ? "Ya tienen un buen comienzo para compartir hogar."
          : `${state.agreements.length} de 3 acuerdos de ejemplo elegidos.`}
      </p>
    </div>
  );
}
export function ResetPersonalization({ dispatch }: Pick<Props, "dispatch">) {
  return (
    <button
      type="button"
      className="reset-personalization"
      aria-label="Restablecer mi depa"
      title="Restablecer mi depa"
      onClick={() => dispatch({ type: "reset" })}
    >
      <ArrowCounterClockwise size={16} />
      <span>Restablecer mi depa</span>
    </button>
  );
}
