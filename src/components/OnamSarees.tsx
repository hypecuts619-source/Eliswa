import { useEffect } from 'react';
import { Collection } from './Collection';

export function OnamSarees() {
  useEffect(() => {
    document.title = "Onam Sarees 2026 | Kerala Kasavu Sarees Online – Eliswa";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Shop Eliswa's Onam saree collection — handwoven Kerala Kasavu sarees with authentic gold zari borders. Perfect for Thiruvonam, Onasadya and family celebrations. Worldwide shipping.");
    }
  }, []);

  return (
    <div className="pt-24 pb-16">
      <h1 className="sr-only">Onam Sarees – Handwoven Kerala Kasavu Sarees for Thiruvonam</h1>
      <Collection />
    </div>
  );
}
