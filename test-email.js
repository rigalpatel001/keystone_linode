var Email = require('keystone-email');

new Email('test-email.pug', {
    transport: 'mailgun',
  }).send({}, {
    apiKey: '2327544e12b844485a23a93c91c7183e-c8e745ec-ebb96e20',
    domain: 'sandbox6668016aacef493fa22ba91d4c7c1f7a.mailgun.org',
    to: 'rigal9979@gmail.com',
    from: {
      name: 'testing Your Site',
      email: 'rigal4rock@gmail.com',
    },
    subject: 'Your first KeystoneJS email',
  }, function (err, result) {
    if (err) {
      console.error('🤕 Mailgun test failed with error:\n', err);
    } else {
      console.log('📬 Successfully sent Mailgun test with result:\n', result);
    }
  });
