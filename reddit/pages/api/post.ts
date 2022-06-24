import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';
import middleware from '../../middleware';
import { prisma } from '../../lib/prisma';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const uploadFile = (filePath: fs.PathOrFileDescriptor, fileName: string, id: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const content = fs.readFileSync(filePath);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `post-${id}${path.extname(fileName)}`,
            Body: content,
        } as PutObjectRequest;

        s3.upload(params, (err, data) => {
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

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.use(middleware);

handler.post<ExtendedRequest>(async (req, res) => {
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
        console.log('CREATING POST');
        const { title, content, subredditName } = req.body as { title: string; content: string; subredditName: string };
        const post = await prisma.post.create({
            data: {
                title: title[0],
                content: content[0],
                subreddit: {
                    connect: {
                        name: subredditName[0],
                    },
                },
                author: {
                    connect: { id: user.id },
                },
            },
        });

        // CHECK IF AN IMAGE WAS UPLOADED
        if (req?.files && req.files.image[0] && req.files.image[0].size > 0) {
            const location = await uploadFile(req.files.image[0].path, req.files.image[0].originalFilename, post.id);

            await prisma.post.update({
                where: { id: post.id },
                data: {
                    image: location,
                },
            });
        }

        res.json(post);
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default handler;
