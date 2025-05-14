import { FabricObject } from 'fabric';

declare module 'fabric' {
  interface FabricObject {
    data?: {
      type?: string;
      id?: number;
      [key: string]: any;
    };
  }
}