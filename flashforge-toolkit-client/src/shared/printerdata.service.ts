import { IPrinterData } from './printerdata.interface';

export const getPrinterData = async (): Promise<IPrinterData> => {
  let apiUrl = '';
  if (import.meta.env.MODE === 'development') {
    apiUrl = 'http://localhost:8000/getData';
  } else {
    apiUrl = '/getData';
  }

  return fetch(apiUrl)
    .then((res: any) => res.json())
    .then((res: IPrinterData) => {
      return res;
    });
};
