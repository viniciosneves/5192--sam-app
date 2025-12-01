import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createProduct } from '../db';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}');

        const product = await createProduct({
            name: body.name,
            description: body.description,
            price: body.price,
        });
        return {
            statusCode: 201,
            body: JSON.stringify(product),
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
