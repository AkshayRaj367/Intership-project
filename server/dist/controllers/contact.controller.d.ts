import { Request, Response, NextFunction } from 'express';
export declare class ContactController {
    static submitContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAllContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getContactById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateContactStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteContact(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getContactStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportContacts(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=contact.controller.d.ts.map