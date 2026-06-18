// Datos estáticos e inmutables de la experiencia "Para Mario".
// Editorial: las cartas requieren ser pegadas manualmente por Isaac.

export type Versiculo = {
  texto: string;
  referencia: string;
};

export type Voz = {
  id: string;
  nombre: string;
  subtitulo: string;
  src: string;
  /** Duración estimada en segundos para fallback si el audio no carga. */
  fallbackSec: number;
};

export type Carta = {
  id: string;
  firma: string;
  inicial: string;
  titulo: string;
  /** Cuerpo de la carta — ~120 palabras. PEGAR MANUALMENTE. */
  cuerpo: string;
};

export type Origen = {
  pais: string;
  lat: number;
  lng: number;
};

export const DESTINO: Origen = {
  pais: "Guinea Ecuatorial",
  lat: 1.65,
  lng: 10.27,
};

export const ORIGENES: Origen[] = [
  { pais: "Estados Unidos", lat: 39.5, lng: -98.35 },
  { pais: "República Dominicana", lat: 18.74, lng: -70.16 },
  { pais: "México", lat: 23.63, lng: -102.55 },
  { pais: "Perú", lat: -9.19, lng: -75.02 },
  { pais: "Colombia", lat: 4.57, lng: -74.3 },
  { pais: "Chile", lat: -35.68, lng: -71.54 },
  { pais: "Honduras", lat: 15.2, lng: -86.24 },
  { pais: "Nicaragua", lat: 12.87, lng: -85.21 },
  { pais: "Guatemala", lat: 15.78, lng: -90.23 },
  { pais: "Venezuela", lat: 6.42, lng: -66.59 },
];

export const VERSICULOS: Versiculo[] = [
  {
    texto:
      "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
    referencia: "Isaías 41:10",
  },
  {
    texto:
      "Desecha las fábulas profanas y de viejas. Ejercítate para la piedad; porque el ejercicio corporal para poco es provechoso, pero la piedad para todo aprovecha, pues tiene promesa de esta vida presente, y de la venidera.  Palabra fiel es esta, y digna de ser recibida por todos. Que por esto mismo trabajamos y sufrimos oprobios, porque esperamos en el Dios viviente, que es el Salvador de todos los hombres, mayormente de los que creen.",
    referencia: "1 Timoteo 4:7-10",
  },
  {
    texto:
      "Pero tú, Timoteo, estás al servicio de Dios. Por eso, aléjate de todo lo malo. Trata siempre de obedecer a Dios y de ser un buen discípulo de Jesucristo. No dejes de confiar en él, y ama a todos los hermanos de la iglesia. Cuando enfrentes dificultades, ten paciencia y sé amable con los demás.",
    referencia: "1 Timoteo 6:11",
  },
  {
    texto: "Bienaventurados los mansos, porque ellos recibirán la tierra por heredad.",
    referencia: "Mateo 5:5",
  },
  {
    texto:
      "Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos, porque Jehová tu Dios es el que va contigo; no te dejará, ni te desamparará.",
    referencia: "Deuteronomio 31:6",
  },
  {
    texto: "Pues considero que los sufrimientos de este tiempo presente no son dignos de ser comparados con la gloria que nos ha de ser revelada.",
    referencia: "Romanos 8:18",
  },
];

export const VOCES: Voz[] = [
  {
    id: "mariana",
    nombre: "Mariana",
    subtitulo: "Tu hermana te dice..",
    src: "/mario/audio/voz-mariana.mp3",
    fallbackSec: 8,
  },
  {
    id: "majo",
    nombre: "Majo",
    subtitulo: "Hermanitoo feliz cumplee",
    src: "/mario/audio/voz-majo.mp3",
    fallbackSec: 8,
  },
  {
    id: "ashley",
    nombre: "Ashley",
    subtitulo: "Felicidadeees marioo",
    src: "/mario/audio/voz-ashley.mp3",
    fallbackSec: 8,
  },
  {
    id: "yas",
    nombre: "Yas",
    subtitulo: "Un hermano que te bendice",
    src: "/mario/audio/voz-yas.mp3",
    fallbackSec: 8,
  },
  {
    id: "equipo",
    nombre: "El Equipo",
    subtitulo: "Familia que comparte tu fe",
    src: "/mario/audio/voz-equipo.mp3",
    fallbackSec: 8,
  },
];

export const CARTAS: Carta[] = [
  {
    id: "ashley",
    firma: "Ashley",
    inicial: "A",
    titulo: "Para mi hermano Mario",
    cuerpo: " ​¡Feliz cumpleaños, Mario! ​Hoy quiero aprovechar este día tan especial para celebrar tu vida. Le pido a Dios que te bendiga inmensamente hoy y siempre, guiando cada uno de tus pasos y llenándote de salud y alegrías. ​Gracias por ser parte de nuestra familia y por todo lo que compartimos. Te quiero muchísimo y espero que hoy pases un día increíble. ¡Te lo mereces! ​Con todo mi cariño, Ash :)",
  },
  {
    id: "abraham",
    firma: "Abraham",
    inicial: "A",
    titulo: "Para Mario, con todo mi corazón",
    // 👉 PEGA AQUÍ LA CARTA DE MAJO (~120 palabras)
    cuerpo: "Bro, primero que nada quiero desearte todas las bendiciones del mundo, la verdad no te conozco, pero somos hermanos en Cristo, eso es lo de menos. Dios esté siempre en tus sueños según el salmos 34:7. Que siempre te proteja según el salmos 37:4 y que te cubra según el salmos 91:1. Que te haga pilar y guerrero a dónde llegues según Jeremías 1:10 y que sobre todo, te ame, con amor incondicional según 1 Corintios 13:1-8 y Romanos 8:35-39. Dios multiplique las buenas obras de tus manos, te quite todo rechazo y nunca te abandone, porque eres como ese Ciro de Isaías 45:1-7. Sin más nada que decir, Números 6:24-27.",
  },
  {
    id: "isaac",
    firma: "Isaac",
    inicial: "I",
    titulo: "Broder, para ti",
    cuerpo: "Feliz cumpleaños mario, desde que te conoci he visto una fé genuina y un corazón genuino por todos tus hermanos, eso me llena de gran gozo, a pesar de que sé que has pasado por tentaciones, quiero decirte que porfavor permanezcas en el señor y el te dará la salida a toda tentacion, he visto ese amor con el cual nos escribes en las madrugadas y Dios mismo sabe tus intenciones genuinas, sigue tus ojos puestos en Jesucristo nuestro señor.",
  },
  {
    id: "yas",
    firma: "Yas",
    inicial: "Y",
    titulo: "Felicidades, ya 18!!!!",
    // 👉 PEGA AQUÍ LA CARTA DE YAS (~120 palabras)
    cuerpo: "Feliz cumpleaños, Mario, Que el Señor bendiga tus 18 años, te guíe siempre y cumpla Su propósito en tu vida. Te amamos mucho en el amor de Cristo. 🤍🙏🏻",
  },
  {
    id: "equipo",
    firma: "El Equipo",
    inicial: "E",
    titulo: "Una familia que cruza fronteras",
    // 👉 PEGA AQUÍ LA CARTA DEL EQUIPO (~120 palabras)
    cuerpo: "Querido Mario: Hoy celebramos un día muy especial: tus 18 años de vida. Damos gracias al Señor por permitirte llegar a esta etapa tan importante, llena de nuevas oportunidades, crecimiento y propósito. Deseamos que Dios te bendiga grandemente, que Su mano esté sobre tu vida, que te conceda sabiduría para cada decisión, fortaleza para cada batalla y un corazón siempre sensible a Su voz. Que nunca olvides que antes de cualquier sueño, meta o camino, tu identidad está en Cristo y que Él tiene planes de bien para ti. Que este nuevo tiempo no sea solo un crecimiento en edad, sino también en fe, carácter, amor y obediencia al Señor. Que donde vayas seas luz, que tu vida refleje el amor de Jesús y que nunca te apartes del propósito que Dios ha preparado para ti. Recuerda siempre esta promesa: “Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis” (Jeremías 29:11).  Mario, queremos que sepas que te amamos mucho en el amor de Cristo. Oramos para que cada año que venga esté lleno de gracia, bendición, crecimiento espiritual y testimonios de la fidelidad de Dios.  ¡Feliz cumpleaños número 18! Que el Señor te guarde, te fortalezca y te lleve cada día más cerca de Su corazón. Con mucho cariño y amor en Cristo, -SOMOSLUZ",
  },
];

export const VERSICULO_MAPA: Versiculo = {
  texto:
    "Nadie ha visto jamás a Dios. Si nos amamos unos a otros, Dios permanece en nosotros, y su amor se ha perfeccionado en nosotros.",
  referencia: "1 Juan 4:12",
};

export const VERSICULO_FINAL: Versiculo = {
  texto:
    "¡Mirad cuán bueno y cuán delicioso es habitar los hermanos juntos en armonía!",
  referencia: "Salmos 133:1",
};

export const MENSAJE_FINAL =
  "En Cristo no hay distancia Mario. Hay un solo cuerpo, un solo Espíritu, una sola esperanza, Jesucristo nuestro señor";

export const PRE_INTRO_LINEAS = ["Hermano…", "Mario.", "Esto es para ti."];

/** Bendición Sacerdotal — Números 6:24-26 (versos en cascada) */
export const BENDICION_SACERDOTAL: string[] = [
  "Jehová te bendiga, y te guarde;",
  "Jehová haga resplandecer su rostro sobre ti, y tenga de ti misericordia;",
  "Jehová alce sobre ti su rostro, y ponga en ti paz.",
];

/** Frases breves de cada hermano tras la bendición. */
export const HERMANOS_FRASES: { nombre: string; frase: string }[] = [
  { nombre: "Abraham", frase: "Mario, te queremos bro" },
  { nombre: "Ashley", frase: "Dios te llene de sabiduría" },
  { nombre: "Isaac", frase: "Oro por ti" },
  { nombre: "Majo", frase: "Te bendecimos" },
  { nombre: "Yas", frase: "Sigue permaneciendo en Dios" },
];

/** Audio de la bendición. Coloca el archivo en /public/mario/audio/bendicion.mp3 */
export const BENDICION_AUDIO_SRC = "/mario/audio/bendicion.mp3";
/** Duración estimada del audio (s). Se usa como fallback si el archivo no carga. */
export const BENDICION_FALLBACK_SEC = 26;

export const FOTO_VIDEOLLAMADA = "/mario/img/videollamada.jpg";
