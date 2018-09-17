# Rio/OS UI - CommandCenter

This guide outlines the details for developers working on Ember.js. 

Don't just write code that solves your need. 

**But write Good code*

> `Good code has `standard`

> `Thinking on the design`

> `Well documented`

> `Some one else can read it`


## Coding Guidelines

### #1. Remove unused variables

### #2. Controller structure

Pluralized name if the control is for many and not singular.

example: 

`accounts`  

The standard routes like 

| Route          | Description              |
|----------------|--------------------------|
| accounts.index | Show all accounts        |
| accounts.new   | Add new                  |
| account.index  | Show an account (detail) | 


### #3. Meaningful names

- Abstract a name and name it. 

- Don't name it with the `how` (or) `what you do`.

- When inside something, avoid naming it with that prefix. (eg: If inside `machine`
avoid names like `machine-abcd`

- Standard names are good to use. `select-` as opposed to `choose`

- We don't use `create`, its `add`.

### #4. Avoid redundant code.

Don't keep copy/pasting all over. Generalize code.

Example. `edit` will have the same code as `new`


### #5. Test cases for the code you write.

The test cases needed are, 

1. Unit: Controller must exists

2. Unit: Controller test for flags 

3. Unit: Model exists

4. Unit: Model must have data

5. Unit: Render components

6. Integration: 

7. Acceptance (visiting, filling in the data) with mirage mocks

For testing [refer](https://guides.emberjs.com/v3.4.0/testing/)

