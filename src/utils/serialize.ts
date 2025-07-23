// export const serializeTimestamps = <T extends Record<string, any>>(obj: T) => {
//   const result = { ...obj };
  
//   Object.keys(result).forEach(key => {
//     if (result[key] instanceof Date) {
//       result[key] = result[key].getTime();
//     }
//   });
  
//   return result;
// };

// export const deserializeTimestamps = <T extends Record<string, any>>(
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
