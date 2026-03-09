const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: ''
  },
  logo: {
    type: String,         // letter or URL
    default: ''
  },
  logoColor: {
    type: String,
    default: '#4285F4'
  },
  eligibility: {
    type: String,
    default: ''
  },
  rounds: {
    type: [String],
    default: []
  },
  salary: {
    type: String,
    default: ''
  },
  visitDate: {
    type: Date
  },
  pastQuestions: {
    type: [String],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);
