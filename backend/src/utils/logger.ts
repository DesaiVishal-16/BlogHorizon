

const getTimeStamp = (): string => {
  return new Date().toISOString();
};

export const info = (message: string):void => {
 console.log(`[INFO] [${getTimeStamp()}] ${message}`);
};

export const warn = (message:string):void => {
  console.warn(`[WARN] [${getTimeStamp()}] ${message}`);
};

export const error = (message:string):void => {
    console.error(`[ERROR] [${getTimeStamp()}] ${message}`);
};

export const debug = (message:string):void => {
    if(process.env.NODE_ENV !== 'production'){
       console.debug(`[DEBUG] [${getTimeStamp()}] ${message}`);
    }
};