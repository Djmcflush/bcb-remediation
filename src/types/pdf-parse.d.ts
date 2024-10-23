declare module 'pdf-parse' {
  function parse(dataBuffer: Buffer, options?: any): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;

  export = parse;
}

declare module 'pdf-parse/lib/pdf-parse.js' {
  import parse from 'pdf-parse';
  export = parse;
}
