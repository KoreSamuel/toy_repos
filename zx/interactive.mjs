#!/usr/bin/env zx

let {stdin, stdout} = $`npm init`

let put = text => {
  stdin.write(text)
  process.stdout.write(text)
}

for await (let chunk of stdout) {
  if (chunk.includes('package name:')) put('test\n')
  if (chunk.includes('version:')) put('1.0.0\n')
  if (chunk.includes('description:')) put('My test package\n')
  if (chunk.includes('entry point:')) put('index.mjs\n')
  if (chunk.includes('test command:')) put('test.mjs\n')
  if (chunk.includes('git repository:')) put('my-org/repo\n')
  if (chunk.includes('keywords:')) put('foo, bar\n')
  if (chunk.includes('author:')) put('Anton Medvedev\n')
  if (chunk.includes('license:')) put('MIT\n')
  if (chunk.includes('Is this OK?')) put('yes\n')
}