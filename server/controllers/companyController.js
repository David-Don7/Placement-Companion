const Company = require('../models/Company');
const ApplicationStatus = require('../models/ApplicationStatus');

// @desc    Get all companies
// @route   GET /api/company
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ visitDate: 1 });

    // Attach user's application status
    const statuses = await ApplicationStatus.find({ userId: req.user._id });
    const statusMap = {};
    statuses.forEach(s => { statusMap[s.companyId.toString()] = s.status; });

    const data = companies.map(c => ({
      _id: c._id,
      name: c.name,
      role: c.role,
      logo: c.logo,
      logoColor: c.logoColor,
      eligibility: c.eligibility,
      rounds: c.rounds,
      salary: c.salary,
      visitDate: c.visitDate,
      pastQuestions: c.pastQuestions,
      status: statusMap[c._id.toString()] || 'not-applied'
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get a single company
// @route   GET /api/company/:id
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const status = await ApplicationStatus.findOne({
      userId: req.user._id,
      companyId: company._id
    });

    res.json({
      success: true,
      data: {
        ...company.toObject(),
        status: status ? status.status : 'not-applied'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update application status
// @route   PUT /api/company/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['not-applied', 'applied', 'interviewed', 'selected', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    let appStatus = await ApplicationStatus.findOne({
      userId: req.user._id,
      companyId: company._id
    });

    if (appStatus) {
      appStatus.status = status;
      appStatus.updatedAt = Date.now();
      await appStatus.save();
    } else {
      appStatus = await ApplicationStatus.create({
        userId: req.user._id,
        companyId: company._id,
        status
      });
    }

    res.json({ success: true, data: appStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's applications
// @route   GET /api/company/applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await ApplicationStatus.find({ userId: req.user._id })
      .populate('companyId', 'name role logo visitDate');

    res.json({ success: true, data: applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
