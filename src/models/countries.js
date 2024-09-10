const countrySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., 'Egypt'
    code: { type: String, required: true, unique: true }  // e.g., 'EG'
  });
  
  module.exports = mongoose.model('Country', countrySchema);
  