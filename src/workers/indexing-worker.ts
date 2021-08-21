import { Client, ClientOptions } from '@elastic/elasticsearch';
import { parentPort, workerData } from 'worker_threads';
import { createHash } from 'crypto';

async function indexlogfile<T>(listFiles: Iterable<T>, options: ClientOptions): Promise<void> {

    //used to count missed and indexed elems
    const tStart = Date.now();
    let i = 0;
    let d = 0;

    const client = new Client(options);

    for (let file of listFiles) {
        try {
            await client.index({
                index: workerData.index,
                type: null,
                id: createHash('md5').update(workerData.rootDirectory).digest("hex"),
                body: file
            });
            i++
        } catch (error) {
            d++
            throw (new Error(error))
        }
    }

    let tEnd = Date.now();

    await client.indices.refresh({ index: workerData.index })

    const stats = {
        "worker-logfile": workerData.logfile,
        "index": workerData.index,
        "lines-imported": i,
        "lines-skipped": d,
        "time-s": (tEnd - tStart) / 1000
    }

    parentPort.postMessage(stats);
}

indexlogfile(workerData.docList, workerData.options);
