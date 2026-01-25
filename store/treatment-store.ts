import { create } from 'zustand';

type TreatmentState = {
  treatment: string | null;
  setTreatment: (treatment: string | null) => void;
  clearTreatment: () => void;
};

const useTreatmentStore = create<TreatmentState>((set) => ({
  treatment: null,
  setTreatment: (treatment) => set({ treatment }),
  clearTreatment: () => set({ treatment: null }),
}));

export default useTreatmentStore;
