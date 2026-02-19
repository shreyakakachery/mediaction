"use client";
import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, MeshDistortMaterial } from "@react-three/drei";
import { Molecule } from "@/components/Molecule";

export default function MediActionPage() {
  const [currentDrug, setCurrentDrug] = useState<any>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const basePath = "/mediaction";
    fetch(`${basePath}/data/drugs.json`)
      .then((res) => res.json())
      .then((data) => {
        const firstDrug = data.categories[0].classes[0].drugs[0];
        if (firstDrug) {
          setCurrentDrug(firstDrug);
        }
      })
      .catch((err) => console.error("Data fetch failed:", err));
  }, []);

  if (!currentDrug) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-blue-400 font-mono">
        LOADING MOLECULAR DATA...
      </div>
    );
  }

  const steps = [
    { label: "Drug", note: currentDrug.mechanisms.lights },
    { label: "Target", note: currentDrug.mechanisms.camera },
    { label: "Action", note: currentDrug.mechanisms.action },
  ];

  return (
    <main className="h-screen w-full flex flex-col bg-slate-900 text-white overflow-hidden">
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight uppercase ">
            Medi<span className="text-blue-400">Action</span>
          </h1>
        </div>
        <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          <a href="https://github.com/shreyakakachery/mediaction">Github</a>
        </div>
      </header>

      <div className="absolute top-24 left-10 z-10 max-w-md p-6 bg-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-[25px] font-bold uppercase">
            {currentDrug.name}
          </span>
          <span className="text-slate-500 font-mono text-xs">
            0{step + 1} / 03
          </span>
        </div>

        <h2 className="text-blue-400 font-mono mb-2 uppercase tracking-widest text-sm font-bold">
          {steps[step].label}
        </h2>
        <p className="text-slate-300 mb-8 leading-relaxed min-h-[80px]">
          {steps[step].note}
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setStep((prev) => (prev - 1 + 3) % 3)}
            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all font-semibold border border-white/5 active:scale-95 disabled:opacity-30"
          >
            Back
          </button>
          <button
            onClick={() => setStep((prev) => (prev + 1) % 3)}
            className="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all font-semibold shadow-lg shadow-blue-900/20 active:scale-95"
          >
            {step === 2 ? "Restart" : "Next Step"}
          </button>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} contactShadow={false}>
            <Molecule cid={currentDrug.pubChemId} step={step} />
            <Target drug={currentDrug} step={step} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault minDistance={3} maxDistance={15} />
      </Canvas>
    </main>
  );
}

function Target({ drug, step }: { drug: any; step: number }) {
  if (step === 0) return null;

  const { color, scale, shape } = drug.targetMetadata;

  const getGeometry = () => {
    switch (shape) {
      case "receptor":
        return <boxGeometry args={[3, 1, 2]} />;
      case "channel":
        return <torusGeometry args={[scale * 0.5, 1.2, 16, 100]} />;
      case "enzyme":
      default:
        return <torusGeometry args={[scale * 0.8, scale * 0.4, 32, 64]} />;
    }
  };

  return (
    <mesh position={[0, 0, 0]}>
      {getGeometry()}
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.4}
        transparent
        opacity={step === 3 ? 0.4 : 0.1}
        roughness={0}
      />
    </mesh>
  );
}
