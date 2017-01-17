module.exports = class EmailTemplate {
  constructor(templateContext) {
    Object.assign(this, templateContext);
  }

  // abstract apply(emailContext) returns {subjectText, html, txt}
};