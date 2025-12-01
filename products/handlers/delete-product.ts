import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteProduct } from '../db';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.pathParameters?.id) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    erro: 'Produto não encontrado',
                }),
            };
        }

        await deleteProduct(event.pathParameters.id);

        return {
            statusCode: 201,
            body: '',
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
