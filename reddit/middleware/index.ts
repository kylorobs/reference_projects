import nextConnect from 'next-connect';
import multiparty from 'multiparty';
import type { NextApiRequest, NextApiResponse } from 'next';

const middleware = nextConnect();

interface ExtendedRequest {
    files: string;
}

middleware.use(async (req: NextApiRequest & { files: string }, res: NextApiResponse, next) => {
    const form = new multiparty.Form();

    form.parse(req, (_err, fields, files) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req.body = fields;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req.files = files;
        next();
    });
});

export default middleware;
