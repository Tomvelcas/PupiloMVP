// components/TextToSpeech.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { speak, stopSpeaking, pauseSpeaking, resumeSpeaking, getVoices, isSpeaking } from '../utils/speech';

type Voice = {
  identifier: string;
  language?: string;
  name?: string;
};

export default function TextToSpeech({ initialText = '' }: { initialText?: string }) {
  const [text, setText] = useState<string>(initialText);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pitch, setPitch] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.0);

  useEffect(() => {
    (async () => {
      const v = await getVoices();
      setVoices(v || []);
      // intenta preseleccionar una voz en español si existe
      const spanish = (v || []).find((x: any) => x.language?.startsWith('es'));
      if (spanish) setSelectedVoice(spanish as Voice);
    })();
  }, []);

  useEffect(() => {
    // Si quieres, podrías usar un intervalo para consultar isSpeakingAsync()
    // pero aquí usamos callbacks onStart/onDone para mantener el estado.
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      Alert.alert('Nada que decir', 'Escribe algo de texto para convertir a voz.');
      return;
    }

    // Opciones para Speech.speak
    const options: Partial<Speech.SpeechOptions> = {
      voice: selectedVoice?.identifier,
      language: selectedVoice?.language,
      pitch,
      rate,
      onStart: () => {
        setSpeaking(true);
        setPaused(false);
      },
      onDone: () => {
        setSpeaking(false);
        setPaused(false);
      },
      onStopped: () => {
        setSpeaking(false);
        setPaused(false);
      },
      onError: (err) => {
        console.warn('Speech error', err);
        setSpeaking(false);
        setPaused(false);
      },
    };

    speak(text, options);
  };

  const handleStop = async () => {
    await stopSpeaking();
    setSpeaking(false);
    setPaused(false);
  };

  const handlePause = async () => {
    await pauseSpeaking();
    setPaused(true);
  };

  const handleResume = async () => {
    await resumeSpeaking();
    setPaused(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Texto a convertir:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Escribe aquí..."
        multiline
      />

      <View style={styles.row}>
        <Button title="Reproducir" onPress={handleSpeak} />
        <View style={styles.space} />
        <Button title="Detener" onPress={handleStop} />
        <View style={styles.space} />
        <Button title={paused ? 'Reanudar' : 'Pausar'} onPress={paused ? handleResume : handlePause} />
      </View>

      <Text style={styles.meta}>Estado: {speaking ? (paused ? 'Pausado' : 'Hablando') : 'Inactivo'}</Text>

      <Text style={[styles.label, { marginTop: 12 }]}>Voces disponibles (toca para seleccionar):</Text>
      <ScrollView style={styles.voiceList} horizontal>
        {voices.length === 0 ? (
          <Text style={styles.small}>Cargando voces...</Text>
        ) : (
          voices.map((v: any) => {
            const isSelected = selectedVoice?.identifier === v.identifier;
            return (
              <TouchableOpacity
                key={v.identifier ?? `${v.name}-${v.language}`}
                style={[styles.voiceItem, isSelected && styles.voiceItemSelected]}
                onPress={() => setSelectedVoice(v)}
              >
                <Text style={styles.voiceText}>{v.name ?? v.identifier} {v.language ? `(${v.language})` : ''}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
      <Text style={styles.small}>Pitch: {pitch.toFixed(2)} — Rate: {rate.toFixed(2)}</Text>
      <View style={styles.note}>
        <Text style={styles.small}>Nota: en iOS el dispositivo en modo silencioso no reproducirá audio; pausa/continuar no está disponible en Android en algunas versiones.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: { minHeight: 80, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, textAlignVertical: 'top' },
  row: { flexDirection: 'row', marginTop: 10, alignItems: 'center' },
  space: { width: 8 },
  meta: { marginTop: 8 },
  voiceList: { marginTop: 8, maxHeight: 60 },
  voiceItem: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
  voiceItemSelected: { backgroundColor: '#e6f0ff', borderColor: '#66a3ff' },
  voiceText: { fontSize: 13 },
  small: { fontSize: 12, color: '#666' },
  note: { marginTop: 10 },
});
