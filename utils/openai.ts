// utils/openai.ts
export type GameImage = {
  url: string;
  isOdd: boolean;
};

export type GeneratedGame = {
  title: string;
  description?: string;
  target?: string;
  instructions: string;
  images: GameImage[]; // objetos con metadata
  preview?: string;
};

async function fetchPixabayImages(query: string, count: number): Promise<string[]> {
  const key = "52326026-aa7f75e34efb89b1c3b635fc4"; // API key pública de Pixabay
  const url = `https://pixabay.com/api/?key=${key}&q=${encodeURIComponent(
    query
  )}&image_type=illustration&per_page=${count}&safesearch=true`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const data = JSON.parse(text);
    return data.hits.slice(0, count).map((hit: any) => hit.webformatURL);
  } catch (err) {
    console.error("Pixabay fetch error:", err);
    return [];
  }
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export async function generateGameContent(prompt: string): Promise<GeneratedGame | null> {
  // ⚠️ API key de OpenAI embebida
  const apiKey =
    "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";
  const chatEndpoint = "https://api.openai.com/v1/chat/completions";

  const systemPrompt = `Eres un asistente que crea juegos educativos para niños .  
Responde SOLO en formato JSON (sin explicaciones), siguiendo exactamente este esquema:  

{
  "title": "...",
  "description": "(opcional)",
  "instructions": "...",
  "main_noun": "sustantivo principal (ej: dog, cat, car)",
  "odd_noun": "sustantivo que no pertenece (ej: apple, chair, ball)"
}

REGLAS:  
- Los sustantivos deben estar en inglés y existir imagenes en pixabay.  
- Nada de lenguaje inapropiado.  
- Preferir objetos, animales, personajes animados, alimentos, colores, juguetes, formas, y en general conceptos familiares para niños.  
- "main_noun" es la categoría (3 imágenes) y "odd_noun" es el que no encaja.  
- Usa siempre singular (ej: "dog", no "dogs").`;

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 300,
  };

  try {
    const res = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("OpenAI chat error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText || typeof rawText !== "string") {
      console.error("No text returned from model:", data);
      return null;
    }

    const cleaned = rawText.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr, "Raw:", rawText);
      return null;
    }

    const title = String(parsed.title ?? `Juego: ${prompt.slice(0, 40)}`);
    const description = parsed.description ? String(parsed.description) : undefined;
    const instructions = String(
      parsed.instructions ?? "Observa las imágenes y selecciona la opción correcta."
    );

    // Traer candidatos
    const mainCandidates = await fetchPixabayImages(parsed.main_noun, 5);
    const oddCandidates = await fetchPixabayImages(parsed.odd_noun, 5);

    const mainImages = pickRandom(mainCandidates, 3).map((url) => ({
      url,
      isOdd: false,
    }));

    const oddPickUrl = pickRandom(oddCandidates, 1)[0] ?? "/fallback/odd.png";
    const oddImage = { url: oddPickUrl, isOdd: true };

    // Mezclar manteniendo metadata
    const cards: GameImage[] = [...mainImages, oddImage];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return {
      title,
      description,
      target: `Encuentra la imagen que muestra: ${parsed.odd_noun}`,
      instructions,
      images: cards, // ahora vienen con metadata
      preview: cards[0].url,
    };
  } catch (err) {
    console.error("generateGameContent fetch error:", err);
    return null;
  }
}

