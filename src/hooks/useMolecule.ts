"use client";
import { useState, useEffect } from "react";

export function useMolecule(cid: number) {
  const [atoms, setAtoms] = useState<any[]>([]);
  const [bonds, setBonds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cid) return;

    setAtoms([]);
    setBonds([]);
    setLoading(true);


    fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`,
    )
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n");

        const countsLine = lines[3];
        const atomCount = parseInt(countsLine.substring(0, 3));
        const bondCount = parseInt(countsLine.substring(3, 6));
        const extractedAtoms = [];

        for (let i = 4; i < 4 + atomCount; i++) {
          const line = lines[i].trim();
          const parts = line.split(/\s+/);

          if (parts.length >= 4) {
            extractedAtoms.push({
              x: parseFloat(parts[0]),
              y: parseFloat(parts[1]),
              z: parseFloat(parts[2]),
              element: parts[3],
            });
          }
        }

        const extractedBonds = [];
        for (let i = 4 + atomCount; i < 4 + atomCount + bondCount; i++) {
          const line = lines[i];
          extractedBonds.push({
            source: parseInt(line.substring(0, 3)) - 1,
            target: parseInt(line.substring(3, 6)) - 1,
            type: parseInt(line.substring(6, 9)),
          });
        }

        setAtoms(extractedAtoms);
        setBonds(extractedBonds);
        setLoading(false)
      })
      .catch((err) => {
        console.error("PubChem Fetch Error:", err);
        setLoading(false)
      });
  }, [cid]);

  return { atoms, bonds, loading };
}
