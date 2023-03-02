export const getSanat = () => {
  let status = "pending"
  let result: string[];
  const suspender = import("../sanat").then(
    (res) => {
      status = "success"
      result = res.sanat
    },
    (err) => {
      status = "error"
      result = err
    }
  );
  return {
    read() {
      if (status === "pending") {
        console.log("🚀 ~ file: getSanat.ts:17 ~ read ~ status:", status)
        throw suspender;
      } else if (status === "error"){
        console.log("🚀 ~ file: getSanat.ts:20 ~ read ~ status:", status)
        throw result
      } else if (status === "success") {
        console.log("🚀 ~ file: getSanat.ts:23 ~ read ~ status:", status)
        return result
      }
    }
  }
}