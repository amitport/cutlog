const colors = require('colors');

module.exports = {
  send({subjectText, text}) {
    console.log(`\
${colors.cyan('subjectText:')}
${subjectText}
  
${colors.cyan('text:')}
${text}
`);
  }
};