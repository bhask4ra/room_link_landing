import { useEffect, useRef } from "react";
import { X, HouseLine, ChatsCircle, Heart } from "@phosphor-icons/react";

export type DialogKind = "app" | "privacy" | "about" | null;
export function InfoDialog({
  kind,
  onClose,
}: {
  kind: DialogKind;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (kind && !dialog.current?.open) dialog.current?.showModal();
    if (!kind && dialog.current?.open) dialog.current?.close();
  }, [kind]);
  return (
    <dialog
      ref={dialog}
      className="info-dialog"
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="dialog-title"
    >
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <X size={24} />
      </button>
      <span className="eyebrow">CONOCE ROOMLINK</span>
      <h2 id="dialog-title">
        {kind === "privacy"
          ? "Tu privacidad en esta demo."
          : kind === "about"
            ? "Un hogar imaginado. Una idea real."
            : "Tu próximo capítulo, en compañía."}
      </h2>
      {kind === "app" && (
        <>
          <p>
            RoomLink reúne personas, espacios y conversaciones para ayudarte a
            encontrar con quién vivir.
          </p>
          <div className="dialog-features">
            <p>
              <Heart size={24} /> Un perfil que cuenta cómo te gusta vivir.
            </p>
            <p>
              <ChatsCircle size={24} /> Conversaciones con posibles roomies.
            </p>
            <p>
              <HouseLine size={24} /> Opciones de vivienda y acuerdos
              compartidos.
            </p>
          </div>
          <div className="honest-note">
            La app está en desarrollo. Esta página es una presentación: todavía
            no incluye un enlace público de registro o descarga.
          </div>
          <button
            className="button button-dark"
            onClick={() => {
              onClose();
              document
                .getElementById("como-funciona")
                ?.scrollIntoView({ behavior: "instant" });
            }}
          >
            Ver cómo funciona
          </button>
        </>
      )}
      {kind === "privacy" && (
        <>
          <p>
            Esta landing no solicita datos personales ni incorpora formularios,
            cookies de seguimiento o analítica. Las interacciones del recorrido
            se procesan en tu navegador.
          </p>
          <p>
            El proveedor que aloje la página puede registrar datos técnicos de
            las visitas. Las políticas de la aplicación RoomLink deberán
            consultarse en la app cuando se publique.
          </p>
        </>
      )}
      {kind === "about" && (
        <>
          <p>
            El departamento, los personajes, los perfiles y las cifras son
            ilustrativos. No representan inmuebles disponibles, personas reales
            ni resultados de usuarios.
          </p>
          <p>
            Este recorrido presenta el proyecto RoomLink. No permite reservar
            habitaciones, firmar contratos ni realizar pagos.
          </p>
        </>
      )}
    </dialog>
  );
}
