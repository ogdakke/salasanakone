
// export default async function getList(){
//   const jsonFile = "src/assets/kotus.json"
//   const xmlFile = "src/assets/kotus.xml"
  
//   const data = await getFile(xmlFile)
//   return data.toString()
// }

// const getFile = async(fileUrl: string): Promise<string[]> => {
//   const sanaArray: string[] = []
//   try {
//     const then = performance.now()
//     const data = await fileRead(fileUrl)
    
//     const xmlDoc = new DOMParser().parseFromString(data, "text/xml")
    
//     const sanat = xmlDoc.querySelectorAll("s")
    
    
//     for await (const sana of sanat) {
//         sanaArray.push(sana.textContent)
//     }
    
//     console.log(sanaArray);
    
//     const after = performance.now()
//     console.log("🚀 ~ file: getList.ts:24 ~ getList ~ time to do:", `${after-then} ms`)

    
//   } catch (err) {
//     console.error(err); 
//   }
//   return sanaArray
// }


/**
 * 
 * @param url the url to file
 * @returns a promise as a string
 */
export async function fileRead(url: string): Promise<string> {
  const res = await fetch(url)
  return res.text()
}
