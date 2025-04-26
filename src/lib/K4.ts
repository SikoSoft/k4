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
  sectionSummaryFieldAssetFieldMap,
  SectionType,
  SummaryFieldConfig,
  summaryFieldMap,
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

    const importManifestLines = manifest.split('\n');
    for (const line of importManifestLines) {
      if (line.match(/^#([A-Z]+) /)) {
        //console.log('line', line);
        const fieldId = line.replace(/^#([A-Z]+) .*/, '$1').trim();
        console.log(`fieldId (${fieldId})`);

        const fieldValue = line.replace(/^#[A-Z]+ (.*)/, '$1').trim();
        //console.log('fieldValue', fieldValue);
        switch (fieldId) {
          case 'ORGNR':
            k4Data.personInfo.personNumber = fieldValue;
            break;
          case 'NAMN':
            console.log('#################set name', fieldValue);
            k4Data.personInfo.name = fieldValue;
            break;
          case 'POSTORT':
            k4Data.personInfo.city = fieldValue;
            break;
          case 'POSTNR':
            k4Data.personInfo.postCode = fieldValue;
            break;
          default:
            console.log('#######WTF');
        }
      }
    }

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

          k4Data.recordMatrix[sectionKey][index] = {
            ...k4Data.recordMatrix[sectionKey][index],
            [field]: value,
          };
        }

        const summaryFieldEntry = summaryFieldMap.find(
          (entry: SummaryFieldConfig) => entry.id === fieldId,
        );

        if (summaryFieldEntry) {
          const sectionKey = summaryFieldEntry.location[0];
          const field = summaryFieldEntry.location[1];

          const value = parseInt(fieldValue || '0');

          k4Data.summaryMatrix[sectionKey] = {
            ...k4Data.summaryMatrix[sectionKey],
            [field]: value,
          };
        }
      }
    }

    return k4Data;
  }
}
