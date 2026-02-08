import { exp } from "three/tsl";

export type BaseShape = {
  id: string;
  name: string;
  glbUrl: string;
  colorIds: string[];
  topShapeIds: string[];
  previewUrl: string;
  smallGlbUrl: string;
}

export type BaseColor = {
  id: string;
  name: string;
  baseUrl: string;
  normalUrl: string;
  metalnessUrl: string;
  roughnessUrl: string;
  previewUrl: string;
}

export type TopColor = {
  id: string;
  name: string;
  className: string;
  description: string;
  baseUrl: string;
  mdfUrl: string;
  metalnessUrl: string;
  normalUrl: string;
  previewUrl: string;
  roughnessUrl: string;
  sample_previewUrl: string;
}

export type TopShape = {
  id: string;
  name: string;
  glbUrl: string;
  mdfUrl: string;
  previewUrl: string;
  defaultLength: number;
  defaultWidth: number;
};

export type ChairColor = {
  id: string;
  name: string;
  chairLegColor: string;
  chairLegMetalness: string;
  chairLegNormal: string;
  chairLegRoughness: string;
  chairTopColor: string;
  chairTopMetalness: string;
  chairTopNormal: string;
  chairTopRoughness: string;
  previewUrl: string;
  thumbnailUrl: string;
}

export type Chair = {
  id: string;
  name: string;
  glbUrl: string;
  colors: ChairColor[];
  previewUrl: string;
}
