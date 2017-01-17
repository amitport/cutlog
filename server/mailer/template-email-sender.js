const requireDir = require('require-dir');
const partial = require('lodash.partial');
const assert = require('assert');

class TemplateEmailSender {
  constructor(emailSender) {
    assert(emailSender instanceof Object, 'please provide an email sender implementation');
    this.sender = emailSender;
  }

  applyTemplateAndSend(template, emailContext) {
    return this.sender.send(template.apply(emailContext));
  }

  static bindToTemplateContext(templateContext, templatesDir = './templates') {
    class BoundTemplateEmailSender extends TemplateEmailSender {}

    Object.values(requireDir(templatesDir)).forEach((EmailTemplate) => {
      BoundTemplateEmailSender.prototype[`send${EmailTemplate.name}`] =
        partial(TemplateEmailSender.prototype.applyTemplateAndSend, new EmailTemplate(templateContext));
    });

    return BoundTemplateEmailSender;
  }
}
