interface ParsedRecipient {
  address: string;
  amount: string;
}

const ADDRESS_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}$/;

export function parseRecipientCsv(input: string): ParsedRecipient[] {
  if (!input.trim()) return [];
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [address = '', amount = ''] = line.split(/[,\t]/).map((s) => s.trim());
      return { address, amount };
    })
    .filter((r) => ADDRESS_REGEX.test(r.address) && Number(r.amount) > 0);
}

export function recipientsToCsv(recipients: ParsedRecipient[]): string {
  return recipients.map((r) => `${r.address},${r.amount}`).join('\n');
}

export type {};
