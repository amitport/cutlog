const requireDir = require('require-dir');
const partial = require('lodash.partial');
const assert = require('assert');
const defaultTemplates = Object.values(requireDir('./templates'));

module.exports = class TemplateEmailSender {
  constructor(emailSender) {
    assert(emailSender instanceof Object, 'please provide an email sender implementation');
    this.sender = emailSender;
  }

  applyTemplateAndSend(template, emailContext) {
    return this.sender.send(template.apply(emailContext));
  }

  static bindToTemplateContext(templateContext, templates = defaultTemplates) {
    class BoundTemplateEmailSender extends TemplateEmailSender {}

    (Array.isArray(templates) ? templates : Object.values(requireDir(templates)))
      .forEach((EmailTemplate) => {
        BoundTemplateEmailSender.prototype[`send${EmailTemplate.name}`] =
          partial(TemplateEmailSender.prototype.applyTemplateAndSend, new EmailTemplate(templateContext));
      });

    return BoundTemplateEmailSender;
  }
};
