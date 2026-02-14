import { IEmailOptions } from '@/types';
declare class EmailService {
    private transporter;
    constructor();
    private verifyConnection;
    sendEmail(options: IEmailOptions): Promise<boolean>;
    sendContactConfirmation(name: string, email: string, message: string): Promise<boolean>;
    sendNewContactNotification(name: string, email: string, message: string, ipAddress?: string): Promise<boolean>;
    private getContactConfirmationTemplate;
    private getNewContactNotificationTemplate;
    private stripHtml;
}
export declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=email.d.ts.map