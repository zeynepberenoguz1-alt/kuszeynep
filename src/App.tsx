/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Trophy,
  Zap,
  Pause,
  Award,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

// --- Web Audio Synthesizer (Zero External Dependencies) ---
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playJump() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Aerodynamic wing-flutter air whoosh (filtered noise burst)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.09);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.05);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.09);
      filter.Q.value = 2.5;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.24, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. Low-frequency air displacement thrum
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback silent
    }
  }

  playScore() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Resonant dual crystal ping
      [784, 1174.66].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.035);

        gain.gain.setValueAtTime(0.22, now + i * 0.035);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.035);
        osc.stop(now + i * 0.035 + 0.23);
      });
    } catch {
      // Audio fallback silent
    }
  }

  playSpeedUp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6 triumphant chord
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.25, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.26);
      });
    } catch {
      // Audio fallback silent
    }
  }

  playHit() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Heavy visceral impact thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Crunch sound
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(120, now + 0.18);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {
      // Audio fallback silent
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // fallback
    }
  }
}

const soundManager = new SoundManager();

// --- Types & Constants ---
type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

interface PipeColorStyle {
  name: string;
  isSpecial: boolean;
  tubeDark: string;
  tubeHighlight: string;
  tubeMid: string;
  tubeCore: string;
  rimDark: string;
  rimHighlight: string;
  rimMid: string;
  rimDeep: string;
  rivetHighlight: string;
  rivetShadow: string;
  glowColor?: string;
  isRainbow?: boolean;
}

const PIPE_STYLES: { normal: PipeColorStyle; specialPresets: PipeColorStyle[] } = {
  normal: {
    name: 'Zümrüt Yeşili',
    isSpecial: false,
    tubeDark: '#064e3b',
    tubeHighlight: '#34d399',
    tubeMid: '#10b981',
    tubeCore: '#047857',
    rimDark: '#064e3b',
    rimHighlight: '#6ee7b7',
    rimMid: '#10b981',
    rimDeep: '#022c22',
    rivetHighlight: '#6ee7b7',
    rivetShadow: '#064e3b',
  },
  specialPresets: [
    {
      name: 'Gökkuşağı İridyum',
      isSpecial: true,
      isRainbow: true,
      tubeDark: '#831843',
      tubeHighlight: '#f472b6',
      tubeMid: '#c084fc',
      tubeCore: '#38bdf8',
      rimDark: '#701a75',
      rimHighlight: '#fde047',
      rimMid: '#ec4899',
      rimDeep: '#3b0764',
      rivetHighlight: '#fef08a',
      rivetShadow: '#581c87',
      glowColor: 'rgba(236, 72, 153, 0.45)',
    },
    {
      name: 'Ateş & Altın',
      isSpecial: true,
      tubeDark: '#78350f',
      tubeHighlight: '#fef08a',
      tubeMid: '#f59e0b',
      tubeCore: '#ea580c',
      rimDark: '#78350f',
      rimHighlight: '#fffbeb',
      rimMid: '#f59e0b',
      rimDeep: '#451a03',
      rivetHighlight: '#fef08a',
      rivetShadow: '#78350f',
      glowColor: 'rgba(245, 158, 11, 0.45)',
    },
    {
      name: 'Neon Mor Siber',
      isSpecial: true,
      tubeDark: '#3b0764',
      tubeHighlight: '#f5d0fe',
      tubeMid: '#c084fc',
      tubeCore: '#8b5cf6',
      rimDark: '#3b0764',
      rimHighlight: '#fae8ff',
      rimMid: '#d946ef',
      rimDeep: '#2e1065',
      rivetHighlight: '#f0abfc',
      rivetShadow: '#3b0764',
      glowColor: 'rgba(168, 85, 247, 0.45)',
    },
    {
      name: 'Safir Buz Mavisi',
      isSpecial: true,
      tubeDark: '#0f172a',
      tubeHighlight: '#67e8f9',
      tubeMid: '#0284c7',
      tubeCore: '#0369a1',
      rimDark: '#0f172a',
      rimHighlight: '#e0f2fe',
      rimMid: '#38bdf8',
      rimDeep: '#082f49',
      rivetHighlight: '#bae6fd',
      rivetShadow: '#0c4a6e',
      glowColor: 'rgba(56, 189, 248, 0.45)',
    },
  ],
};

function getPipeStyle(pipeIdx: number): PipeColorStyle {
  if (pipeIdx > 0 && pipeIdx % 4 === 0) {
    const presetIdx = Math.floor(pipeIdx / 4 - 1) % PIPE_STYLES.specialPresets.length;
    return PIPE_STYLES.specialPresets[presetIdx];
  }
  return PIPE_STYLES.normal;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
  pipeIndex: number;
  style: PipeColorStyle;
}

interface CityHouse {
  x: number;
  width: number;
  height: number;
  wallColor: string;
  roofColor: string;
  roofType: 'gable' | 'slanted' | 'flat';
  hasChimney: boolean;
  windowCols: number;
  windowRows: number;
  doorColor: string;
}

interface CityCar {
  x: number;
  speed: number;
  color: string;
  roofColor: string;
  type: 'taxi' | 'sedan' | 'beetle' | 'van';
  width: number;
  height: number;
  wheelRot: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface WindLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

interface ScoreFloater {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vy: number;
}

interface BirdSkin {
  id: string;
  name: string;
  bodyColor: string;
  wingColor: string;
  bellyColor: string;
  beakColor: string;
  eyeGlow: string;
}

const BIRD_SKINS: BirdSkin[] = [
  {
    id: 'falcon',
    name: 'Gök Şahin',
    bodyColor: '#0284c7', // Sky Blue
    wingColor: '#0369a1',
    bellyColor: '#38bdf8',
    beakColor: '#f59e0b',
    eyeGlow: '#ffffff',
  },
  {
    id: 'gold',
    name: 'Altın Kanat',
    bodyColor: '#eab308', // Amber Gold
    wingColor: '#ca8a04',
    bellyColor: '#fef08a',
    beakColor: '#ea580c',
    eyeGlow: '#ffffff',
  },
  {
    id: 'cyber',
    name: 'Neon Mor',
    bodyColor: '#8b5cf6', // Violet
    wingColor: '#6d28d9',
    bellyColor: '#c4b5fd',
    beakColor: '#f43f5e',
    eyeGlow: '#22d3ee',
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-level Game States
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [fps, setFps] = useState<number>(60);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('sky_bird_high_score') || 0);
    } catch {
      return 0;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedSkinIndex, setSelectedSkinIndex] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [speedTier, setSpeedTier] = useState<number>(1);
  const [speedAlert, setSpeedAlert] = useState<string | null>(null);
  const [totalPipesPassed, setTotalPipesPassed] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // High-Frequency FPS & Timing Refs
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(0);

  // Logic Refs for loop
  const stateRef = useRef<GameState>('START');
  const scoreRef = useRef<number>(0);
  const highScoreRef = useRef<number>(highScore);
  const selectedSkinRef = useRef<BirdSkin>(BIRD_SKINS[0]);
  const isMutedRef = useRef<boolean>(false);

  // Synchronize refs
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  useEffect(() => {
    selectedSkinRef.current = BIRD_SKINS[selectedSkinIndex];
  }, [selectedSkinIndex]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    soundManager.enabled = !isMuted;
  }, [isMuted]);

  // Dynamic High-DPI (Retina 2x/3x) Resolution Calibration
  useEffect(() => {
    const updateCanvasResolution = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Render at native device pixel ratio for crystal clear, razor sharp rendering
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    };

    updateCanvasResolution();
    window.addEventListener('resize', updateCanvasResolution);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(updateCanvasResolution);
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateCanvasResolution);
      if (observer) observer.disconnect();
    };
  }, []);

  // World physics parameters - Tuned for fast, snappy start & realistic flight
  const worldRef = useRef({
    width: 420,
    height: 680,
    groundHeight: 85,
    gravity: 0.44, // Realistic aerodynamic gravity
    jumpVelocity: -8.1, // Snappy crisp flap impulse
    basePipeSpeed: 3.8, // Noticeably faster, thrilling starting speed (was 2.5)
    currentPipeSpeed: 3.8,
    pipeGap: 148, // Balanced clearable gap
    pipeWidth: 70,
    pipeSpacing: 245, // Calibrated for 3.8 speed
    shakeDuration: 0,
    shakeIntensity: 0,
  });

  // Bird Entity with realistic aerodynamics
  const birdRef = useRef({
    x: 95,
    y: 300,
    width: 40,
    height: 28,
    vy: 0,
    rotation: 0,
    targetRotation: 0,
    wingAngle: 0,
    wingSpeed: 0.22,
    trail: [] as { x: number; y: number; alpha: number }[],
  });

  const pipesRef = useRef<Pipe[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatersRef = useRef<ScoreFloater[]>([]);
  const windLinesRef = useRef<WindLine[]>([]);
  const backgroundCloudsRef = useRef<
    { x: number; y: number; width: number; height: number; speed: number; opacity: number }[]
  >([]);
  const pipeCounterRef = useRef<number>(0);
  const housesRef = useRef<CityHouse[]>([]);
  const carsRef = useRef<CityCar[]>([]);
  const lastTimeRef = useRef<number>(0);

  // Initialize Clouds, Wind Lines, Houses & Moving Cars
  useEffect(() => {
    // 1. Drifting Clouds
    const clouds = [];
    for (let i = 0; i < 7; i++) {
      clouds.push({
        x: Math.random() * 420,
        y: 35 + Math.random() * 240,
        width: 70 + Math.random() * 95,
        height: 32 + Math.random() * 34,
        speed: 0.35 + Math.random() * 0.55,
        opacity: 0.65 + Math.random() * 0.3,
      });
    }
    backgroundCloudsRef.current = clouds;

    // 2. High-Speed Atmospheric Wind Lines
    const winds: WindLine[] = [];
    for (let i = 0; i < 14; i++) {
      winds.push({
        x: Math.random() * 420,
        y: 20 + Math.random() * 560,
        length: 25 + Math.random() * 60,
        speed: 4.8 + Math.random() * 3.5,
        opacity: 0.12 + Math.random() * 0.22,
      });
    }
    windLinesRef.current = winds;

    // 3. Colorful Houses / City Skyline
    const houses: CityHouse[] = [];
    const wallColors = [
      '#fca5a5', '#fdba74', '#fde047', '#86efac', 
      '#93c5fd', '#c4b5fd', '#f472b6', '#fed7aa',
      '#e0e7ff', '#fef08a', '#bbf7d0', '#bae6fd'
    ];
    const roofColors = ['#dc2626', '#ea580c', '#0284c7', '#059669', '#334155', '#7c3aed', '#b91c1c'];
    const doorColors = ['#991b1b', '#1e3a8a', '#14532d', '#78350f', '#4338ca'];

    let currentX = -40;
    for (let i = 0; i < 20; i++) {
      const hWidth = 38 + (i * 7) % 24;
      const hHeight = 56 + (i * 11) % 48;
      const wallColor = wallColors[i % wallColors.length];
      const roofColor = roofColors[(i * 3) % roofColors.length];
      const roofType = (['gable', 'slanted', 'flat'] as const)[i % 3];
      const hasChimney = i % 2 === 0;

      houses.push({
        x: currentX,
        width: hWidth,
        height: hHeight,
        wallColor,
        roofColor,
        roofType,
        hasChimney,
        windowCols: hWidth > 46 ? 2 : 1,
        windowRows: hHeight > 74 ? 3 : 2,
        doorColor: doorColors[i % doorColors.length],
      });
      currentX += hWidth + 6;
    }
    housesRef.current = houses;

    // 4. Moving Street Cars
    const cars: CityCar[] = [
      {
        x: 35,
        speed: 1.8,
        color: '#eab308', // Yellow City Taxi
        roofColor: '#facc15',
        type: 'taxi',
        width: 38,
        height: 15,
        wheelRot: 0,
      },
      {
        x: 165,
        speed: 2.4,
        color: '#ef4444', // Red Sports Beetle
        roofColor: '#dc2626',
        type: 'beetle',
        width: 32,
        height: 16,
        wheelRot: 0,
      },
      {
        x: 295,
        speed: 1.5,
        color: '#06b6d4', // Cyan Delivery Van
        roofColor: '#0891b2',
        type: 'van',
        width: 44,
        height: 19,
        wheelRot: 0,
      },
      {
        x: 420,
        speed: 2.1,
        color: '#8b5cf6', // Violet Cruiser
        roofColor: '#7c3aed',
        type: 'sedan',
        width: 36,
        height: 14,
        wheelRot: 0,
      },
    ];
    carsRef.current = cars;
  }, []);

  // Reset Game variables
  const resetGame = useCallback(() => {
    const w = worldRef.current;
    birdRef.current.x = 95;
    birdRef.current.y = w.height * 0.42;
    birdRef.current.vy = 0;
    birdRef.current.rotation = 0;
    birdRef.current.targetRotation = 0;
    birdRef.current.trail = [];

    pipesRef.current = [];
    particlesRef.current = [];
    floatersRef.current = [];

    pipeCounterRef.current = 1;
    const firstStyle = getPipeStyle(1);

    // Pre-seed first pipe with comfortable runway
    const firstPipeX = w.width + 120;
    const minH = 70;
    const maxH = w.height - w.groundHeight - w.pipeGap - 70;
    const initialHeight = minH + Math.random() * (maxH - minH);

    pipesRef.current.push({
      x: firstPipeX,
      topHeight: initialHeight,
      bottomY: initialHeight + w.pipeGap,
      width: w.pipeWidth,
      passed: false,
      pipeIndex: 1,
      style: firstStyle,
    });

    setScore(0);
    setTotalPipesPassed(0);
    setSpeedMultiplier(1.0);
    setSpeedTier(1);
    setSpeedAlert(null);
    setIsNewRecord(false);
    w.currentPipeSpeed = w.basePipeSpeed;
    w.shakeDuration = 0;
  }, []);

  // Handle Flap / Jump
  const handleFlap = useCallback(() => {
    if (stateRef.current === 'START') {
      soundManager.playClick();
      resetGame();
      setGameState('PLAYING');
      birdRef.current.vy = worldRef.current.jumpVelocity;
      soundManager.playJump();
      return;
    }

    if (stateRef.current === 'GAMEOVER') {
      soundManager.playClick();
      resetGame();
      setGameState('PLAYING');
      birdRef.current.vy = worldRef.current.jumpVelocity;
      soundManager.playJump();
      return;
    }

    if (stateRef.current === 'PAUSED') {
      return;
    }

    if (stateRef.current === 'PLAYING') {
      birdRef.current.vy = worldRef.current.jumpVelocity;
      soundManager.playJump();

      // Spawn subtle flap puffs
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: birdRef.current.x - 14,
          y: birdRef.current.y + 6 + (Math.random() * 10 - 5),
          vx: -(1 + Math.random() * 2),
          vy: Math.random() * 2 - 1,
          radius: 3 + Math.random() * 3,
          color: '#ffffff',
          alpha: 0.65,
          decay: 0.05,
        });
      }
    }
  }, [resetGame]);

  // Keyboard handlers (Spacebar, Escape, P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlap();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (stateRef.current === 'PLAYING') {
          setGameState('PAUSED');
        } else if (stateRef.current === 'PAUSED') {
          setGameState('PLAYING');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlap]);

  // Main 60fps Game Loop & Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;

    const gameLoop = (timestamp: number) => {
      // High-Frequency Live FPS Counter
      frameCountRef.current++;
      if (!lastFpsTimeRef.current) lastFpsTimeRef.current = timestamp;
      if (timestamp - lastFpsTimeRef.current >= 400) {
        const measuredFps = Math.round((frameCountRef.current * 1000) / (timestamp - lastFpsTimeRef.current));
        setFps(measuredFps);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = timestamp;
      }

      // High-DPI & High-Refresh Delta Time (normalized to 60 FPS standard step)
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaMs = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Safe clamp delta to prevent jumping when tab is backgrounded
      const safeDeltaMs = Math.min(deltaMs, 40);
      const dt = safeDeltaMs / (1000 / 60);

      const w = worldRef.current;
      const bird = birdRef.current;
      const isPlaying = stateRef.current === 'PLAYING';
      const isGameOver = stateRef.current === 'GAMEOVER';

      // Clear full native canvas buffer
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // High-DPI Crisp Scale Mapping (maps virtual 420x680 to physical retina pixels)
      const scaleX = canvas.width / w.width;
      const scaleY = canvas.height / w.height;
      ctx.scale(scaleX, scaleY);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Screen Shake update
      let shakeX = 0;
      let shakeY = 0;
      if (w.shakeDuration > 0) {
        w.shakeDuration -= dt;
        shakeX = (Math.random() - 0.5) * w.shakeIntensity;
        shakeY = (Math.random() - 0.5) * w.shakeIntensity;
      }

      ctx.translate(shakeX, shakeY);

      // --- 1. RENDER SKY BACKGROUND (Modern Bright Day Theme with God Rays) ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, w.height - w.groundHeight);
      skyGrad.addColorStop(0, '#0284c7'); // Vivid Deep Azure Sky
      skyGrad.addColorStop(0.35, '#38bdf8');
      skyGrad.addColorStop(0.75, '#bae6fd');
      skyGrad.addColorStop(1, '#f0f9ff'); // Atmospheric Horizon
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w.width, w.height);

      // Render Soft Sun with Volumetric Lens Glow
      const sunX = w.width * 0.82;
      const sunY = 90;
      const sunHalo = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 85);
      sunHalo.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
      sunHalo.addColorStop(0.4, 'rgba(253, 224, 71, 0.25)');
      sunHalo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 85, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core with corona
      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 24, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric God Rays (Sunbeams slicing across the sky)
      ctx.save();
      const rayAngles = [-0.55, -0.32, -0.08, 0.16];
      rayAngles.forEach((ang) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(ang + 1.2) * 650, sunY + Math.sin(ang + 1.2) * 650);
        ctx.lineTo(sunX + Math.cos(ang + 1.34) * 650, sunY + Math.sin(ang + 1.34) * 650);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // --- 2. PARALLAX DISTANT MOUNTAIN RIDGES & CITY ---
      // Distant Hazy Mountains
      const mtnGrad = ctx.createLinearGradient(0, w.height - 240, 0, w.height - w.groundHeight);
      mtnGrad.addColorStop(0, 'rgba(125, 211, 252, 0.45)');
      mtnGrad.addColorStop(1, 'rgba(224, 242, 254, 0.85)');
      ctx.fillStyle = mtnGrad;
      ctx.beginPath();
      ctx.moveTo(0, w.height - w.groundHeight);
      ctx.lineTo(0, w.height - w.groundHeight - 120);
      ctx.lineTo(70, w.height - w.groundHeight - 165);
      ctx.lineTo(150, w.height - w.groundHeight - 115);
      ctx.lineTo(240, w.height - w.groundHeight - 180);
      ctx.lineTo(330, w.height - w.groundHeight - 130);
      ctx.lineTo(w.width, w.height - w.groundHeight - 170);
      ctx.lineTo(w.width, w.height - w.groundHeight);
      ctx.closePath();
      ctx.fill();

      // --- 2. HOUSES & TOWN LAYER (Charming Colorful Houses with Roofs, Windows & Chimneys) ---
      const houseScrollSpeed = isPlaying ? (w.currentPipeSpeed * 0.45) : 0.6;
      const roadY = w.height - w.groundHeight - 24;

      housesRef.current.forEach((house) => {
        if (isPlaying || stateRef.current === 'START') {
          house.x -= houseScrollSpeed * dt;
          if (house.x + house.width < -60) {
            let maxX = 0;
            housesRef.current.forEach((h) => {
              if (h.x > maxX) maxX = h.x + h.width + 6;
            });
            house.x = Math.max(maxX, w.width + 10);
          }
        }

        const hY = roadY - house.height;

        // House Main Facade
        ctx.fillStyle = house.wallColor;
        ctx.fillRect(house.x, hY, house.width, house.height);

        // Subtle side depth outline
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(house.x, hY, house.width, house.height);

        // Roofs (Gable, Slanted or Flat Eaves)
        ctx.fillStyle = house.roofColor;
        ctx.beginPath();
        if (house.roofType === 'gable') {
          ctx.moveTo(house.x - 3.5, hY);
          ctx.lineTo(house.x + house.width * 0.5, hY - 17);
          ctx.lineTo(house.x + house.width + 3.5, hY);
        } else if (house.roofType === 'slanted') {
          ctx.moveTo(house.x - 2, hY);
          ctx.lineTo(house.x + house.width, hY - 13);
          ctx.lineTo(house.x + house.width + 3, hY);
        } else {
          ctx.roundRect(house.x - 2, hY - 5, house.width + 4, 5, [2, 2, 0, 0]);
        }
        ctx.closePath();
        ctx.fill();

        // Chimney with Smoke Puff
        if (house.hasChimney) {
          const chX = house.x + house.width * 0.7;
          const chY = hY - 16;
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(chX, chY, 6, 12);
          ctx.fillStyle = '#7f1d1d';
          ctx.fillRect(chX - 1, chY, 8, 2.5);

          // Chimney smoke puff with strictly non-negative radius
          const smokeOffset = ((timestamp * 0.04 + Math.abs(house.x) * 2) % 35 + 35) % 35;
          const smokeRadius = Math.max(0.5, 2.5 + smokeOffset * 0.12);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(chX + 3 - smokeOffset * 0.25, chY - 4 - smokeOffset * 0.6, smokeRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Framed Windows with Cozy Interior Glow
        const colW = house.width / (house.windowCols + 1);
        const rowH = (house.height - 22) / house.windowRows;
        for (let r = 0; r < house.windowRows; r++) {
          for (let c = 0; c < house.windowCols; c++) {
            const wx = house.x + colW * (c + 1) - 4;
            const wy = hY + 10 + r * rowH;

            // Frame
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(wx - 1, wy - 1, 9, 11);
            // Window Glass (warm ambient glow)
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(wx, wy, 7, 9);
            // Panes
            ctx.fillStyle = '#64748b';
            ctx.fillRect(wx + 3, wy, 1, 9);
            ctx.fillRect(wx, wy + 4, 7, 1);
          }
        }

        // Front Door
        ctx.fillStyle = house.doorColor;
        ctx.beginPath();
        ctx.roundRect(house.x + house.width * 0.5 - 4.5, roadY - 14, 9, 14, [2.5, 2.5, 0, 0]);
        ctx.fill();
        // Brass Doorknob
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(house.x + house.width * 0.5 + 2, roadY - 7, 0.9, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 3. STREET / ROADWAY & MOVING CARS ---
      // Dark Asphalt Road Surface
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, roadY, w.width, 24);

      // Concrete Curb Top Edge
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, roadY, w.width, 2);

      // White Dashed Center Lane Markings
      const roadScroll = (timestamp * 0.1 * (isPlaying ? w.currentPipeSpeed : 1.4)) % 26;
      ctx.fillStyle = '#f8fafc';
      for (let rx = -roadScroll; rx < w.width + 26; rx += 26) {
        ctx.fillRect(rx, roadY + 11, 13, 2);
      }

      // Moving Street Cars (Taxis, Beetles, Vans, Cruisers)
      carsRef.current.forEach((car) => {
        if (isPlaying || stateRef.current === 'START') {
          // Cars cruise smoothly along the street
          car.x -= (car.speed + (isPlaying ? w.currentPipeSpeed * 0.28 : 0.4)) * dt;
          car.wheelRot += 0.22 * dt;

          if (car.x + car.width < -60) {
            car.x = w.width + 20 + Math.random() * 90;
          }
        }

        const carY = roadY + 3;

        // Contact Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(car.x + car.width * 0.5, roadY + 19, car.width * 0.46, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main Car Chassis
        ctx.fillStyle = car.color;
        ctx.beginPath();
        ctx.roundRect(car.x, carY + 6, car.width, car.height - 6, [3, 4, 1.5, 1.5]);
        ctx.fill();

        // Car Cabin / Curved Roof
        ctx.fillStyle = car.roofColor;
        ctx.beginPath();
        if (car.type === 'beetle') {
          ctx.ellipse(car.x + car.width * 0.48, carY + 7, car.width * 0.3, 7, 0, Math.PI, 0);
        } else if (car.type === 'van') {
          ctx.roundRect(car.x + 2, carY, car.width - 4, 8, [3, 3, 0, 0]);
        } else {
          ctx.moveTo(car.x + 5, carY + 6);
          ctx.lineTo(car.x + 10, carY);
          ctx.lineTo(car.x + car.width - 8, carY);
          ctx.lineTo(car.x + car.width - 3, carY + 6);
        }
        ctx.closePath();
        ctx.fill();

        // Taxi Sign on Roof
        if (car.type === 'taxi') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(car.x + car.width * 0.5 - 5, carY - 4, 10, 4);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(car.x + car.width * 0.5 - 4, carY - 3, 8, 2);
        }

        // Glass Windows with Glint
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(car.x + 8, carY + 1.5, car.width * 0.28, 4.5);
        ctx.fillRect(car.x + 8 + car.width * 0.32, carY + 1.5, car.width * 0.24, 4.5);

        // Headlight (Yellow Beam facing forward)
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(car.x + 1.2, carY + 9, 2, 0, Math.PI * 2);
        ctx.fill();

        // Soft Forward Headlight Beam on Asphalt
        ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
        ctx.beginPath();
        ctx.moveTo(car.x, carY + 9);
        ctx.lineTo(car.x - 28, carY + 4);
        ctx.lineTo(car.x - 28, carY + 15);
        ctx.closePath();
        ctx.fill();

        // Red Taillight
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(car.x + car.width - 2, carY + 8, 2, 3);

        // Spinning Wheels with Chrome Hubcaps
        const wheelY = roadY + 16;
        const frontWheelX = car.x + 6;
        const rearWheelX = car.x + car.width - 6;
        [frontWheelX, rearWheelX].forEach((wx) => {
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(wx, wheelY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.arc(wx, wheelY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // --- 3. VOLUMETRIC CLOUDS (Shaded top & underside) ---
      backgroundCloudsRef.current.forEach((cloud) => {
        if (isPlaying || stateRef.current === 'START') {
          cloud.x -= cloud.speed * (isPlaying ? w.currentPipeSpeed / w.basePipeSpeed : 0.8) * dt;
          if (cloud.x + cloud.width < 0) {
            cloud.x = w.width + 30;
            cloud.y = 35 + Math.random() * 240;
          }
        }

        const cx = cloud.x;
        const cy = cloud.y;
        const cw = cloud.width;
        const ch = cloud.height;

        // Underside Atmospheric Shadow
        ctx.fillStyle = `rgba(186, 215, 233, ${cloud.opacity * 0.75})`;
        ctx.beginPath();
        ctx.arc(cx + ch * 0.5, cy + ch * 0.55, ch * 0.48, 0, Math.PI * 2);
        ctx.arc(cx + cw * 0.45, cy + ch * 0.4, ch * 0.56, 0, Math.PI * 2);
        ctx.arc(cx + cw * 0.75, cy + ch * 0.55, ch * 0.44, 0, Math.PI * 2);
        ctx.rect(cx + ch * 0.4, cy + ch * 0.35, cw * 0.45, ch * 0.65);
        ctx.fill();

        // Top Sunlight Highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
        ctx.beginPath();
        ctx.arc(cx + ch * 0.48, cy + ch * 0.46, ch * 0.45, 0, Math.PI * 2);
        ctx.arc(cx + cw * 0.44, cy + ch * 0.32, ch * 0.52, 0, Math.PI * 2);
        ctx.arc(cx + cw * 0.73, cy + ch * 0.46, ch * 0.41, 0, Math.PI * 2);
        ctx.rect(cx + ch * 0.38, cy + ch * 0.22, cw * 0.45, ch * 0.6);
        ctx.fill();
      });

      // --- 4. REALISTIC HIGH-SPEED ATMOSPHERIC WIND STREAKS ---
      windLinesRef.current.forEach((wl) => {
        if (isPlaying) {
          wl.x -= wl.speed * (w.currentPipeSpeed / w.basePipeSpeed) * dt;
          if (wl.x + wl.length < 0) {
            wl.x = w.width + 10 + Math.random() * 80;
            wl.y = 20 + Math.random() * (w.height - w.groundHeight - 40);
          }
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${wl.opacity})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(wl.x, wl.y);
        ctx.lineTo(wl.x + wl.length, wl.y);
        ctx.stroke();
      });

      // --- 5. PIPES LOGIC & DRAWING ---
      if (isPlaying) {
        // Spawn pipes dynamically
        const lastPipe = pipesRef.current[pipesRef.current.length - 1];
        if (!lastPipe || w.width - lastPipe.x >= w.pipeSpacing) {
          const minHeight = 70;
          const maxHeight = w.height - w.groundHeight - w.pipeGap - 70;
          const randomTop = minHeight + Math.random() * (maxHeight - minHeight);

          const nextIdx = ++pipeCounterRef.current;
          const style = getPipeStyle(nextIdx);

          pipesRef.current.push({
            x: w.width + 10,
            topHeight: randomTop,
            bottomY: randomTop + w.pipeGap,
            width: w.pipeWidth,
            passed: false,
            pipeIndex: nextIdx,
            style: style,
          });
        }

        // Update pipe positions
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const p = pipesRef.current[i];
          p.x -= w.currentPipeSpeed * dt;

          // Check passing for Score (+10 pts as requested)
          if (!p.passed && p.x + p.width < bird.x) {
            p.passed = true;
            const newScore = scoreRef.current + 10;
            scoreRef.current = newScore;
            setScore(newScore);
            setTotalPipesPassed((prev) => prev + 1);

            const isSpecialPipe = p.style?.isSpecial;
            if (isSpecialPipe) {
              // Special 4th colorful pipe celebratory floater
              floatersRef.current.push({
                x: bird.x - 20,
                y: bird.y - 20,
                text: `+10 ⭐ ${p.style.name}!`,
                alpha: 1,
                vy: -2.0,
              });

              // Vibrant rainbow starburst sparkles around the special pipe
              const burstColors = ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8', '#10b981', '#f59e0b', '#fde047'];
              for (let s = 0; s < 18; s++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 2 + Math.random() * 4.5;
                particlesRef.current.push({
                  x: p.x + p.width * 0.5,
                  y: p.topHeight + w.pipeGap * 0.5 + (Math.random() * 40 - 20),
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  radius: 3 + Math.random() * 3.5,
                  color: burstColors[s % burstColors.length],
                  alpha: 1,
                  decay: 0.024,
                });
              }
            } else {
              // Standard floating "+10" effect
              floatersRef.current.push({
                x: bird.x + 10,
                y: bird.y - 15,
                text: '+10',
                alpha: 1,
                vy: -1.8,
              });
            }

            // High score check
            if (newScore > highScoreRef.current) {
              highScoreRef.current = newScore;
              setHighScore(newScore);
              setIsNewRecord(true);
              try {
                localStorage.setItem('sky_bird_high_score', String(newScore));
              } catch {
                // ignore
              }
            }

            // --- SPEED INCREASE RULE ---
            // "her 50 puanda hız %10 artsın"
            if (newScore > 0 && newScore % 50 === 0) {
              const tier = Math.floor(newScore / 50) + 1;
              const multiplier = 1 + (tier - 1) * 0.1;
              w.currentPipeSpeed = w.basePipeSpeed * multiplier;
              setSpeedMultiplier(Number(multiplier.toFixed(2)));
              setSpeedTier(tier);
              setSpeedAlert(`HIZ %10 ARTTI! (Kademe ${tier})`);
              soundManager.playSpeedUp();

              // Clean alert after 2.4s
              setTimeout(() => {
                setSpeedAlert(null);
              }, 2400);

              // Celebration confetti
              for (let k = 0; k < 22; k++) {
                particlesRef.current.push({
                  x: bird.x,
                  y: bird.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  radius: 3 + Math.random() * 3,
                  color: ['#38bdf8', '#fbbf24', '#34d399', '#f472b6', '#a855f7'][Math.floor(Math.random() * 5)],
                  alpha: 1,
                  decay: 0.025,
                });
              }
            } else {
              soundManager.playScore();
            }
          }

          // Cull off-screen pipes
          if (p.x + p.width < -30) {
            pipesRef.current.splice(i, 1);
          }
        }
      }

      // Draw Pipes (High-Realism Industrial Metallic Cylinders with Flanged Collars & Rivets - Supports Every 4th Colorful Pipe)
      pipesRef.current.forEach((p) => {
        const rimHeight = 28;
        const rimExtend = 6;
        const rimX = p.x - rimExtend;
        const rimW = p.width + rimExtend * 2;
        const st = p.style || PIPE_STYLES.normal;

        // Custom metallic gradient based on pipe style (Emerald, Rainbow Hologram, Amber Gold, Cyber Violet, Ice Sapphire)
        const createTubeGrad = (startX: number, width: number) => {
          const grad = ctx.createLinearGradient(startX, 0, startX + width, 0);
          if (st.isRainbow) {
            grad.addColorStop(0, '#831843'); // Pink / Magenta
            grad.addColorStop(0.2, '#f472b6');
            grad.addColorStop(0.4, '#c084fc'); // Purple
            grad.addColorStop(0.65, '#38bdf8'); // Sky Cyan
            grad.addColorStop(0.85, '#34d399'); // Emerald
            grad.addColorStop(1, '#fde047'); // Gold
          } else {
            grad.addColorStop(0, st.tubeDark);
            grad.addColorStop(0.12, st.tubeDark);
            grad.addColorStop(0.28, st.tubeHighlight);
            grad.addColorStop(0.45, st.tubeMid);
            grad.addColorStop(0.82, st.tubeCore);
            grad.addColorStop(1, st.rimDeep);
          }
          return grad;
        };

        const createRimGrad = (startX: number, width: number) => {
          const grad = ctx.createLinearGradient(startX, 0, startX + width, 0);
          if (st.isRainbow) {
            grad.addColorStop(0, '#701a75');
            grad.addColorStop(0.2, '#f472b6');
            grad.addColorStop(0.45, '#e879f9');
            grad.addColorStop(0.7, '#67e8f9');
            grad.addColorStop(1, '#fde047');
          } else {
            grad.addColorStop(0, st.rimDark);
            grad.addColorStop(0.15, st.tubeMid);
            grad.addColorStop(0.3, st.rimHighlight);
            grad.addColorStop(0.6, st.rimMid);
            grad.addColorStop(0.9, st.tubeCore);
            grad.addColorStop(1, st.rimDeep);
          }
          return grad;
        };

        // If special 4th pipe, add ambient colored glow aura
        if (st.isSpecial && st.glowColor) {
          ctx.save();
          ctx.shadowColor = st.glowColor;
          ctx.shadowBlur = 14;
        }

        // --- Top Pipe Tube ---
        ctx.fillStyle = createTubeGrad(p.x, p.width);
        ctx.fillRect(p.x, 0, p.width, p.topHeight);

        // Top Pipe Rim / Collar
        const topRimY = p.topHeight - rimHeight;
        ctx.fillStyle = createRimGrad(rimX, rimW);
        ctx.beginPath();
        ctx.roundRect(rimX, topRimY, rimW, rimHeight, [0, 0, 8, 8]);
        ctx.fill();

        if (st.isSpecial && st.glowColor) {
          ctx.restore();
        }

        // 3D Rim Bevel & Inner Cavity Rim Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(p.x, topRimY - 4, p.width, 4);

        // Industrial Rivet Studs on Collar
        for (let rx = rimX + 7; rx < rimX + rimW - 4; rx += 13) {
          ctx.fillStyle = st.rivetHighlight;
          ctx.beginPath();
          ctx.arc(rx, topRimY + rimHeight * 0.5, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = st.rivetShadow;
          ctx.beginPath();
          ctx.arc(rx + 0.6, topRimY + rimHeight * 0.5 + 0.6, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Top Pipe Edge Outlines
        ctx.strokeStyle = st.rimDeep;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(p.x, -2, p.width, p.topHeight);
        ctx.strokeRect(rimX, topRimY, rimW, rimHeight);

        // Special 4th Pipe Badge / Star on Rim
        if (st.isSpecial) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(rimX + rimW * 0.5, topRimY + rimHeight * 0.5, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(rimX + rimW * 0.5, topRimY + rimHeight * 0.5, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // If special 4th pipe, add ambient colored glow aura
        if (st.isSpecial && st.glowColor) {
          ctx.save();
          ctx.shadowColor = st.glowColor;
          ctx.shadowBlur = 14;
        }

        // --- Bottom Pipe Tube ---
        const bottomHeight = w.height - w.groundHeight - p.bottomY;
        ctx.fillStyle = createTubeGrad(p.x, p.width);
        ctx.fillRect(p.x, p.bottomY, p.width, bottomHeight);

        // Bottom Pipe Rim / Collar
        ctx.fillStyle = createRimGrad(rimX, rimW);
        ctx.beginPath();
        ctx.roundRect(rimX, p.bottomY, rimW, rimHeight, [8, 8, 0, 0]);
        ctx.fill();

        if (st.isSpecial && st.glowColor) {
          ctx.restore();
        }

        // Collar Shadow cast onto the lower tube
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(p.x, p.bottomY + rimHeight, p.width, 6);

        // Industrial Rivet Studs on Bottom Collar
        for (let rx = rimX + 7; rx < rimX + rimW - 4; rx += 13) {
          ctx.fillStyle = st.rivetHighlight;
          ctx.beginPath();
          ctx.arc(rx, p.bottomY + rimHeight * 0.5, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = st.rivetShadow;
          ctx.beginPath();
          ctx.arc(rx + 0.6, p.bottomY + rimHeight * 0.5 + 0.6, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Special 4th Pipe Badge on Bottom Rim
        if (st.isSpecial) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(rimX + rimW * 0.5, p.bottomY + rimHeight * 0.5, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(rimX + rimW * 0.5, p.bottomY + rimHeight * 0.5, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = st.rimDeep;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(p.x, p.bottomY, p.width, bottomHeight);
        ctx.strokeRect(rimX, p.bottomY, rimW, rimHeight);
      });

      // --- 6. REALISTIC BIRD FLIGHT PHYSICS & COLLISION DETECTION ---
      if (isPlaying) {
        bird.vy += w.gravity * dt;
        bird.vy *= Math.pow(0.988, dt); // Aerodynamic drag capping terminal dive velocity
        bird.y += bird.vy * dt;

        // Smooth aerodynamic pitch interpolation (realistic flight inertia)
        if (bird.vy < 0) {
          bird.targetRotation = Math.max(-0.46, bird.vy * 0.052);
        } else {
          bird.targetRotation = Math.min(1.22, bird.vy * 0.092);
        }
        bird.rotation += (bird.targetRotation - bird.rotation) * (1 - Math.pow(1 - 0.18, dt));

        // Wing flap cycle
        bird.wingAngle += bird.wingSpeed * dt;

        // Realistic aerodynamic vapor trail
        bird.trail.unshift({ x: bird.x - 14, y: bird.y, alpha: 0.45 });
        if (bird.trail.length > 8) bird.trail.pop();

        // --- Collision Check (Realistic Capsule/Circle Hitbox) ---
        const birdHitRadius = 14;
        const birdCenterX = bird.x;
        const birdCenterY = bird.y;

        // Collision with Ceiling
        if (birdCenterY - birdHitRadius <= 0) {
          triggerDeath();
        }

        // Collision with Ground
        if (birdCenterY + birdHitRadius >= w.height - w.groundHeight) {
          bird.y = w.height - w.groundHeight - birdHitRadius;
          triggerDeath();
        }

        // Collision with Pipes
        for (const p of pipesRef.current) {
          if (birdCenterX + birdHitRadius > p.x && birdCenterX - birdHitRadius < p.x + p.width) {
            // Top Pipe
            if (birdCenterY - birdHitRadius < p.topHeight) {
              triggerDeath();
              break;
            }
            // Bottom Pipe
            if (birdCenterY + birdHitRadius > p.bottomY) {
              triggerDeath();
              break;
            }
          }
        }
      } else if (stateRef.current === 'START') {
        // Natural gentle thermal soaring glide
        bird.y = w.height * 0.42 + Math.sin(timestamp * 0.004) * 10;
        bird.rotation = Math.sin(timestamp * 0.004) * 0.07;
        bird.wingAngle += 0.14 * dt;
      } else if (isGameOver) {
        // Gravity plunge with realistic terminal descent
        if (bird.y < w.height - w.groundHeight - 14) {
          bird.vy += w.gravity * 1.4 * dt;
          bird.y += bird.vy * dt;
          bird.rotation = Math.min(Math.PI / 2, bird.rotation + 0.12 * dt);
        }
      }

      function triggerDeath() {
        if (stateRef.current !== 'PLAYING') return;
        setGameState('GAMEOVER');
        soundManager.playHit();

        // Realistic Screen Shake
        w.shakeDuration = 20;
        w.shakeIntensity = 9;

        // Spawn Feather & Impact Particles
        const skin = selectedSkinRef.current;
        for (let i = 0; i < 32; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2.5 + Math.random() * 5.5;
          particlesRef.current.push({
            x: bird.x,
            y: bird.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            radius: 2.5 + Math.random() * 4,
            color: [skin.bodyColor, skin.bellyColor, skin.wingColor, '#ffffff', '#f59e0b'][
              Math.floor(Math.random() * 5)
            ],
            alpha: 1,
            decay: 0.026,
          });
        }
      }

      // --- 7. RENDER PARTICLES & AIR VORTICES ---
      // Aerodynamic wake trail
      bird.trail.forEach((t, idx) => {
        t.alpha -= 0.045 * dt;
        if (t.alpha > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${t.alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, Math.max(0.1, (8 - idx * 0.8) * t.alpha), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Feathers & impact particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 0.18 * dt; // Gravity on feathers
        pt.vx *= Math.pow(0.98, dt); // Air resistance
        pt.alpha -= pt.decay * dt;

        if (pt.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.beginPath();
          ctx.ellipse(pt.x, pt.y, Math.max(0.1, pt.radius * 1.4), Math.max(0.1, pt.radius * 0.7), pt.vx * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // Floating Score Indicators (+10)
      for (let i = floatersRef.current.length - 1; i >= 0; i--) {
        const fl = floatersRef.current[i];
        fl.y += fl.vy * dt;
        fl.alpha -= 0.022 * dt;
        if (fl.alpha <= 0) {
          floatersRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.fillStyle = `rgba(2, 132, 199, ${fl.alpha})`;
          ctx.strokeStyle = `rgba(255, 255, 255, ${fl.alpha})`;
          ctx.lineWidth = 3.5;
          ctx.font = '800 22px "Outfit", sans-serif';
          ctx.strokeText(fl.text, fl.x, fl.y);
          ctx.fillText(fl.text, fl.x, fl.y);
          ctx.restore();
        }
      }

      // --- 8. RENDER REALISTIC AVIAN CHARACTER ---
      const skin = selectedSkinRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.rotation);

      // A. Layered Aerodynamic Tail Feathers (At rear)
      const tailAngleOffset = Math.sin(bird.wingAngle * 0.7) * 0.08;
      const tailFeathers = [-0.22, 0, 0.22];
      tailFeathers.forEach((angle) => {
        ctx.save();
        ctx.rotate(angle + tailAngleOffset);
        ctx.fillStyle = skin.wingColor;
        ctx.beginPath();
        ctx.ellipse(-20, 1, 9, 3.8, 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Feather quill line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-12, 1);
        ctx.lineTo(-26, 1);
        ctx.stroke();
        ctx.restore();
      });

      // B. Tucked Aerodynamic Claws / Feet (Underneath)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(-4, 11, 7, 3, 1.5);
      ctx.fill();

      // C. Realistic Avian Body (Sleek aerodynamic teardrop)
      const bodyGrad = ctx.createRadialGradient(-3, -2, 4, 0, 0, 20);
      bodyGrad.addColorStop(0, skin.bellyColor);
      bodyGrad.addColorStop(0.65, skin.bodyColor);
      bodyGrad.addColorStop(1, skin.wingColor);

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      // Smooth contoured feathered body
      ctx.moveTo(-16, 2);
      ctx.bezierCurveTo(-16, -10, -4, -14, 8, -10);
      ctx.bezierCurveTo(18, -7, 18, 5, 8, 12);
      ctx.bezierCurveTo(-4, 15, -16, 10, -16, 2);
      ctx.closePath();
      ctx.fill();

      // D. Downy Chest & Belly Plumage Highlight
      ctx.fillStyle = skin.bellyColor;
      ctx.beginPath();
      ctx.ellipse(3, 4, 11, 7.5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // E. Multi-Layer Articulated Wing Feathers
      const wingFlap = Math.sin(bird.wingAngle);
      const wingYOffset = wingFlap * 7;
      const wingAngle = wingFlap * 0.28;

      ctx.save();
      ctx.translate(-3, 0 + wingYOffset);
      ctx.rotate(wingAngle);

      // Primary flight feathers (3 layered quills)
      const primaryOffsets = [
        { x: -5, y: 1, w: 14, h: 5, rot: -0.35 },
        { x: -3, y: 3, w: 13, h: 4.8, rot: -0.15 },
        { x: -2, y: 5, w: 11, h: 4.2, rot: 0.05 },
      ];
      primaryOffsets.forEach((f) => {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.fillStyle = skin.wingColor;
        ctx.beginPath();
        ctx.ellipse(0, 0, f.w, f.h, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Secondary Covert Feather Pad
      ctx.fillStyle = skin.bodyColor;
      ctx.beginPath();
      ctx.ellipse(-1, 0, 9, 5.5, -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // F. Avian Head, Crown & Cheeks
      // Subtle crown crest feather
      ctx.fillStyle = skin.wingColor;
      ctx.beginPath();
      ctx.moveTo(3, -12);
      ctx.lineTo(8, -16);
      ctx.lineTo(9, -11);
      ctx.closePath();
      ctx.fill();

      // Realistic Glossy Avian Eye
      const eyeX = 10;
      const eyeY = -4.5;

      // Dark orbital ring
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Vivid Iris
      const irisGrad = ctx.createRadialGradient(eyeX, eyeY, 1, eyeX, eyeY, 5);
      irisGrad.addColorStop(0, '#f59e0b');
      irisGrad.addColorStop(0.7, '#d97706');
      irisGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 4.8, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(eyeX + 0.6, eyeY, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Dual Corneal Glints (Sunlight reflection)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX + 1.8, eyeY - 1.5, 1.3, 0, Math.PI * 2); // Primary specular glint
      ctx.arc(eyeX - 1.2, eyeY + 1.6, 0.7, 0, Math.PI * 2); // Secondary ambient glint
      ctx.fill();

      // G. Sculpted Aerodynamic Beak
      // Upper Mandible with natural curve
      ctx.fillStyle = skin.beakColor;
      ctx.beginPath();
      ctx.moveTo(15, -4);
      ctx.quadraticCurveTo(21, -3, 26, 1);
      ctx.lineTo(15, 2);
      ctx.closePath();
      ctx.fill();

      // Lower Mandible
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(15, 2);
      ctx.lineTo(24, 1.5);
      ctx.lineTo(15, 5);
      ctx.closePath();
      ctx.fill();

      // Nostril cere slit
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(17, -1.8, 1.2, 0.6, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // --- 9. REALISTIC GROUND & SWAYING GRASS ---
      const groundY = w.height - w.groundHeight;

      // Stratified Soil & Deep Earth Tone Gradient
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, w.height);
      groundGrad.addColorStop(0, '#a16207'); // Top Sand/Loam
      groundGrad.addColorStop(0.2, '#854d0e'); // Rich Soil
      groundGrad.addColorStop(0.65, '#713f12'); // Earth
      groundGrad.addColorStop(1, '#451a03'); // Bedrock
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w.width, w.groundHeight);

      // Textured Earth Specks / Pebbles
      ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
      for (let gy = groundY + 22; gy < w.height - 8; gy += 16) {
        for (let gx = 10; gx < w.width; gx += 28) {
          ctx.beginPath();
          ctx.arc(gx + ((gy * 3) % 20), gy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Top Lush Grass Sod Band
      const grassSodGrad = ctx.createLinearGradient(0, groundY, 0, groundY + 18);
      grassSodGrad.addColorStop(0, '#22c55e'); // Emerald Bright
      grassSodGrad.addColorStop(0.5, '#16a34a');
      grassSodGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = grassSodGrad;
      ctx.fillRect(0, groundY, w.width, 18);

      // Realistic Wind-Swayed Grass Blades along the Crest
      const scrollSpeed = isPlaying ? w.currentPipeSpeed : 1.4;
      const grassOffset = (timestamp * 0.09 * scrollSpeed) % 18;

      ctx.fillStyle = '#15803d';
      for (let gx = -grassOffset - 18; gx < w.width + 18; gx += 10) {
        const bladeHeight = 9 + ((gx * 7) % 8);
        const windLean = Math.sin(timestamp * 0.006 + gx * 0.05) * 4 - 3;
        ctx.beginPath();
        ctx.moveTo(gx, groundY);
        ctx.quadraticCurveTo(gx + windLean, groundY - bladeHeight * 0.5, gx + windLean * 1.5, groundY - bladeHeight);
        ctx.lineTo(gx + 4, groundY);
        ctx.closePath();
        ctx.fill();
      }

      // Ground Top Divider Accent
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w.width, groundY);
      ctx.stroke();

      ctx.restore(); // Restore shake

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-slate-900 select-none overflow-hidden touch-none p-0 md:p-4">
      {/* Dynamic Background Glow for Desktop Viewport Frame */}
      <div className="absolute inset-0 bg-radial from-sky-900/40 via-slate-950 to-black pointer-events-none" />

      {/* Main Game Shell / Container (Mobile Full-Height / Desktop Smart Arcade Frame) */}
      <div className="relative w-full h-full max-w-[440px] max-h-[820px] flex flex-col bg-slate-900 shadow-2xl overflow-hidden md:rounded-3xl border-0 md:border md:border-sky-500/20">
        
        {/* Top Minimalist Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/50 via-black/25 to-transparent backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm tracking-wider text-white uppercase drop-shadow">
              Gökyüzü Kanatları
            </span>
            <span className="text-[11px] font-mono tabular-nums font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shadow-sm">
              {fps} FPS · Ultra HD
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/80 text-white shadow-sm">
              {speedMultiplier.toFixed(1)}x
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-xl bg-black/40 hover:bg-black/60 active:scale-95 text-white/90 backdrop-blur transition-all border border-white/10"
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              aria-label="Ses Kontrolü"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Pause / Resume Button (Only during active play) */}
            {gameState === 'PLAYING' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGameState('PAUSED');
                }}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 active:scale-95 text-white/90 backdrop-blur transition-all border border-white/10"
                title="Duraklat (P)"
                aria-label="Duraklat"
              >
                <Pause className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live HUD (Only visible when Playing or Paused) */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <div className="absolute top-14 left-0 right-0 z-20 pointer-events-none flex flex-col items-center">
            {/* Massive Glowing Center Score */}
            <div className="font-display font-black text-6xl text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {score}
            </div>

            {/* Speed Multiplier Pill */}
            <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/15 text-xs font-medium text-sky-200 shadow-md">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Hız Kademesi {speedTier} · {speedMultiplier.toFixed(1)}x</span>
            </div>
          </div>
        )}

        {/* Speed Increase Notification Banner (Fires every 50 points) */}
        {speedAlert && (
          <div className="absolute top-28 left-4 right-4 z-30 pointer-events-none flex justify-center animate-bounce">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 rounded-2xl shadow-xl text-white font-display font-bold text-sm tracking-wide border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>{speedAlert}</span>
            </div>
          </div>
        )}

        {/* HTML5 Game Canvas (Native Ultra HD High-DPI Resolution Scaling) */}
        <div ref={containerRef} className="relative w-full h-full flex-1 overflow-hidden">
          <canvas
            ref={canvasRef}
            onClick={handleFlap}
            onTouchStart={(e) => {
              e.preventDefault();
              handleFlap();
            }}
            className="w-full h-full block cursor-pointer select-none"
          />
        </div>

        {/* OVERLAY: START SCREEN */}
        {gameState === 'START' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950/40 via-sky-950/20 to-slate-950/80 backdrop-blur-[2px]">
            {/* Header / Brand */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>14-18 Yaş Hızlı Refleks Oyunu</span>
              </div>
              <h1 className="font-display font-black text-4xl text-white tracking-tight drop-shadow-lg">
                GÖKYÜZÜ KANATLARI
              </h1>
              <p className="mt-1 text-sky-100/80 text-sm max-w-xs mx-auto">
                Boruların arasından süzül, her geçişte 10 puan kap! Her 50 puanda hız %10 artar.
              </p>
            </div>

            {/* Character Selection Carousel */}
            <div className="w-full max-w-xs bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex justify-between">
                <span>Karakterini Seç</span>
                <span className="text-sky-400">{BIRD_SKINS[selectedSkinIndex].name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BIRD_SKINS.map((skin, idx) => {
                  const isSelected = selectedSkinIndex === idx;
                  return (
                    <button
                      key={skin.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedSkinIndex(idx);
                      }}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-sky-400 bg-sky-500/20 shadow-lg scale-105'
                          : 'border-white/10 bg-slate-800/50 hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className="w-8 h-6 rounded-full relative mb-1.5 shadow"
                        style={{ backgroundColor: skin.bodyColor }}
                      >
                        <div
                          className="absolute right-0.5 top-1.5 w-2 h-2 rounded-full"
                          style={{ backgroundColor: skin.beakColor }}
                        />
                        <div className="absolute right-2 top-1 w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-200 truncate w-full text-center">
                        {skin.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* High Score & Start CTA */}
            <div className="w-full max-w-xs flex flex-col gap-3 mb-4">
              {highScore > 0 && (
                <div className="flex items-center justify-center gap-2 text-amber-300 text-sm font-semibold bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>En Yüksek Skor: {highScore} Puan</span>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlap();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-display font-bold text-lg tracking-wide shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>Oyuna Başla</span>
              </button>

              <div className="flex items-center justify-center gap-3 text-xs text-slate-300/80">
                <span>⌨️ Boşluk Tuşu</span>
                <span>·</span>
                <span>📱 Ekrana Dokun</span>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY: PAUSED SCREEN */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/70 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-slate-900 p-6 rounded-3xl border border-white/10 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center mx-auto mb-3 text-sky-400">
                <Pause className="w-6 h-6" />
              </div>
              <h2 className="font-display font-extrabold text-2xl text-white mb-1">
                Oyun Duraklatıldı
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Şu Anki Puan: <strong className="text-white">{score}</strong>
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setGameState('PLAYING');
                  }}
                  className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Devam Et</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    resetGame();
                    setGameState('PLAYING');
                  }}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Sıfırla ve Başla</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OVERLAY: GAME OVER SCREEN */}
        {gameState === 'GAMEOVER' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-xs bg-slate-900/95 p-6 rounded-3xl border border-white/15 shadow-2xl text-center">
              {/* New Record Banner if beaten */}
              {isNewRecord && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider animate-pulse">
                  <Award className="w-3.5 h-3.5" />
                  <span>YENİ REKOR!</span>
                </div>
              )}

              <h2 className="font-display font-black text-3xl text-white tracking-tight mb-4">
                OYUN BİTTİ
              </h2>

              {/* Stats Card */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-white/10 mb-5 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-medium text-slate-400">Kazanılan Puan</span>
                  <span className="font-display font-extrabold text-2xl text-sky-400">
                    {score}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-medium text-slate-400">En Yüksek Skor</span>
                  <span className="font-display font-bold text-lg text-amber-400 flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    {highScore}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-medium text-slate-400">Geçilen Borular</span>
                  <span className="font-semibold text-sm text-slate-200">
                    {totalPipesPassed} adet
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Ulaşılan Hız</span>
                  <span className="font-semibold text-sm text-emerald-400">
                    {speedMultiplier.toFixed(1)}x (Kademe {speedTier})
                  </span>
                </div>
              </div>

              {/* Restart Button (Yeniden Başlat Butonu) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  resetGame();
                  setGameState('PLAYING');
                  birdRef.current.vy = worldRef.current.jumpVelocity;
                  soundManager.playJump();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-display font-bold text-base tracking-wide shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group mb-3"
              >
                <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform" />
                <span>Yeniden Başlat</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  resetGame();
                  setGameState('START');
                }}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Ana Menüye Dön
              </button>
            </div>
          </div>
        )}

        {/* Bottom Quick Help Bar */}
        <div className="absolute bottom-2 left-0 right-0 z-20 pointer-events-none flex items-center justify-center text-[11px] text-white/50 tracking-wider">
          <span>Boşluk veya Dokunma ile Zıpla</span>
        </div>
      </div>
    </div>
  );
}
