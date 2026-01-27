import { create } from 'zustand';

type TreatmentState = {
  treatment: string | null;
  treatmentVariant: string | null;
  treatmentOfferingId: string | null;

  selectedAddonCodes: string[];

  setTreatment: (treatment: string | null) => void;
  setTreatmentVariant: (treatmentVariant: string | null) => void;
  setTreatmentOfferingId: (id: string | null) => void;

  toggleAddonCode: (code: string) => void;
  clearAddonCodes: () => void;

  clearTreatment: () => void;
  clearTreatmentVariant: () => void;
  clearTreatmentOfferingId: () => void;
};

const useTreatmentStore = create<TreatmentState>((set, get) => ({
  treatment: null,
  treatmentVariant: null,
  treatmentOfferingId: null,

  selectedAddonCodes: [],

  setTreatment: (treatment) => set({ treatment }),
  setTreatmentVariant: (treatmentVariant) => set({ treatmentVariant }),
  setTreatmentOfferingId: (id) => set({ treatmentOfferingId: id }),

  toggleAddonCode: (code) => {
    const current = get().selectedAddonCodes;
    const next = current.includes(code)
      ? current.filter((c) => c !== code)
      : [...current, code];
    set({ selectedAddonCodes: next });
  },

  clearAddonCodes: () => set({ selectedAddonCodes: [] }),

  clearTreatment: () => set({ treatment: null }),
  clearTreatmentVariant: () => set({ treatmentVariant: null }),
  clearTreatmentOfferingId: () => set({ treatmentOfferingId: null }),
}));

export default useTreatmentStore;
