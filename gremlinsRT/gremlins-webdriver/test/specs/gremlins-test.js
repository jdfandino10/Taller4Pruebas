function loadScript(callback) {
  var s = document.createElement('script');
  s.src = 'https://rawgithub.com/marmelab/gremlins.js/master/gremlins.min.js';
  if (s.addEventListener) {
    s.addEventListener('load', callback, false);
  } else if (s.readyState) {
    s.onreadystatechange = callback;
  }
  document.body.appendChild(s);
}

function unleashGremlins(ttl, callback) {
  function stop() {
    horde.stop();
    callback();
  }
  var horde = window.gremlins.createHorde()
    .gremlin(gremlins.species.formFiller().canFillElement(function(elem) {
      var tag = elem.tagName.toLowerCase();
      var type = elem.type.toLowerCase();
      return (tag == 'textarea' ||
        !(type == 'button' || type == 'radio' || type == 'checkbox' || type == 'submit' || type == 'reset')) &&
        document.body.contains(elem);
    }))
    .gremlin(gremlins.species.clicker().canClick(function(elem) {
      var tag = elem.tagName.toLowerCase();
      return (tag == 'button' || tag == 'a') && document.body.contains(elem);
    }))
    .strategy(gremlins.strategies.distribution()
      .delay(50) // wait 50 ms between each action
      .distribution([0.3, 0.7])
    );
  horde.seed(1234);

  horde.after(callback);
  window.onbeforeunload = stop;
  setTimeout(stop, ttl);
  horde.unleash();
}

describe('Monkey testing with gremlins ', function() {

  it('it should not raise any error', function() {
    browser.url('/');
    browser.click('button=Cerrar');

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(loadScript);

    browser.timeoutsAsyncScript(60000);
    browser.executeAsync(unleashGremlins, 50000);
  });

  afterAll(function() {
    browser.log('browser').value.forEach(function(log) {
      browser.logger.info(log.message.split(' ')[2]);
    });
  });

});
