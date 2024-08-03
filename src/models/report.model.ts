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
        trim: true
    },
    reportedBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
