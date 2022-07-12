import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import S3 from 'aws-sdk/clients/s3';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';
import nextConnect from 'next-connect';
import { prisma } from '../../lib/prisma';
import middleware from '../../middleware';

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

// USING OLD VERSION OF NEXT CONNECT

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.put<ExtendedRequest>(async (req, res) => {
    const session = await getSession({ req });

    if (!session) return res.status(401).json({ message: 'Not logged in' });
    console.log('UPLOADING');
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });

    console.log(`USERID: ${session.user.id}`);
    console.log(req.files);

    // CHECK IF AN IMAGE WAS UPLOADED
    if (req?.files && req.files.image[0] && req.files.image[0].size > 0) {
        const fileLocation = await uploadFile(
            req.files.image[0].path,
            req.files.image[0].originalFilename,
            +session.user.id
        );

        console.log(`FILE LOCATION: ${fileLocation}`);
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                image: fileLocation,
            },
        });
    }

    res.json({ success: true });
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;
