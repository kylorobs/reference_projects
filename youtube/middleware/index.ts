import multiparty from 'multiparty';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const fileParser = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    console.log('PARSING FORM');
    const form = new multiparty.Form();
    const reqWithFiles = req as NextApiRequest & { files: string };
    form.on('progress', (bytesReceived, bytesExpected) => {
        var percentComplete = (bytesReceived / bytesExpected) * 100;
        console.log(`the form is ${Math.floor(percentComplete)}% complete`);
    });

    console.log(req);

    const parsing = () => {
        return new Promise((resolve, reject) => {
            form.parse(req, (_err, fields, files) => {
                console.log({ error: _err });

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                reqWithFiles.body = fields;
                console.log('FIELDS');
                console.log(fields);
                console.log(files);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                reqWithFiles.files = files;
                resolve('parsed');
            });
        });
    };
    await parsing();
    await next();
};

export default fileParser;
