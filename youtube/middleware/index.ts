/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import nextConnect from 'next-connect';
import multiparty from 'multiparty';
import type { NextApiRequest, NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const middleware = nextConnect();

middleware.use(async (req: NextApiRequest & { files: string }, res: NextApiResponse, next) => {
    const form = new multiparty.Form();
    console.log('PARSING');

    const parse = () => {
        return new Promise((resolve, reject) => {
            form.parse(req, (_err, fields, files) => {
                console.log(_err);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                req.body = fields;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                req.files = files;
                resolve('success');
            });
        });
    };
    await parse();
    next();
});

export default middleware;
