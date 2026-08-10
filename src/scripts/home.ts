import "./components/prayer-card";

export interface Prayer {
    type: "internal" | "external";
    url: string;  // modlitba hostovaná přímo na tomto webu vlozi <slug>
    title: string;
}
