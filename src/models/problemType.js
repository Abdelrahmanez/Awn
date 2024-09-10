const problemTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., 'donation', 'volunteering', 'both'
    description: { type: String, maxlength: 200 }
  });
  
  module.exports = mongoose.model('ProblemType', problemTypeSchema);
  