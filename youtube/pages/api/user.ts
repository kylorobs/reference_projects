import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createRouter } from 'next-connect';
import S3 from 'aws-sdk/clients/s3';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';
import fileParser from '../../middleware';
import { prisma } from '../../lib/prisma';

// DOCS
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3clientconfig.html#bucketendpoint
const bucket = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const uploadFile = (filePath: fs.PathOrFileDescriptor, fileName: string, id: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const content = fs.readFileSync(filePath);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `profile-${id}${path.extname(fileName)}`,
            Body: content,
        } as PutObjectRequest;

        bucket.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            console.log(data.Location);
            resolve(data.Location);
        });
    });
};

type File = {
    path: fs.PathOrFileDescriptor;
    originalFilename: string;
    size: number;
};

interface ExtendedRequest {
    files?: {
        image: File[];
    };
}

const router = createRouter<NextApiRequest & ExtendedRequest, NextApiResponse>();

router.use(fileParser).post(async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(501).end();
    }

    const session = await getSession({ req });

    if (!session) return res.status(401).json({ message: 'Not logged in' });

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    if (req.method === 'POST') {
        // CHECK IF AN IMAGE WAS UPLOADED
        if (req?.files && req.files.image[0] && req.files.image[0].size > 0) {
            const fileLocation = await uploadFile(
                req.files.image[0].path,
                req.files.image[0].originalFilename,
                +session.user.id
            );

            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    image: fileLocation,
                },
            });
        }

        res.json({ success: true });
    }
});

export default router.handler({
    onError: (err, req: NextApiRequest, res: NextApiResponse) => {
        res.status(500).end({ success: false });
    },
    onNoMatch: (req, res) => {
        res.status(404).end({ success: false });
    },
});
