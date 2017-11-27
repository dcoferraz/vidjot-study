if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://dcoferraz:dcoferraz@ds053678.mlab.com:53678/vidjot-dcof-prod'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot-dev'
  };
}