export {};
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $getImg: (arg: string) => string;
  }
}
