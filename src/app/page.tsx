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
    { label: "Medication", note: currentDrug.mechanisms.lights },
    { label: "Target", note: currentDrug.mechanisms.camera },
    { label: "Action", note: currentDrug.mechanisms.action },
  ];

  return (
    <main className="h-screen w-full flex flex-col bg-slate-900 text-white overflow-hidden">
      <div className="absolute top-10 left-10 z-10 max-w-md p-6 bg-slate-800/80 rounded-xl border border-slate-700 backdrop-blur-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">MediAction</h1>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs rounded border border-blue-700">
            {currentDrug.name}
          </span>
        </div>

        <p className="text-blue-400 font-mono mb-2 italic uppercase tracking-widest text-sm">
          {steps[step].label}
        </p>
        <p className="text-slate-300 mb-6 leading-relaxed">
          {steps[step].note}
        </p>

        <button
          onClick={() => setStep((prev) => (prev + 1) % 3)}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all font-semibold shadow-lg active:scale-95"
        >
          {step === 2 ? "Reset Animation" : "Next Mechanism Step"}
        </button>
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
