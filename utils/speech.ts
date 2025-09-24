// utils/speech.ts
import * as Speech from 'expo-speech';

export async function speak(text: string, options?: Partial<Speech.SpeechOptions>) {
  if (!text) return;
  // Opciones comunes: voice, language, pitch, rate, onDone, onError, onStart
  Speech.speak(text, options || {});
}

export async function stopSpeaking() {
  try {
    await Speech.stop();
  } catch (e) {
    console.warn('stopSpeaking error', e);
  }
}

export async function pauseSpeaking() {
  // pause() no está disponible en Android (solo iOS y web)
  try {
    // @ts-ignore - algunos tipos pueden variar en versiones de @types
    if (Speech.pause) await Speech.pause();
  } catch (e) {
    console.warn('pauseSpeaking error', e);
  }
}

export async function resumeSpeaking() {
  try {
    // @ts-ignore
    if (Speech.resume) await Speech.resume();
  } catch (e) {
    console.warn('resumeSpeaking error', e);
  }
}

export async function getVoices() {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (e) {
    console.warn('getVoices error', e);
    return [];
  }
}

export async function isSpeaking() {
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return false;
  }
}
