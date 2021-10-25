import { ClientOptions } from '@elastic/elasticsearch';

export interface WorkerData<T> {
    index: string,
    logfile: string,
    docList: Array<T>,
    options: ClientOptions
}

export interface IndexResults {
    error?: boolean,
    message?:string,
    id: string,
    nresults?: number,
    time?: number
}