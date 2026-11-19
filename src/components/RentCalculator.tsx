import { useState } from "react";
import { splitRent } from "../tour/journey";
const money = (amount: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount);

export function RentCalculator() {
  const [people, setPeople] = useState(3);
  const shares = splitRent(8400, people);
  return (
    <div className="rent-card">
      <div className="rent-heading">
        <span>Una renta, en equipo</span>
        <span className="demo-label">Ejemplo</span>
      </div>
      <div className="rent-amount">
        <strong>{money(shares[0])}</strong>
        <span> MXN / persona al mes</span>
      </div>
      <div className="split-control">
        <span>¿Cuántos roomies?</span>
        <div role="group" aria-label="Número de roomies">
          {[2, 3, 4].map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={count === people}
              onClick={() => setPeople(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
      <p className="rent-summary" aria-live="polite">
        {money(8400)} MXN entre {people} personas. Solo renta, sin servicios.
      </p>
      <p className="caption">
        Cálculo ilustrativo. No es un anuncio ni una oferta de renta.
      </p>
    </div>
  );
}
