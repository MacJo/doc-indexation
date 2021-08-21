import { ClientOptions } from "@elastic/elasticsearch";

export interface WorkerData<T> {
    index: string,
    logfile: string,
    docList: Array<T>,
    options: ClientOptions
}

export interface DocFile {
    
}