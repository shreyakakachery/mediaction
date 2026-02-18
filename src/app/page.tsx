"use client";
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Sphere, MeshDistortMaterial } from '@react-three/drei';

// Note: this is a placeholder!!
function Captopril({ step }: { step: number }) {
  const position: [number, number, number] = step === 2 ? [0, 0, 0] : [-3, 0, 0];
  
  return (
    <group position={position}>
      <Sphere args={[0.4, 32, 32]}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>
      <Sphere args={[0.3, 32, 32]} position={[0.6, 0.4, 0]}>
        <meshStandardMaterial color="white" />
      </Sphere>
    </group>
  );
}

function ACEEnzyme({ step }: { step: number }) {
  if (step === 0) return null; 
  
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="cyan" transparent opacity={0.3} wireframe />
    </mesh>
  );
}

export default function MediActionPage() {
  const [step, setStep] = useState(0);
  
  const steps = [
    { label: "Medication", note: "Captopril: An ACE Inhibitor for hypertension." },
    { label: "Target", note: "ACE Enzyme: Converts Angio I to Angio II." },
    { label: "Action", note: "Binding: Captopril blocks the enzyme's active site." }
  ];

  return (
    <main className="h-screen w-full flex flex-col bg-slate-900 text-white">
      <div className="absolute top-10 left-10 z-10 max-w-md p-6 bg-slate-800/80 rounded-xl border border-slate-700 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-2">MediAction</h1>
        <p className="text-blue-400 font-mono mb-4 italic uppercase tracking-widest text-sm">
          {steps[step].label}
        </p>
        <p className="text-slate-300 mb-6">{steps[step].note}</p>
        
        <button 
          onClick={() => setStep((prev) => (prev + 1) % 3)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-semibold"
        >
          {step === 2 ? "Reset" : "Next Step"}
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Captopril step={step} />
            <ACEEnzyme step={step} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </main>
  );
}