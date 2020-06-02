import retrieve from '../index';

const TEST_OBJ_1 = {
  hello: {
    world: 'yes',
    me: false,
  },
  foo: {
    bar: [
      { baz: ':)'}
    ]
  },
  notDefined: undefined,
};

const TEST_OBJ_2 = {
  hello: { world: 'yes' },
  multi: [
    { obj0: '0elm' },
    { obj1: '1elm' },
    { obj2: '2elm' },
    { obj3: '3elm' },
  ]
};

test('retrieves nested values', function() {
  expect(retrieve('hello.world').from(TEST_OBJ_1)).toBe('yes');
  expect(retrieve('hello.me').from(TEST_OBJ_1)).toBe(false);
});

test('same path can be applied from different objects', function () {
  const retriever = retrieve('hello.world');
  expect(retriever.from(TEST_OBJ_1)).toBe('yes');
  expect(retriever.from(TEST_OBJ_2)).toBe('yes');
});

test('retrieves nested array values', function () {
  expect(retrieve('foo.bar.0.baz').from(TEST_OBJ_1)).toBe(':)')
})

test('invalid object path resolves to default value', function () {
  expect(retrieve('hello.world.is.not.here').from(TEST_OBJ_1)).toBe(undefined);
  expect(retrieve('hello.world.is.not.here', 'foobar').from(TEST_OBJ_1)).toBe('foobar');
})

test('out of bounds array resolves to default value', function () {
  expect(retrieve('foo.bar.1.baz').from(TEST_OBJ_1)).toBe(undefined);
  expect(retrieve('foo.bar.1.baz', 'defaultValue').from(TEST_OBJ_1)).toBe('defaultValue');
})

test('retrieves nested objects', function () {
  expect(retrieve('foo').from(TEST_OBJ_1)).toHaveProperty('bar');
  expect(retrieve('hello').from(TEST_OBJ_2)).toHaveProperty('world');
  expect(retrieve('multi').from(TEST_OBJ_2)).toHaveLength(4);
})

test('dynamic paths work', function () {
  for (let i = 0; i < 5; ++i) {
    const expectedVal = i === 4 ? undefined : `${i}elm`;
    expect(retrieve(`multi.${i}.obj${i}`).from(TEST_OBJ_2)).toBe(expectedVal);
  }
})

test('overrideUndefined config option works', function () {
  expect(retrieve('notDefined', 'hello').from(TEST_OBJ_1)).toBe(undefined);
  expect(retrieve('notDefined', 'hello', { overrideUndefined: true }).from(TEST_OBJ_1)).toBe('hello');
})

test('doesn\'t error on non object object values being passed in', function () {
  expect(retrieve('hello.world').from(undefined)).toBe(undefined);
  expect(retrieve('hello.world', 'foo').from(undefined)).toBe('foo');
  expect(retrieve('hello.world').from(null)).toBe(undefined);
  expect(retrieve('hello.world', 'foo').from(null)).toBe('foo');
  expect(retrieve('hello.world').from('objectString')).toBe(undefined);
  expect(retrieve('hello.world', 'foo').from('objectString')).toBe('foo');
  expect(retrieve('hello.world').from(5)).toBe(undefined);
  expect(retrieve('hello.world', 'foo').from(5)).toBe('foo');
  expect(retrieve('hello.world.bar', 'foo').from(5)).toBe('foo');
})

