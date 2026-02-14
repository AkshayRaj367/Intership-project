// Global type declarations for missing modules
declare module 'xss-clean' {
  const xssClean: (req: any, res: any, next: any) => void;
  export = xssClean;
}

declare module 'hpp' {
  const hpp: (options?: any) => any;
  export = hpp;
}

declare module 'express-session' {
  interface SessionOptions {
    secret?: string;
    resave?: boolean;
    saveUninitialized?: boolean;
    cookie?: {
      secure?: boolean;
      httpOnly?: boolean;
      maxAge?: number;
    };
  }
  
  interface Store {
    get: (sid: string, callback: (err: any, data?: any) => void) => void;
    set: (sid: string, sessionData: any, callback?: (err?: any) => void) => void;
    destroy: (sid: string, callback?: (err?: any) => void) => void;
  }
  
  function MemoryStore(options?: any): Store;
}

declare global {
  namespace Express {
    interface Request {
      session: {
        user?: any;
        destroy: (callback?: (err?: any) => void) => void;
        reload: (callback?: (err?: any) => void) => void;
        save: (callback?: (err?: any) => void) => void;
        touch: (callback?: (err?: any) => void) => void;
      };
    }
  }
}
