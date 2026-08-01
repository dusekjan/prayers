export interface Prayer {
  type: "internal" | "external";
  url: string;  // modlitba hostovaná přímo na tomto webu vlozi <slug>
  title: string;
}

// Interní modlitby musí mít odpovídající top-level složku s `index.html`
export const prayers: Prayer[] = [
  {
    type: "internal",
    url: "pompejska-novena",  // <slug>
    title: "Pompejská novéna"
  },
  {
    type: "external",
    url: "https://ruzeneconline.cz",
    title: "Růženec online"
  },
  {
    type: "external",
    url: "https://brigitaonline.cz",
    title: "Modlitby svaté Brigity"
  },
];
