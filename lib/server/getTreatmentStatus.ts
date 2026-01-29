import { db } from '@/db';
import { treatmentStatus } from '@/db/schema/treatment_status';

export type TreatmentStatusDTO = {
  key: string;
  labelDe: string;
  labelEn: string;
  color: string;
};

export async function getTreatmentStatus(): Promise<TreatmentStatusDTO[]> {
  const rows = await db
    .select({
      key: treatmentStatus.key,
      labelDe: treatmentStatus.labelDe,
      labelEn: treatmentStatus.labelEn,
      color: treatmentStatus.color,
    })
    .from(treatmentStatus)
    .orderBy(treatmentStatus.sortOrder);

  return rows;
}
