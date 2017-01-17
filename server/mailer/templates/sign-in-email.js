const EmailTemplate = require('../email-template');

module.exports = class SignInEmail extends EmailTemplate {
  apply({verificationUrl}) {
    return {
      subjectText: `sign in to ${this.siteName}`,
      html: `\
<p>
    Hello,
</p>
<p>
    You can now <a href="${verificationUrl}">sign in</a> to ${this.siteName}.<br>
    <br>
    If you didn't ask to access ${this.siteName}, you can safely ignore this email.
</p>

<p>
    Best regards,<br>
    ${this.signatureName}
</p>
`,
      text: `\
Hello,

You can now sign in to ${this.siteName} using the following link:
${verificationUrl}

If you didn't ask to access ${this.siteName}, you can safely ignore this email.

Best regards,
${this.signatureName}
`
    }
  }
};