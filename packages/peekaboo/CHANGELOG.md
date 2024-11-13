# Change Logs

## 1.7.3
fix: change behavior for null or undefined type for initData. it will allow update regardless of type.

## 1.7.2
fix: when value was null, an empty object was added.

## 1.7.1
fix: branch boo was not triggering rendering

## 1.7.0
performance optimization
change vanilla event handler's name as it is not a hook.

## 1.6.0
architecture change to fix the update bugs.
fill up unit tests

## 1.5.1
update README

## 1.5.0
add schema util

## 1.4.2
should ignore undefined value
fix no parent node did not update its value 
setup unit tests to use vitest

## 1.4.1

add jest
add getContentAsObject

## 1.4.0

add getContent

## 1.3.0

add everUsed function
make all mid level structure Boo
adjust object for better typescript usage.
update usage function

## 1.2.0 (semi major update)

split utils
add size-limit

## 1.1.1

type mismatch support
add warning messages for type mismatch, does not exist update

## 1.1.0

first version (prev versions are removed)
support better slice type,
restrict initial data for the easier usage
