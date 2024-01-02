export function generateFakeCPF(): string {
  const cpfArray = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10),
  );

  const digit1 = calculateCPFVerificationDigit(cpfArray);
  const digit2 = calculateCPFVerificationDigit([...cpfArray, digit1]);

  return [...cpfArray, digit1, digit2].join('');
}

function calculateCPFVerificationDigit(cpfArray: number[]): number {
  let sum = 0;

  for (let i = 0; i < cpfArray.length; i++) {
    sum += cpfArray[i] * (10 - i);
  }

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}
