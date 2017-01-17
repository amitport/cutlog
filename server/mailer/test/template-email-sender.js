const TemplateEmailSender = require('../template-email-sender');
const sinon = require('sinon');
const assert = require('assert');
const EmailTemplate = require('../email-template');

describe('mailer', () => {
  describe('TemplateEmailSender', () => {
    it('applyTemplateAndSend', () => {
      const sender = {send: sinon.spy()};
      const email = {};
      const template = {apply: sinon.stub().returns(email)};
      const emailContext = {};

      new TemplateEmailSender(sender).applyTemplateAndSend(template, emailContext);

      assert(template.apply.calledOnce);
      assert(template.apply.calledWithExactly(sinon.match.same(emailContext)));

      assert(sender.send.calledOnce);
      assert(sender.send.calledWithExactly(sinon.match.same(email)));
    });

    it('bindToTemplateContext', () => {
      const email = {};
      const templateContext = {templateContextData: true};
      const testEmailConstructorCallSpy = sinon.spy();

      class TestEmail extends EmailTemplate {
        constructor(arg) {
          super(arg);

          testEmailConstructorCallSpy();

          assert.strictEqual(arg, templateContext);
          // template context is being assigned
          assert(this.templateContextData);
        }

        apply() {
          return email;
        }
      }
      sinon.spy(TestEmail.prototype, 'apply');

      const BoundTemplateEmailSender = TemplateEmailSender.bindToTemplateContext(templateContext,
                                                                              [TestEmail]);

      assert(testEmailConstructorCallSpy.calledOnce);
      assert(BoundTemplateEmailSender.prototype.hasOwnProperty('sendTestEmail'));

      const sender = {send: sinon.spy()};
      const templateEmailSender = new BoundTemplateEmailSender(sender);

      const emailContext = {};
      templateEmailSender.sendTestEmail(emailContext);

      assert(TestEmail.prototype.apply.calledOnce);
      assert(TestEmail.prototype.apply.calledWithExactly(sinon.match.same(emailContext)));

      assert(sender.send.calledOnce);
      assert(sender.send.calledWithExactly(sinon.match.same(email)));
    });
  })
});