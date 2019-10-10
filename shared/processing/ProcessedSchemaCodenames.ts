class ProcessedSchemaCodenames {
  private processedCodenames: Set<string>;

  public constructor() {
    this.processedCodenames = new Set();
  }

  public has(codename: string) {
    return this.processedCodenames.has(codename);
  }

  public add(codename: string) {
    this.processedCodenames.add(codename);
  }
}

const codenamesMap: Map<string, ProcessedSchemaCodenames> = new Map();

export const getProcessedSchemaCodenames = (codename: string): ProcessedSchemaCodenames =>
  codenamesMap.get(codename);

export const initializeProcessedSchemaCodenames = (codename: string): void => {
  codenamesMap.set(codename, new ProcessedSchemaCodenames());
};
