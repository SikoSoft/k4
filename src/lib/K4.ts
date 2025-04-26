import { assetRecordProps } from '@/components/asset-record/asset-record.models';
import {
  AssetFieldConfig,
  assetFieldMap,
  DEFAULT_DEFERRED_SHARE,
  DEFAULT_META_INFO,
  DEFAULT_PERSON_INFO,
  DEFAULT_SECTION_SUMMARY,
  K4Data,
  RecordMatrix,
  sectionConfigMap,
  SectionType,
} from '@/models/K4';

export class K4 {
  static prepareRecordMatrix(): RecordMatrix {
    const recordMatrix = Object.keys(sectionConfigMap).reduce((acc, key) => {
      const sectionKey = key as SectionType;
      const sectionConfig = sectionConfigMap[sectionKey];
      const records = [...new Array(sectionConfig.numRecords)].map(() => {
        return {
          total: 0,
          asset: '',
          buyPrice: 0,
          sellPrice: 0,
          gain: 0,
          loss: 0,
        };
      });
      acc[sectionKey] = records;
      return acc;
    }, {} as RecordMatrix);
    return recordMatrix;
  }

  static isContentManifest(content: string): boolean {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    return firstLine === '#DATABESKRIVNING_START';
  }

  static isContentData(content: string): boolean {
    const lines = content.split('\n');
    const firstLine = lines[0].trim();
    return !!firstLine.match(/^#BLANKETT/);
  }

  static import(manifest: string, data: string): K4Data {
    const k4Data: K4Data = {
      metaInfo: { ...DEFAULT_META_INFO },
      personInfo: { ...DEFAULT_PERSON_INFO },
      recordMatrix: this.prepareRecordMatrix(),
      summaryMatrix: { ...DEFAULT_SECTION_SUMMARY },
      deferredShare: { ...DEFAULT_DEFERRED_SHARE },
    };

    const importDataLines = data.split('\n');

    for (const line of importDataLines) {
      if (line.match(/^#UPPGIFT /)) {
        const fieldId = parseInt(line.replace(/^#UPPGIFT ([0-9]{4}).*/, '$1'));
        const fieldValue = line.replace(/^#UPPGIFT [0-9]{4} (.*)/, '$1');

        const fieldEntry = assetFieldMap.find(
          (entry: AssetFieldConfig) => entry.id === fieldId,
        );
        if (fieldEntry) {
          const sectionKey = fieldEntry.location[0];
          const index = fieldEntry.location[1];
          const field = fieldEntry.location[2];

          const value =
            assetRecordProps[field].control === 'text'
              ? fieldValue
              : isNaN(parseInt(fieldValue || '0'))
                ? 0
                : parseInt(fieldValue || '0');

          k4Data.recordMatrix = {
            ...k4Data.recordMatrix,
            [sectionKey]: [
              ...k4Data.recordMatrix[sectionKey].map((record, i) =>
                i === index ? { ...record, [field]: value } : record,
              ),
            ],
          };
        }
      }
    }

    return k4Data;
  }
}
