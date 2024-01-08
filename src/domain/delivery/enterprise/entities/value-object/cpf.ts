export class CPF {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    const numericCpf: string = value.replace(/\D/g, '');

    return new CPF(numericCpf);
  }

  static isCpfValid(value: string) {
    const numericCpf: string = value.replace(/\D/g, '');

    return numericCpf.length === 11;
  }

  public equals(cpf: CPF) {
    return cpf.value === this.value;
  }
}
