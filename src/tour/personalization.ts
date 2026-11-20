export const preferences = [
  { id: "plants", label: "Plantas por todas partes", short: "plantas" },
  { id: "quiet", label: "Mañanas tranquilas", short: "tranquilidad" },
  { id: "cooking", label: "Cocinar en compañía", short: "cocina compartida" },
  { id: "pets", label: "Con mascotas", short: "mascotas" },
  { id: "remote", label: "Trabajo desde casa", short: "trabajo en casa" },
  { id: "tidy", label: "Cada cosa en su lugar", short: "orden" },
  { id: "guests", label: "Visitas bienvenidas", short: "visitas" },
  { id: "music", label: "Una buena playlist", short: "música" },
] as const;
export type Preference = (typeof preferences)[number]["id"];
export const beddingColors = {
  rose: "#d6aabb",
  mauve: "#ad8dbb",
  cream: "#ead9be",
} as const;
export type Bedding = keyof typeof beddingColors;
export type Personalization = {
  preferences: Preference[];
  people: 2 | 3 | 4;
  liked: boolean;
  bedding: Bedding;
  lamp: boolean;
  sunset: boolean;
  agreements: string[];
};
export const initialPersonalization: Personalization = {
  preferences: ["plants", "quiet", "pets"],
  people: 3,
  liked: false,
  bedding: "rose",
  lamp: false,
  sunset: false,
  agreements: [],
};
export type PersonalizationAction =
  | { type: "preference"; id: Preference }
  | { type: "people"; value: 2 | 3 | 4 }
  | { type: "bedding"; value: Bedding }
  | { type: "toggle"; key: "liked" | "lamp" | "sunset" }
  | { type: "agreement"; id: string }
  | { type: "reset" };
const toggleItem = <T>(items: T[], item: T) =>
  items.includes(item) ? items.filter((v) => v !== item) : [...items, item];
export function personalizationReducer(
  state: Personalization,
  action: PersonalizationAction,
): Personalization {
  switch (action.type) {
    case "preference":
      return {
        ...state,
        preferences: toggleItem(state.preferences, action.id),
      };
    case "people":
      return { ...state, people: action.value };
    case "bedding":
      return { ...state, bedding: action.value };
    case "toggle":
      return { ...state, [action.key]: !state[action.key] };
    case "agreement":
      return { ...state, agreements: toggleItem(state.agreements, action.id) };
    case "reset":
      return {
        ...initialPersonalization,
        preferences: [...initialPersonalization.preferences],
        agreements: [],
      };
  }
}
