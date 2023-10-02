import { sayHello } from '../src/index';

describe("sayHello function", () => {
  it("should print 'Olá, mundo!' to the console", () => {
    const consoleSpy = jest.spyOn(console, 'log'); // Espie o console.log

    sayHello(); // Chame a função que você deseja testar

    expect(consoleSpy).toHaveBeenCalledWith("Olá, mundo!"); // Verifique se o console.log foi chamado com a mensagem correta
  });
});
