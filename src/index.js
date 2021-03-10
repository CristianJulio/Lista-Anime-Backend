const app = require("./app");

app.listen(app.get('port'), function() {
  console.log(`Server running at port ${app.get('port')}`);
});