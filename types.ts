
export interface Project {
  id: number;
  name: string;
  imageUrl: string;
  theme: 'light' | 'dark';
  galleryImages: string[];
  is360?: boolean;
}

export interface RandomImage {
  imageUrl: string;
  projectName: string;
}
