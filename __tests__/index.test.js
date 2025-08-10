const { createChain } = require('./index');

describe('createChain', () => {
  test('should create a chain with no layers and core function', () => {
    const chain = createChain((data, fn) => {
      fn(null, data);
    });

    chain(null, (err, data) => {
      expect(err).toBeNull();
      expect(data).toBeNull();
    });
  });

  test('should create a chain with layers and core function', () => {
    const layers = [
      (data, next, cancel) => {
        next(null, data);
      },
    ];

    const coreFn = (data, fn) => {
      fn(null, data);
    };

    const chain = createChain(layers, coreFn);

    chain(null, (err, data) => {
      expect(err).toBeNull();
      expect(data).toBeNull();
    });
  });

  test('should handle errors in layers', () => {
    const layers = [
      (data, next, cancel) => {
        cancel(new Error('Error in layer'), data);
      },
    ];

    const coreFn = (data, fn) => {
      fn(null, data);
    };

    const chain = createChain(layers, coreFn);

    chain(null, (err, data) => {
      expect(err).toEqual(new Error('Error in layer'));
      expect(data).toBeNull();
    });
  });

  test('should handle user error in layers', () => {
    const layers = [
      'not a function',
    ];

    const coreFn = (data, fn) => {
      fn(null, data);
    };

    const chain = createChain(layers, coreFn);

    chain(null, (err, data) => {
      expect(err).toEqual(new Error('user error! A link in the layers was not a function'));
      expect(data).toBeNull();
    });
  });
});