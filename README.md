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
import retrieve from 'object-retrieve';

const myObj = { hello: { world: { foo: 'bar' } } };

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

## API
``` typescript

interface RetrieveConfig {
  overrideUndefined?: boolean; // deprecated in favor of defaultOnUndefined
  defaultOnUndefined?: boolean; // default: false
  defaultOnFalsy?: boolean; // default: false
  separator?: string; // default: '.'
}

interface FromRetrieve {
  from: (obj: any) => any;
}

function retrieve(path: string,
                  defaultValue?: any, 
                  config?: RetrieveConfig): FromRetrieve
```
