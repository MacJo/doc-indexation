import { ClientOptions } from '@elastic/elasticsearch';
import { Worker, parentPort } from 'worker_threads';
import { DocFile } from './types/indexation';

export const indexFolders = async (docList: Array<DocFile>, index: string, logfile: string, options: ClientOptions) => new Promise((resolve, reject) => {

    let worker_data = {
        index,
        logfile,
        docList,
        options
    }

    const worker = new Worker('./workers/indexing-worker.js', {workerData: worker_data});

    worker.on('message', (message) => {
        parentPort.postMessage('Finished indexing')
        console.log(message);
        resolve;
    });

    worker.on('error', () => {
        reject;
    });
    worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Index worker stopped with exit code ${code}`));
    });
});
