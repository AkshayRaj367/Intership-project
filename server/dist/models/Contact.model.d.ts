import mongoose from 'mongoose';
import { IContact } from '@/types';
export declare const Contact: mongoose.Model<IContact, {}, {}, {}, mongoose.Document<unknown, {}, IContact, {}, {}> & IContact & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Contact;
//# sourceMappingURL=Contact.model.d.ts.map