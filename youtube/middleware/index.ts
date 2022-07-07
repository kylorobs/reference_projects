import multiparty from 'multiparty';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const fileParser = (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const form = new multiparty.Form();
    const reqWithFiles = req as NextApiRequest & { files: string };
    return form.parse(reqWithFiles, async (_err, fields, files) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        reqWithFiles.body = fields;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        reqWithFiles.files = files;
        await next();
    });
};

export default fileParser;
