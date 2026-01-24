import { create } from 'zustand';

const useTreatmentStore = create<{
  treatment: string | null;
  setTreatment: (treatment: string | null) => void;
}>((set) => ({
  treatment: null,
  setTreatment: (treatment) => set({ treatment }),
}));

export default useTreatmentStore;
