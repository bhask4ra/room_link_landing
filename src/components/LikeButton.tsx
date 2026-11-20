import { Heart } from "@phosphor-icons/react";
import { useState } from "react";

export function LikeButton({
  liked,
  onToggle,
}: {
  liked: boolean;
  onToggle: () => void;
}) {
  const [burst, setBurst] = useState(0);
  return (
    <span className="like-control">
      <button
        type="button"
        className={`like-button ${liked ? "is-liked" : ""}`}
        aria-label="Me gusta este perfil de ejemplo"
        aria-pressed={liked}
        onClick={() => {
          if (!liked) setBurst((v) => v + 1);
          onToggle();
        }}
      >
        <Heart size={25} weight={liked ? "fill" : "regular"} />
      </button>
      {liked && burst > 0 && (
        <span className="heart-burst" key={burst} aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties}>
              <Heart size={12} weight="fill" />
            </i>
          ))}
        </span>
      )}
    </span>
  );
}
