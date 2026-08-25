import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { RefObject } from "react";

export type Blueprint3DData = { gridSize: number; voxels: Array<{ x: number; y: number; z: number; partId: string; blockId: number; blockName: string; colorHex: string }> };

function VoxelModel({ blueprint }: { blueprint: Blueprint3DData }) {
  return <group position={[-blueprint.gridSize / 2, -blueprint.gridSize / 2, -2]}>{blueprint.voxels.map((voxel, index) => <mesh key={`${voxel.x}-${voxel.y}-${index}`} position={[voxel.x, voxel.z - 1, voxel.y]}><boxGeometry args={[.92, .92, .92]} /><meshStandardMaterial color={voxel.colorHex} roughness={.72} metalness={.05} /></mesh>)}</group>;
}

export function Blueprint3D({ blueprint, exportRef }: { blueprint: Blueprint3DData; exportRef: RefObject<HTMLDivElement | null> }) {
  return <div ref={exportRef} className="overflow-hidden border border-fuchsia-400/30 bg-[#080d1d] text-slate-100"><div className="flex items-center justify-between px-4 pt-4"><div><p className="font-pixel text-[10px] text-fuchsia-200">3D BUILD PREVIEW</p><p className="mt-2 text-xs text-slate-400">ドラッグで回転、ホイールで拡大縮小</p></div><span className="font-pixel text-[9px] text-lime-300">VIEW ONLY</span></div><div className="mt-3 h-[390px] border-y border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(41,244,255,.12),transparent_45%)]"><Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [15, 13, 16], fov: 42 }} dpr={[1, 1.5]}><ambientLight intensity={.75} /><directionalLight position={[8, 12, 8]} intensity={1.5} color="#dffeff" /><pointLight position={[-8, 6, 4]} intensity={25} color="#ff3dba" /><VoxelModel blueprint={blueprint} /><gridHelper args={[24, 24, "#29f4ff", "#1e315f"]} position={[0, -.7, 0]} /><OrbitControls enablePan={false} minDistance={8} maxDistance={31} /></Canvas></div></div>;
}
