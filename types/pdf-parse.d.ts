declare module 'pdf-parse/lib/pdf-parse.js' {
  type PdfParseOptions = {
    pagerender?: (pageData: any) => Promise<string>;
    max?: number;
    version?: string;
  };

  interface PdfParseResult {
    numpages: number;
    numrender: number;
    info: Record<string, unknown> | null;
    metadata: unknown;
    text: string;
    version: string | null;
  }

  function pdfParse(
    data: Buffer,
    options?: PdfParseOptions
  ): Promise<PdfParseResult>;

  export default pdfParse;
}

