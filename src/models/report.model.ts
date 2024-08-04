import { match } from 'assert';
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minLegth: 3 ,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    },
    reportedBy: {
        type: String,
        required: true,
        trim: true,
        minLegth:  [4,"username must be at least 4 characters long"] ,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        minLegth:  [10,"reason must be at least 10 characters long"] ,
    }
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
