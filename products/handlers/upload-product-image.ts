import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { extension } from 'mime-types';

const s3Client = new S3Client({});

const BUCKET_NAME = process.env.IMAGES_BUCKET;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const productId = event.pathParameters?.id;
        const contentType = event.headers['content-type'] || event.headers['Content-Type'] || 'bin';

        const fileExtension = extension(contentType);

        const key = `products/${productId}.${fileExtension}`;

        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key,
                Body: Buffer.from(event.body || '', 'base64'),
                ContentType: contentType,
            }),
        );

        //TODO: atualizar o produto com a url da imagem

        return {
            statusCode: 201,
            body: JSON.stringify({
                imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
            }),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
