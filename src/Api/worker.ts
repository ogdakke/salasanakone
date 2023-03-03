self.onmessage = (event) => {
  console.log("hello");
  
  const finalData = event.data
  self.postMessage(finalData);
};

export {};