"use client";
import { useMolecule } from "@/hooks/useMolecule";
import { Center, Line } from "@react-three/drei";

const ATOM_COLORS: Record<string, string> = {
  C: "#333333",
  O: "#ff0000",
  N: "#0000ff",
  S: "#ffff00",
  H: "#ffffff",
};

export function Molecule({ cid, step }: { cid: number; step: number }) {
  const { atoms, bonds, loading } = useMolecule(cid);

  const position: [number, number, number] =
    step === 2 ? [0, 0, 0] : [-3, 0, 0];

  if (loading || !atoms.length) return null;

  return (
    <group position={position}>
      <Center>
        {atoms.map((atom, i) => (
          <mesh key={`atom-${i}`} position={[atom.x, atom.y, atom.z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={ATOM_COLORS[atom.element] || "#ff00ff"}
            />
          </mesh>
        ))}

        {bonds.map((bond, i) => {
          const start = atoms[bond.source];
          const end = atoms[bond.target];
          if (!start || !end) return null;

          const offsets =
            bond.type === 3
              ? [-0.12, 0, 0.12]
              : bond.type === 2
                ? [-0.08, 0.08]
                : [0];
          return (
            <group key={`bond-group-${i}`}>
              {offsets.map((offset, j) => (
                <Line
                  key={`line-${i}-${j}`}
                  points={[
                    [start.x, start.y + offset, start.z],
                    [end.x, end.y + offset, end.z],
                  ]}
                  color="#ffffff"
                  lineWidth={2}
                  transparent
                  opacity={0.6}
                />
              ))}
            </group>
          );
        })}
      </Center>
    </group>
  );
}
