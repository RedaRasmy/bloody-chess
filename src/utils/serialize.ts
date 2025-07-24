
export const serializeTimestamps = <T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T]: T[K] extends Date ? number : T[K] } => {
  const result = { ...obj } as any;
  
  Object.keys(result).forEach(key => {
    if (result[key] instanceof Date) {
      result[key] = result[key].getTime();
    }
   
  });
  
  return result;
};

// export const deserializeTimestamps = <T extends Record<string, unknown>>(
//   obj: T, 
//   dateFields: (keyof T)[]
// ) => {
//   const result = { ...obj };
  
//   dateFields.forEach(field => {
//     if (typeof result[field] === 'number') {
//       result[field] = new Date(result[field] as number) as any;
//     }
//   });
  
//   return result;
// };
