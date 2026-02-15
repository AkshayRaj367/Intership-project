// Global type declarations for missing modules
declare module 'xss-clean' {
  const xssClean: (req: any, res: any, next: any) => void;
  export = xssClean;
}

declare module 'hpp' {
  const hpp: (options?: any) => any;
  export = hpp;
}
