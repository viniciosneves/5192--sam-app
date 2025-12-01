import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateProduct } from '../db';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = JSON.parse(event.body || '{}');

        if (!event.pathParameters?.id) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    erro: 'Produto não encontrado',
                }),
            };
        }

        const updated = await updateProduct(event.pathParameters.id, body);
        return {
            statusCode: 200,
            body: JSON.stringify(updated),
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
