
import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, Activity, X } from 'lucide-react';
import { connectLiveAssistant } from '../services/geminiService';

interface LiveAssistantProps {
  onTranscript: (text: string) => void;
  onClose: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ onTranscript, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = connectLiveAssistant({
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          // Audio streaming logic...
          const source = audioContextRef.current!.createMediaStreamSource(stream);
          const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
            sessionPromise.then(s => s.sendRealtimeInput({ 
              media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
            }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(audioContextRef.current!.destination);
        },
        onmessage: (msg: any) => {
          if (msg.serverContent?.inputTranscription) {
            const text = msg.serverContent.inputTranscription.text;
            setTranscript(prev => prev + ' ' + text);
            onTranscript(text);
          }
        },
        onerror: (e: any) => console.error("Live Error", e),
        onclose: () => setIsActive(false)
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    audioContextRef.current?.close();
    setIsActive(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="fixed bottom-8 right-8 w-96 bg-slate-900 rounded-[32px] shadow-2xl border border-slate-800 p-6 z-50 animate-in slide-in-from-bottom-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
          <h3 className="text-white font-bold tracking-tight">Clinical Assistant</h3>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-4 min-h-[120px] mb-6 border border-slate-700">
        <p className="text-slate-400 text-sm leading-relaxed italic">
          {transcript || (isActive ? "Listening for dictation..." : "Ready to assist...")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {!isActive ? (
          <button 
            onClick={startSession}
            disabled={isConnecting}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            {isConnecting ? <Activity className="animate-spin" /> : <Mic size={20} />}
            Start Assistant
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="flex items-center gap-3 bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-full font-bold transition-all"
          >
            <MicOff size={20} />
            End Session
          </button>
        )}
      </div>
      
      <div className="mt-4 text-[10px] text-center font-bold text-slate-600 uppercase tracking-widest">
        Live Edge Reasoning Active
      </div>
    </div>
  );
};

export default LiveAssistant;
