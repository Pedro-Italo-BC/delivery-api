import { CPF } from './cpf';

describe('Test CPF Value Object!', () => {
  it('should be able to create a cpf', async () => {
    const newCpf1 = CPF.create('111.111.111-11');
    const newCpf2 = CPF.create('11111111111');

    expect(newCpf1).toBeInstanceOf(CPF);
    expect(newCpf2).toBeInstanceOf(CPF);
  });
});
