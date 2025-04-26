import { RecordMatrix, sectionConfigMap, SectionType } from '@/models/K4';

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
}
