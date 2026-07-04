import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeritageSoundtrack() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInvite, setShowInvite] = useState(true);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const tanpuraNodesRef = useRef<OscillatorNode[]>([]);
  const fluteTimeoutRef = useRef<number | null>(null);
  const whisperTimeoutRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  // Sabyasachi-style Raga Scale (Bhairavi / Yaman blended scale for royal nostalgic feeling)
  // Frequencies in Hz for a soft bansuri melody
  const ragaScale = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00];

  useEffect(() => {
    // Autohide invitation after 15 seconds if ignored
    const inviteTimer = setTimeout(() => {
      setShowInvite(false);
    }, 15000);

    return () => {
      clearTimeout(inviteTimer);
      stopSound();
    };
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Main volume controller
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0.0, ctx.currentTime);
    mainGain.connect(ctx.destination);
    gainNodeRef.current = mainGain;

    // Create a very subtle delay line for ambient space (reverb-like)
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.6;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.4;

    delay.connect(delayGain);
    delayGain.connect(delay); // Feedback loop
    delayGain.connect(mainGain); // Connect to output
    
    // 1. Tanpura drone (3 rich, detuned low oscillators)
    const droneFreqs = [65.41, 98.00, 130.81]; // C2, G2, C3 deep drone
    droneFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      // Warm sawtooth/triangle blend
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), ctx.currentTime);
      
      // Slow pulsing amplitude to simulate the plucking of tanpura strings
      oscGain.gain.setValueAtTime(0.02, ctx.currentTime);
      
      osc.connect(oscGain);
      oscGain.connect(mainGain);
      oscGain.connect(delay); // Feed into delay for spaciousness

      // Slow dynamic sweeping of volume (simulates real plucking)
      const sweep = () => {
        if (!isPlayingRef.current) return;
        const now = ctx.currentTime;
        const duration = 3 + Math.random() * 4;
        oscGain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.03, now + duration / 2);
        oscGain.gain.linearRampToValueAtTime(0.01 + Math.random() * 0.01, now + duration);
        setTimeout(sweep, duration * 1000);
      };
      
      osc.start();
      tanpuraNodesRef.current.push(osc);
      
      // Start pulse animation
      setTimeout(sweep, Math.random() * 2000);
    });

    // 2. Vinyl/Tape Crackle (White noise with low pass filters and random crackles)
    try {
      // Use standard script processor node for maximum compatibility
      const bufferSize = 4096;
      const scriptNode = ctx.createScriptProcessor(bufferSize, 1, 1);
      scriptNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Soft atmospheric noise
          let val = (Math.random() * 2 - 1) * 0.003;
          // Random static dust crackle
          if (Math.random() < 0.00015) {
            val += (Math.random() * 2 - 1) * 0.25;
          }
          output[i] = val;
        }
      };
      
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      noiseFilter.Q.value = 0.5;

      scriptNode.connect(noiseFilter);
      noiseFilter.connect(mainGain);
      noiseNodeRef.current = scriptNode;
    } catch (err) {
      console.warn("Vinyl crackle node failed to compile, playing clean raga", err);
    }
  };

  // Play beautiful, random bansuri (bamboo flute) notes in the scale
  const playFluteMelody = () => {
    if (!isPlayingRef.current || !audioCtxRef.current || !gainNodeRef.current) return;

    const ctx = audioCtxRef.current;
    
    // Choose a random frequency from the raga scale
    const noteFreq = ragaScale[Math.floor(Math.random() * ragaScale.length)];
    
    // Create soft flute synthesizer
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const fluteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

    // Warm sub harmonic
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(noteFreq / 2, ctx.currentTime);
    
    // Apply soft woodwind lowpass filtering
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    
    fluteGain.gain.setValueAtTime(0, ctx.currentTime);

    // Connect nodes
    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(fluteGain);
    fluteGain.connect(gainNodeRef.current);
    
    // Also feed to delay for grand cathedral atmosphere
    const delayNode = ctx.createDelay(1.0);
    delayNode.delayTime.value = 0.5;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.5;
    fluteGain.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(gainNodeRef.current);

    const now = ctx.currentTime;
    const noteDuration = 2.5 + Math.random() * 3.5; // slow, beautiful notes
    
    // Slow Attack to mimic classical wooden flute (bansuri)
    fluteGain.gain.linearRampToValueAtTime(0.04, now + 1.2);
    // Vibrato effect (soft frequency modulation)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 4.5; // 4.5Hz vibrato
    lfoGain.gain.value = 2.5; // pitch bend depth
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    // Release phase
    fluteGain.gain.setValueAtTime(0.04, now + noteDuration - 1.0);
    fluteGain.gain.linearRampToValueAtTime(0, now + noteDuration);

    osc.start();
    subOsc.start();
    
    osc.stop(now + noteDuration);
    subOsc.stop(now + noteDuration);
    lfo.stop(now + noteDuration);

    // Schedule next note in melody
    const delayToNextNote = (noteDuration * 1000) - 500 + (Math.random() * 2500);
    fluteTimeoutRef.current = window.setTimeout(playFluteMelody, delayToNextNote);
  };

  const startSound = () => {
    try {
      initAudio();
      
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      
      isPlayingRef.current = true;
      setIsPlaying(true);
      setShowInvite(false);

      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(1.0, audioCtxRef.current.currentTime + 2.0);
      }

      // Start the woodwind raga melody
      setTimeout(playFluteMelody, 1000);
    } catch (e) {
      console.error("Audio playback error", e);
    }
  };

  const stopSound = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (fluteTimeoutRef.current) {
      clearTimeout(fluteTimeoutRef.current);
      fluteTimeoutRef.current = null;
    }

    if (whisperTimeoutRef.current) {
      clearTimeout(whisperTimeoutRef.current);
      whisperTimeoutRef.current = null;
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.0, audioCtxRef.current.currentTime + 1.0);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSound();
    } else {
      startSound();
    }
  };

  return (
    <>
      {/* Sound Invite Banner (Top-Center or Floating Elegant Card) */}
      <AnimatePresence>
        {showInvite && !isPlaying && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 z-50 w-[90%] max-w-md bg-cream/95 backdrop-blur-md border border-vintage/20 p-5 shadow-2xl text-center rounded-sm"
          >
            <div className="border border-vintage/10 p-4">
              <Music className="mx-auto text-vintage/40 mb-3" size={24} />
              <h4 className="font-display text-lg text-vintage uppercase tracking-widest mb-1">
                The Eliswa Soundscape
              </h4>
              <p className="text-xs text-vintage/70 italic tracking-wide mb-4 leading-relaxed">
                For a fully immersive heritage journey, we invite you to enable our background classical soundtrack.
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={startSound}
                  className="px-5 py-2 bg-vintage text-white border border-vintage text-[10px] tracking-widest uppercase hover:bg-vintage/90 transition-all font-medium"
                >
                  Enter with Sound
                </button>
                <button 
                  onClick={() => setShowInvite(false)}
                  className="px-5 py-2 border border-vintage/30 text-vintage text-[10px] tracking-widest uppercase hover:bg-vintage hover:text-white transition-all font-medium"
                >
                  Silence
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Floating Sound Control */}
      <div className="fixed bottom-8 left-8 z-50">
        <motion.button
          onClick={toggleSound}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 bg-cream/90 backdrop-blur-md border border-vintage/30 px-4 py-2.5 shadow-lg hover:border-vintage transition-all duration-300 rounded-full"
        >
          {isPlaying ? (
            <>
              {/* Pulsating live icon */}
              <div className="flex items-end gap-[2px] h-3 w-4">
                <span className="w-[2px] bg-vintage/80 animate-bounce" style={{ animationDuration: '0.8s' }} />
                <span className="w-[2px] bg-vintage/80 animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
                <span className="w-[2px] bg-vintage/80 animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.4s' }} />
                <span className="w-[2px] bg-vintage/80 animate-bounce" style={{ animationDuration: '1.4s', animationDelay: '0.1s' }} />
              </div>
              <span className="text-[10px] tracking-widest uppercase text-vintage font-medium">SOUND ON</span>
              <Volume2 size={14} className="text-vintage" />
            </>
          ) : (
            <>
              <div className="flex items-end gap-[2px] h-3 w-4">
                <span className="w-[2px] h-1 bg-vintage/40" />
                <span className="w-[2px] h-[3px] bg-vintage/40" />
                <span className="w-[2px] h-1 bg-vintage/40" />
                <span className="w-[2px] h-[2px] bg-vintage/40" />
              </div>
              <span className="text-[10px] tracking-widest uppercase text-vintage/70 font-medium">SOUND SILENT</span>
              <VolumeX size={14} className="text-vintage/70" />
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
