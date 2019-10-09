import Process = NodeJS.Process;

let processedSchemaCodenames: ProcessedSchemaCodenames;

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

export const getProcessedSchemaCodenames = (): ProcessedSchemaCodenames =>
  processedSchemaCodenames;

export const initializeProcessedSchemaCodenames = (): ProcessedSchemaCodenames => {
  processedSchemaCodenames = new ProcessedSchemaCodenames();

  return processedSchemaCodenames;
};
