```
  /$$$$$$  /$$                                 /$$                        
 /$$__  $$| $$                                | $$                        
| $$  \ $$| $$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$                      
| $$  | $$| $$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/                      
| $$  | $$| $$  \ $$ /$$| $$$$$$$$| $$        | $$                        
| $$  | $$| $$  | $$| $$| $$_____/| $$        | $$ /$$                    
|  $$$$$$/| $$$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$/                    
 \______/ |_______/ | $$ \_______/ \_______/   \___/                      
               /$$  | $$                                                  
              |  $$$$$$/                                                  
               \______/                                                   
 /$$$$$$$              /$$               /$$                              
| $$__  $$            | $$              |__/                              
| $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$  /$$  /$$$$$$  /$$    /$$ /$$$$$$ 
| $$$$$$$/ /$$__  $$|_  $$_/   /$$__  $$| $$ /$$__  $$|  $$  /$$//$$__  $$
| $$__  $$| $$$$$$$$  | $$    | $$  \__/| $$| $$$$$$$$ \  $$/$$/| $$$$$$$$
| $$  \ $$| $$_____/  | $$ /$$| $$      | $$| $$_____/  \  $$$/ | $$_____/
| $$  | $$|  $$$$$$$  |  $$$$/| $$      | $$|  $$$$$$$   \  $/  |  $$$$$$$
|__/  |__/ \_______/   \___/  |__/      |__/ \_______/    \_/    \_______/
```

## What is this?
`object-retrieve` is a package designed to safely get deeply nested values inside of an object.
No more long chains of `foo && foo.bar && foo.bar.baz`.
Instead, use the declaritive api to get the value, without having to worry about throwing
errors.

## Installation
To install:
```
$ npm install --save object-retrieve
```

## Usage

```typescript
import retrieve from 'object-retrieve'

const myObj = { hello: { world: { foo: 'bar' } } }

retrieve('hello.world.foo').from(myObj)
>>> 'bar'
```

You may pass in a default value that returns if the given nested object does not have the
requested property.
```typescript
retrieve('hello.world.baz', 'myDefaultVal').from(myObj)
>>> 'myDefaultVal'
```

In the event that the object contains a key with value `undefined`, it will return `undefined`
even if a default value is provided. If you wish to override this behavior you may pass in
an optional config object, containing the `defaultOnUndefined` property:
```typescript
const myObj = { hello: { world: undefined } }

retrieve('hello.world', 'mario').from(myObj)
>>> undefined

retrieve('hello.world', 'mario', { defaultOnUndefined: true }).from(myObj)
>>> 'mario'
```

`defaultOnFalsy` works in much the same way as `defaultOnUndefined`, except it will return default
on all falsy values, not just undefined. `defaultOnUndefined` will override `defaultOnFalsy`.

You my pass a `separator` to the config which will allow you to choose the character that the path
splits on.

```typescript
retrieve('lets👏get👏this👏bread', '🥖', { separator: '👏' }).from({ bread: '🍞'})
```

For needs beyond this, simply pass in the path as an array of strings.

## API
``` typescript

interface RetrieveConfig {
  defaultOnFalsy?: boolean;
  defaultOnUndefined?: boolean;
  guaranteeType?: boolean;
  separator?: string;
  /**
   * @deprecated
   */
  overrideUndefined?: boolean;
}

interface FromRetrieve<T> {
  from: (obj: any) => T;
}

function retrieve(path: string | string[],
                  defaultValue?: any, 
                  config?: RetrieveConfig): FromRetrieve
```

### Guaranteed types
If you work with Typescript, or want to have your IDE nicely autocomplete suggestions for you based
on type hints, you might want to use the config option `guaranteeType`. I've included a
separate file which exports the same retrieve function, just with the config option always set to
true. 

It works in the following way:
```typescript
import retrieve from 'object-retrieve/guaranteeType'
// same as:
import nonSafeRetrieve from 'object-retrieve'
nonSafeRetrieve('my.value', 'foo', { guaranteeType: true })

const myObj = {
  foo: {
    bar: 'this is a string'
  }
}

retrieve('foo.bar', 'baz').from(myObj)
>>> 'this is a string'

retrieve('foo.bar', 4).from(myObj)
>>> 4
```

Even though the key existed, since it didn't match the type that was given by the default value, the
default value returns. The main use case for this is when dealing with inconsistent api's, allowing
for less overhead of type checking when grabbing nested values from large data globs. That said, I'm
sure you'll come up with much more creative uses than I can imagine.
