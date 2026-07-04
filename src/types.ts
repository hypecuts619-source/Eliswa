export interface OnamSareeData {
  id: string;
  name: string;
  baseColor: string;
  borderColor: string;
  accentColor: string;
  pattern: 'plain' | 'brocade' | 'geometric' | 'mural';
  material: 'Cotton' | 'Tissue' | 'Silk';
  occasion: 'Festive' | 'Wedding' | 'Casual';
}
