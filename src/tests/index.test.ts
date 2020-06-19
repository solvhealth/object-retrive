import retrieve from '../index'
import typedRetrieve from '../guaranteeType';

const TEST_OBJ_1 = {
  hello: {
    world: 'yes',
    me: false,
  },
  my: {
    falsy: {
      number: 0,
      negativeNumber: -0,
      string: '',
      nullObject: null,
      undefinedObj: undefined,
      notANumber: NaN,
    },
    truthy: {
      value: true,
    }
  },
  foo: {
    bar: [
      { baz: ':)'}
    ]
  },
  notDefined: undefined,
  that: {
    typed: {
      string: 'hello world',
      nullObject: null,
      object: { myObj: 'has data' },
      notANumber: NaN,
      number: 42,
      array: ['for', 'us']
    }
  }
}

const TEST_OBJ_2 = {
  hello: { world: 'yes' },
  multi: [
    { obj0: '0elm' },
    { obj1: '1elm' },
    { obj2: '2elm' },
    { obj3: '3elm' },
  ]
}

test('retrieves nested values', function() {
  expect(retrieve('hello.world').from(TEST_OBJ_1)).toBe('yes')
  expect(retrieve('hello.me').from(TEST_OBJ_1)).toBe(false)
  expect(retrieve('my.falsy.string').from(TEST_OBJ_1)).toBe('')
  expect(retrieve('my.truthy.value').from(TEST_OBJ_1)).toBe(true)
})

test('same path can be applied from different objects', function () {
  const retriever = retrieve('hello.world')
  expect(retriever.from(TEST_OBJ_1)).toBe('yes')
  expect(retriever.from(TEST_OBJ_2)).toBe('yes')
})

test('retrieves nested array values', function () {
  expect(retrieve('foo.bar.0.baz').from(TEST_OBJ_1)).toBe(':)')
})

test('invalid object path resolves to default value', function () {
  expect(retrieve('hello.world.is.not.here').from(TEST_OBJ_1)).toBe(undefined)
  expect(retrieve('hello.world.is.not.here', 'foobar').from(TEST_OBJ_1)).toBe('foobar')
  expect(retrieve('my.truthy.value.garbage').from(TEST_OBJ_1)).toBe(undefined)
})

test('out of bounds array resolves to default value', function () {
  expect(retrieve('foo.bar.1.baz').from(TEST_OBJ_1)).toBe(undefined)
  expect(retrieve('foo.bar.1.baz', 'defaultValue').from(TEST_OBJ_1)).toBe('defaultValue')
})

test('retrieves nested objects', function () {
  expect(retrieve('foo').from(TEST_OBJ_1)).toHaveProperty('bar')
  expect(retrieve('hello').from(TEST_OBJ_2)).toHaveProperty('world')
  expect(retrieve('multi').from(TEST_OBJ_2)).toHaveLength(4)
})

test('dynamic paths work', function () {
  for (let i = 0; i < 5; ++i) {
    const expectedVal = i === 4 ? undefined : `${i}elm`
    expect(retrieve(`multi.${i}.obj${i}`).from(TEST_OBJ_2)).toBe(expectedVal)
  }
})

test('overrideUndefined config option works', function () {
  expect(retrieve('notDefined', 'hello').from(TEST_OBJ_1)).toBe(undefined)
  expect(retrieve('notDefined', 'hello', { overrideUndefined: true }).from(TEST_OBJ_1)).toBe('hello')
})

test('defaultOnUndefined config option', function () {
  expect(retrieve('my.falsy.undefinedObj', '', { defaultOnUndefined: true }).from(TEST_OBJ_1)).toBe('')
  expect(retrieve('my.falsy.string', 'default', { defaultOnUndefined: true }).from(TEST_OBJ_1)).toBe('')
  expect(retrieve('my.falsy.notANumber', 'default', { defaultOnUndefined: true }).from(TEST_OBJ_1)).toBe(NaN)
  expect(retrieve('my.foo.bar', 'default', { defaultOnUndefined: true }).from(TEST_OBJ_1)).toBe('default')
})

test('doesn\'t error on non object object values being passed in', function () {
  expect(retrieve('hello.world').from(undefined)).toBe(undefined)
  expect(retrieve('hello.world', 'foo').from(undefined)).toBe('foo')
  expect(retrieve('hello.world').from(null)).toBe(undefined)
  expect(retrieve('hello.world', 'foo').from(null)).toBe('foo')
  expect(retrieve('hello.world').from('objectString')).toBe(undefined)
  expect(retrieve('hello.world', 'foo').from('objectString')).toBe('foo')
  expect(retrieve('hello.world').from(5)).toBe(undefined)
  expect(retrieve('hello.world', 'foo').from(5)).toBe('foo')
  expect(retrieve('hello.world.bar', 'foo').from(5)).toBe('foo')
})

test('defaultOnFalsy option returns default when return value is present in key but not truthy', function () {
  expect(retrieve('my.falsy.number', 'default', { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe('default')
  expect(retrieve('my.falsy.negativeNumber', 'default', { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe('default')
  expect(retrieve('my.falsy.string', 'default', { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe('default')
  expect(retrieve('my.falsy.nullObject', 'default', { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe('default')
  expect(retrieve('my.falsy.undefinedObj', 'default', { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe('default')
  expect(retrieve('my.falsy.notANumber', 'default', { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe('default')
})

test('separator param splits path properly', function () {
  expect(retrieve('hello/world', '', { separator: '/' }).from(TEST_OBJ_1)).toBe('yes')
  expect(retrieve('hello👏world', '', { separator: '👏' }).from(TEST_OBJ_1)).toBe('yes')
  expect(retrieve('lets👏write👏good👏tests', '😎', { separator: '👏' }).from(TEST_OBJ_1)).toBe('😎')
})

test('path as array', function () {
  expect(retrieve(['this', 'is', 'a', 'path']).from(TEST_OBJ_1)).toBe(undefined)
  expect(retrieve(['hello', 'world']).from(TEST_OBJ_1)).toBe('yes')
})

test('type guarantee behaves like it should', function () {
  expect(retrieve('hello.world', 22, { guaranteeType: true }).from(TEST_OBJ_1)).toBe(22)
  expect(retrieve('hello.world', 22, { guaranteeType: true }).from(TEST_OBJ_1)).toBe(22)
})

test('type guarantee plays nicely with other config options', function () {
  expect(retrieve('my.falsy.number', 22, { defaultOnFalsy: true, guaranteeType: true }).from(TEST_OBJ_1)).toBe(22)
})

test('separate type function works', function () {
  expect(typedRetrieve('hello.world', 'no').from(TEST_OBJ_1)).toBe('yes')
  expect(typedRetrieve('that.typed.string', 'nou').from(TEST_OBJ_1)).toBe('hello world')
  expect(typedRetrieve('that.typed.string', 5).from(TEST_OBJ_1)).toBe(5)
  expect(typedRetrieve('that.typed.object', {}).from(TEST_OBJ_1)).toStrictEqual({ myObj: 'has data' })
  expect(typedRetrieve('that.typed.object', null).from(TEST_OBJ_1)).toBe(null)
  expect(typedRetrieve('that.typed.array', []).from(TEST_OBJ_1)).toStrictEqual(['for', 'us'])
  expect(typedRetrieve('that.typed.number', []).from(TEST_OBJ_1)).toStrictEqual([])
})

test('typed retrieve plays nicely with additional config values', function () {
  expect(typedRetrieve('my.falsy.number', 22, { defaultOnFalsy: true }).from(TEST_OBJ_1)).toBe(22)
})
