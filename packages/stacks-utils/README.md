# @winsznx/stacks-utils

Utilities for validating and formatting Stacks principals and transfer amounts.

## Install

### npmjs

```bash
npm install @winsznx/stacks-utils zod
```

### GitHub Packages

```bash
npm install @winsznx/stacks-utils zod --registry https://npm.pkg.github.com --@winsznx:registry=https://npm.pkg.github.com
```

`zod` is a peer dependency and must be installed by the consumer.

The package publishes both ESM (`import`) and CommonJS (`require`) entrypoints.

## Exports

- `isValidPrincipal(address)`
- `StandardPrincipalSchema`
- `PrincipalSchema`
- `AmountSchema`
- `parseAddresses(input)`
- `validateRecipient(address, amount)`
- `formatAddress(address, startChars?, endChars?)`
- `stxToMicroStx(stx)`
- `microStxToStx(microStx)`

`isValidPrincipal(address)` trims surrounding whitespace before validating standard or contract principals.

`StandardPrincipalSchema` only accepts wallet principals, while `PrincipalSchema` accepts both wallet and contract principals.

`parseAddresses(input)` only returns standard Stacks principals (`SP...` / `ST...`) and filters out contract principals.

`parseAddresses(input)` accepts newline-, comma-, and semicolon-separated input.

`AmountSchema` and `validateRecipient(address, amount)` both expect string amounts such as `"0.25"`.

`formatAddress(address)` defaults to a `6...4` truncation pattern unless you pass custom segment lengths.

`stxToMicroStx(stx)` and `microStxToStx(microStx)` both accept numeric inputs for unit conversion.

## Example

```ts
import { formatAddress, isValidPrincipal, parseAddresses } from '@winsznx/stacks-utils';

const input = `
SP2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC
`;

const addresses = parseAddresses(input);

for (const address of addresses) {
  if (isValidPrincipal(address)) {
    console.log(formatAddress(address));
  }
}
```
