import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { Buffer } from "buffer";

const apiKey =  "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";

export async function speakWithOpenAI(text: string) {
  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "soft", // prueba también "alloy", "verse"
        input: text,
      }),
    });

    if (!res.ok) {
      console.error("OpenAI TTS error:", res.status, await res.text());
      return;
    }

    // Recibir como binario
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // 👇 TS no reconoce cacheDirectory, pero en runtime sí existe
    const baseDir = (FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory;
    const fileUri = `${baseDir}tts.mp3`;

    // Guardar como Base64
    await (FileSystem as any).writeAsStringAsync(fileUri, base64, {
      encoding: "base64",
    });

    // Reproducir
    const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
    await sound.playAsync();
  } catch (err) {
    console.error("speakWithOpenAI error:", err);
  }
}
