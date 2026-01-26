import { create } from 'zustand';

type TreatmentState = {
  treatment: string | null;
  treatmentVariant: string | null;
  setTreatment: (treatment: string | null) => void;
  setTreatmentVariant: (treatmentVariant: string | null) => void;
  clearTreatment: () => void;
};

const useTreatmentStore = create<TreatmentState>((set) => ({
  treatment: null,
  treatmentVariant: null,
  setTreatment: (treatment) => set({ treatment }),
  setTreatmentVariant: (treatmentVariant) => set({ treatmentVariant }),
  clearTreatment: () => set({ treatment: null }),
  clearTreatmentVariant: () => set({ treatmentVariant: null }),
}));

export default useTreatmentStore;
