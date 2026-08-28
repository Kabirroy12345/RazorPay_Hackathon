import { datasetCoreGroundTruth } from './datasetCoreGroundTruth';
import { datasetHoldoutBatch } from './datasetHoldoutBatch';
import { datasetMultiCurrencyFX } from './datasetMultiCurrencyFX';
import { datasetHighVolumeSaaS } from './datasetHighVolumeSaaS';
import { datasetAdversarialAnomalies } from './datasetAdversarialAnomalies';
import type { FinancialDataset, DatasetCategory } from '../../types/finance';

export const ALL_DATASETS: Record<DatasetCategory, FinancialDataset> = {
  CORE_BENCHMARK: datasetCoreGroundTruth,
  HOLDOUT_BATCH: datasetHoldoutBatch,
  MULTI_CURRENCY_FX: datasetMultiCurrencyFX,
  HIGH_VOLUME_SAAS: datasetHighVolumeSaaS,
  ADVERSARIAL_FRAUD: datasetAdversarialAnomalies,
  CUSTOM_UPLOAD: datasetCoreGroundTruth, // Fallback until user drops CSV
};

export const DATASET_LIST: FinancialDataset[] = [
  datasetCoreGroundTruth,
  datasetHoldoutBatch,
  datasetMultiCurrencyFX,
  datasetHighVolumeSaaS,
  datasetAdversarialAnomalies,
];
