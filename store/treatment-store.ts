import { create } from 'zustand';

type TreatmentState = {
  treatment: string | null;
  treatmentVariant: string | null;
  treatmentOfferingId: string | null;

  setTreatment: (treatment: string | null) => void;
  setTreatmentVariant: (treatmentVariant: string | null) => void;
  setTreatmentOfferingId: (id: string | null) => void;

  clearTreatment: () => void;
  clearTreatmentVariant: () => void;
  clearTreatmentOfferingId: () => void;
};

const useTreatmentStore = create<TreatmentState>((set) => ({
  treatment: null,
  treatmentVariant: null,

  treatmentOfferingId: null,

  setTreatment: (treatment) => set({ treatment }),
  setTreatmentVariant: (treatmentVariant) => set({ treatmentVariant }),
  setTreatmentOfferingId: (id) => set({ treatmentOfferingId: id }),

  clearTreatment: () => set({ treatment: null }),
  clearTreatmentVariant: () => set({ treatmentVariant: null }),
  clearTreatmentOfferingId: () => set({ treatmentOfferingId: null }),
}));

export default useTreatmentStore;