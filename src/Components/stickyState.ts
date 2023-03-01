import { useEffect, useState } from "react";


export function useStickyState(defaultObject: any, key: string) {    
        
    const [value, setValue] = useState(() => {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultObject;
    })
    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    
    return [value, setValue];
  }

interface objectType {
  uppercase?: boolean;
  special_Characters?: boolean;
  words?: boolean;
}
 


export function stickyState(defaultObject: object, key: string) {

  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);      
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultObject;
  });
  
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
