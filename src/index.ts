import { ClientOptions } from '@elastic/elasticsearch';
import { Worker, parentPort } from 'worker_threads';
import { DocFile, IndexResults } from './types/indexation';

export class indexationDoc {
    
	clientOptions: ClientOptions;

	constructor(options: ClientOptions){
		this.clientOptions = options;
	}

	async indexFolders(docList: Array<DocFile>, index: string, logfile: string): Promise<IndexResults> {
		return new Promise((resolve, reject) => {
            
			const result: IndexResults = { id: 'ID' + Math.floor(Math.random() * 100), error: true };
			const worker_data = { index, logfile, docList, options: this.clientOptions };

			const worker = new Worker('./workers/indexing-worker.js', { workerData: worker_data });

			worker.on('message', (message) => {
				result.nresults = message.linesimported;
				result.time = message.time;
				resolve(result);
			});

			worker.on('error', () => {
				reject;
			});

			worker.on('exit', (code) => {
				if (code !== 0) reject(new Error(`Index worker stopped with exit code ${code}`));
				parentPort.postMessage('Finished indexing');
                
			});
		});
	}
}