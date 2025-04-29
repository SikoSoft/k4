import { assetRecordProps } from '@/components/asset-record/asset-record.models';
import {
  AssetFieldConfig,
  assetFieldMap,
  DEFAULT_DEFERRED_SHARE,
  DEFAULT_META_INFO,
  DEFAULT_PERSON_INFO,
  DEFAULT_SECTION_SUMMARY,
  K4Data,
  K4Page,
  RecordMatrix,
  sectionConfigMap,
  SectionType,
  SummaryFieldConfig,
  summaryFieldMap,
} from '@/models/K4';

export class K4 {
  static getDefaultK4Data(): K4Data {
    return {
      metaInfo: { ...DEFAULT_META_INFO },
      personInfo: { ...DEFAULT_PERSON_INFO },
      pages: [K4.getDefaultK4PageData()],
    };
  }

  static getDefaultK4PageData(): K4Page {
    return {
      recordMatrix: K4.prepareRecordMatrix(),
      summaryMatrix: { ...DEFAULT_SECTION_SUMMARY },
      deferredShare: { ...DEFAULT_DEFERRED_SHARE },
    };
  }

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
      pages: [K4.getDefaultK4PageData()],
    };

    const importManifestLines = manifest.split('\n');
    for (const line of importManifestLines) {
      if (line.match(/^#([A-Z]+) /)) {
        const fieldId = line.replace(/^#([A-Z]+) .*/, '$1').trim();
        const fieldValue = line.replace(/^#[A-Z]+ (.*)/, '$1').trim();
        switch (fieldId) {
          case 'ORGNR':
            k4Data.personInfo.personNumber = fieldValue;
            break;
          case 'NAMN':
            k4Data.personInfo.name = fieldValue;
            break;
          case 'POSTORT':
            k4Data.personInfo.city = fieldValue;
            break;
          case 'POSTNR':
            k4Data.personInfo.postCode = fieldValue;
            break;
        }
      }
    }

    const importDataLines = data.split('\n');

    let page = -1;

    for (const line of importDataLines) {
      if (line.match(/^#BLANKETT/)) {
        page = parseInt(line.replace(/^#BLANKETT ([0-9]{4}).*/, '$1'));
      }

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

          k4Data.pages[page].recordMatrix[sectionKey][index] = {
            ...k4Data.pages[page].recordMatrix[sectionKey][index],
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

          k4Data.pages[page].summaryMatrix[sectionKey] = {
            ...k4Data.pages[page].summaryMatrix[sectionKey],
            [field]: value,
          };
        }
      }
    }

    return k4Data;
  }
}
