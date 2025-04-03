export interface Log {
  id: number;
  method: string;
  path: string;
  queryString: string;
  requestData: string;
  responseData: string;
  statusCode: number;
  headers: string;
  timestamp: string;
}
