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
