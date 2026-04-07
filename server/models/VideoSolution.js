const mongoose = require('mongoose');

/**
 * VideoSolution Model
 * Registry mapping questions to video solution URLs
 * Supports YouTube, Vimeo, and direct MP4 URLs
 */
const videoSolutionSchema = new mongoose.Schema({
  // Reference to the question
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    unique: true
  },
  
  // Video URL
  videoUrl: {
    type: String,
    required: true
  },
  
  // Video platform/type
  platform: {
    type: String,
    enum: ['youtube', 'vimeo', 'mp4', 'other'],
    required: true
  },
  
  // YouTube/Vimeo video ID (extracted for embedding)
  videoId: {
    type: String,
    default: ''
  },
  
  // Start timestamp in seconds (for seeking to relevant part)
  startTime: {
    type: Number,
    default: 0
  },
  
  // End timestamp (optional, for clipping)
  endTime: {
    type: Number,
    default: null
  },
  
  // Video title
  title: {
    type: String,
    default: ''
  },
  
  // Video duration in seconds
  duration: {
    type: Number,
    default: 0
  },
  
  // Thumbnail URL
  thumbnailUrl: {
    type: String,
    default: ''
  },
  
  // Channel/Author name
  author: {
    type: String,
    default: ''
  },
  
  // Description
  description: {
    type: String,
    default: ''
  },
  
  // Language of the video
  language: {
    type: String,
    default: 'en'
  },
  
  // Is the video currently available/working
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Last verified date (to check if video still exists)
  lastVerified: {
    type: Date,
    default: Date.now
  },
  
  // View count for analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to extract video ID and set platform
videoSolutionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-detect platform and extract video ID from URL
  if (this.videoUrl) {
    const url = this.videoUrl;
    
    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (youtubeMatch) {
      this.platform = 'youtube';
      this.videoId = youtubeMatch[1];
      
      // Extract start time from URL if present
      const timeMatch = url.match(/[?&]t=(\d+)/);
      if (timeMatch && this.startTime === 0) {
        this.startTime = parseInt(timeMatch[1]);
      }
    }
    
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
      this.platform = 'vimeo';
      this.videoId = vimeoMatch[1];
    }
    
    // MP4 direct link
    if (url.endsWith('.mp4') || url.includes('.mp4?')) {
      this.platform = 'mp4';
    }
  }
  
  next();
});

// Static method: Get embed URL based on platform
videoSolutionSchema.methods.getEmbedUrl = function() {
  switch (this.platform) {
    case 'youtube':
      let url = `https://www.youtube.com/embed/${this.videoId}?rel=0&modestbranding=1`;
      if (this.startTime > 0) url += `&start=${this.startTime}`;
      if (this.endTime) url += `&end=${this.endTime}`;
      return url;
    
    case 'vimeo':
      let vimeoUrl = `https://player.vimeo.com/video/${this.videoId}`;
      if (this.startTime > 0) vimeoUrl += `#t=${this.startTime}s`;
      return vimeoUrl;
    
    case 'mp4':
      return this.videoUrl;
    
    default:
      return this.videoUrl;
  }
};

// Index for querying
videoSolutionSchema.index({ questionId: 1 });
videoSolutionSchema.index({ platform: 1, isActive: 1 });

module.exports = mongoose.model('VideoSolution', videoSolutionSchema);
