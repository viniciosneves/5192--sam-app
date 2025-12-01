import { APIGatewayProxyResult } from 'aws-lambda';
import { listAllProduts } from '../db';

export const lambdaHandler = async (): Promise<APIGatewayProxyResult> => {
    try {
        const data = await listAllProduts();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
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
