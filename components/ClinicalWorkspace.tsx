
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Loader2, 
  AlertCircle, 
  Stethoscope, 
  Pill, 
  History, 
  Zap, 
  CheckSquare,
  Sparkles,
  ClipboardCheck,
  RotateCcw,
  Camera,
  Mic,
  Save,
  CheckCircle2,
  ChevronRight,
  Shield,
  Activity,
  Anchor
} from 'lucide-react';
import { analyzeClinicalNote, analyzeClinicalImage } from '../services/geminiService';
import { saveEncounter } from '../services/storageService';
import { ClinicalInsight } from '../types';
import LiveAssistant from './LiveAssistant';

const ClinicalWorkspace: React.FC = () => {
  const [note, setNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<ClinicalInsight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLive, setShowLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    if (note.length > 10) {
      const timer = setTimeout(() => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [note]);

  const handleAnalyze = async () => {
    if (!note.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeClinicalNote(note);
      setInsights(result);
      saveEncounter({
        id: Date.now().toString(),
        patientId: 'LOCAL-1',
        timestamp: new Date().toISOString(),
        author: 'Dr. Zachary Hulse',
        content: note,
        insights: result
      });
    } catch (err: any) {
      setError(err.message || 'Inference error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Camera hardware unavailable");
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    setIsAnalyzing(true);
    try {
      const visionResult = await analyzeClinicalImage(base64, 'image/jpeg');
      setNote(prev => prev + `\n\n[Clinical Scan]: ${visionResult}`);
    } catch (err) {
      setError("Vision inference failed");
    } finally {
      setIsAnalyzing(false);
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setCameraActive(false);
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
      {/* Analysis Interface */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-slate-300 overflow-hidden flex flex-col transition-all">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-950 uppercase tracking-tighter">Sovereign Data Intake</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1 uppercase tracking-widest">
                    <Activity size={10} className={isSyncing ? "animate-pulse text-blue-600" : ""} /> 
                    {isSyncing ? "Syncing to Local Lattice..." : "NEA Integrity Verified"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowLive(true)}
                className="p-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-all border border-slate-300"
                aria-label="Audio Dictation"
              >
                <Mic size={18} />
              </button>
              <button 
                onClick={cameraActive ? captureAndAnalyze : startCamera}
                className={`p-3 rounded-xl transition-all border ${cameraActive ? 'bg-rose-600 text-white animate-pulse border-rose-400' : 'bg-slate-100 text-slate-900 border-slate-300'}`}
                aria-label="Vision Scanner"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-white">
            {cameraActive && (
              <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col">
                <video ref={videoRef} autoPlay playsInline className="flex-1 object-contain bg-black" />
                <div className="p-6 bg-slate-900 flex justify-between items-center border-t border-slate-800">
                  <button onClick={stopCamera} className="text-slate-200 font-bold px-6 py-2 bg-slate-800 rounded-xl border border-slate-700">Cancel</button>
                  <button onClick={captureAndAnalyze} className="bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg">Process Frame</button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
            <textarea
              className="w-full h-full p-10 text-slate-900 text-xl font-medium leading-relaxed focus:outline-none resize-none placeholder:text-slate-400 selection:bg-slate-950 selection:text-white transition-colors"
              placeholder="Input patient history, exam findings, or scan data..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              spellCheck="false"
              autoFocus
            />
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
              <Anchor size={14} className="text-blue-500" /> NEA Admission Gate: READY
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !note.trim()}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base transition-all ${
                isAnalyzing || !note.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-950 text-white hover:bg-black border-b-4 border-slate-800 shadow-xl active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Activity size={20} className="text-emerald-400" />
              )}
              COMMIT TO LATTICE
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        {!insights && !isAnalyzing && (
          <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <History size={32} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Awaiting Local Context</h3>
            <p className="text-xs font-medium max-w-xs leading-relaxed uppercase tracking-tight">
              Node idling. Input data to trigger 144-resonant inference summary.
            </p>
          </div>
        )}

        {insights && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 pb-8">
            {/* Clinical Summary */}
            <div className="bg-slate-950 p-8 rounded-[32px] shadow-lg relative overflow-hidden border border-slate-800">
              <h3 className="text-[10px] font-black text-emerald-400 mb-4 uppercase tracking-[0.2em]">Validated Clinical Summary</h3>
              <p className="text-white text-lg leading-relaxed font-semibold italic opacity-90">
                "{insights.summary}"
              </p>
              <div className="absolute top-0 right-0 p-4">
                 <Lock size={16} className="text-emerald-500/30" />
              </div>
            </div>

            {/* Risk Flags */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-300 shadow-sm">
              <h3 className="text-[10px] font-black text-rose-700 mb-6 uppercase tracking-[0.2em]">Sovereign Risk Matrix</h3>
              <div className="space-y-4">
                {insights.risks.map((risk, idx) => (
                  <div key={idx} className={`flex gap-4 p-5 rounded-2xl border ${risk.severity === 'high' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${risk.severity === 'high' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white shadow-md'}`}>
                      <AlertCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${risk.severity === 'high' ? 'text-rose-700' : 'text-slate-600'}`}>{risk.severity} Severity</div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-300 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">NEA Extracted Indicators</h4>
              <div className="flex flex-wrap gap-2">
                {insights.structuredData.medications.map((m, i) => (
                  <span key={i} className="px-3 py-2 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-black border border-emerald-100 uppercase tracking-tighter">{m}</span>
                ))}
                {insights.structuredData.diagnoses.map((d, i) => (
                  <span key={i} className="px-3 py-2 bg-slate-950 text-white rounded-lg text-xs font-bold shadow-sm uppercase tracking-tighter">{d}</span>
                ))}
              </div>
            </div>

            {/* Workflow */}
            <div className="bg-slate-900 p-8 rounded-[32px] shadow-xl text-white border border-slate-800">
              <h3 className="text-[10px] font-black text-blue-400 mb-6 uppercase tracking-[0.2em]">Mandatory Workflow</h3>
              <div className="space-y-3">
                {insights.checklist.map((item, idx) => (
                  <label key={idx} className="flex items-start gap-4 p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-500 focus:ring-blue-500" />
                    <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors leading-snug uppercase tracking-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-6 bg-rose-100 border-2 border-rose-400 rounded-3xl flex items-start gap-4 text-rose-900 shadow-lg">
            <AlertCircle size={24} className="flex-shrink-0 text-rose-600" />
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">Inference Fault</span>
              <span className="text-sm font-bold leading-snug">{error}</span>
            </div>
          </div>
        )}
      </div>

      {showLive && (
        <LiveAssistant 
          onTranscript={(t) => setNote(prev => prev + ' ' + t)} 
          onClose={() => setShowLive(false)} 
        />
      )}
    </div>
  );
};

export default ClinicalWorkspace;
