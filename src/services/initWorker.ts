export const worker = new Worker(new URL("@/services/zxcvbn.worker.ts", import.meta.url), {
  type: "module",
})
