export interface HttpRequestOptions{
  auth? : boolean;
  data? : any;
  contentType?: any;
  params?: any;
  responseType?: any;
}

export interface HttpDefaultOptions {
  ignoreBase? : boolean;
  url: string;
  auth: boolean;
}

export interface HttpGetOptions extends HttpDefaultOptions {
  params?: any;
  contentType?: any;
  responseType?: any;
}

export interface HttpPostOptions extends HttpDefaultOptions {
  data: any;
  isFile?: boolean;
}

