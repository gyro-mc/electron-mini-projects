export {};

declare global {
  interface Window {
    helloWorldApi: {
      printHelloWorld: (name: string) => Promise<string>;
    };
  }
}
