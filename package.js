Package.describe({
  name: 'ox2:datetime-picker',
  summary: 'TESTING_DO_NOT_USE Datetime picker for meteor ',
  version: '1.3.0',
  git: ' /* Fill me in! */ '
});

var S = 'server';
var C = 'client';
var CS = [C, S];

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  // Core
  api.use([
    'templating',
    'ecmascript'
    ]);
  // 3rd party
  api.use([
    'lauricio:less-autoprefixer@2.5.0_3',
    'mquandalle:jade@0.4.1',
    'momentjs:moment@2.10.6',
    'aldeed:moment-timezone@0.4.0'
    ]);
  // ox2
  api.use([
    'ox2:colors@1.2.0',
    'ox2:buttons@1.2.1',
    'ox2:typography@1.2.0'
    ]);
  api.addFiles([
    'lib/oo-datetime-picker.jade',
    'lib/oo-datetime-picker.js',
    'lib/oo-datetime-picker.less',
    'lib/oo-clock.jade',
    'lib/oo-clock.js',
    'lib/oo-clock.less'
  ], 'client');
});

Package.onTest(function(api) {
  api.use('ox2:datetime-picker@1.0.0');
  api.use('tinytest@1.0.0');
  api.use('templating@1.0.10');
  api.use('blaze@2.0.4');
  // api.use('jquery@1.0.2');
  api.use('mquandalle:jade@0.4.1');
  api.addFiles('tests/type-test.html', C);
  api.addFiles('tests/type-test.js', C);
});
