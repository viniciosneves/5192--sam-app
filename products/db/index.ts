import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDB({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

export async function listAllProduts() {
    try {
        const result = await ddbDocClient.send(
            new ScanCommand({
                TableName: PRODUCTS_TABLE,
            }),
        );
        return {
            products: result.Items || [],
            count: result.Count || 0,
        };
    } catch (error) {
        console.error(error);
        return {
            error: 'Falha ao obter produtos.',
        };
    }
}

export interface IProductDTO {
    name: string;
    description: string;
    price: number;
}

export async function createProduct(product: IProductDTO) {
    const dbProduct = {
        ...product,
        id: randomUUID,
        createdAt: new Date().toISOString(),
    };

    await ddbDocClient.send(
        new PutCommand({
            TableName: PRODUCTS_TABLE,
            Item: dbProduct,
        }),
    );

    return dbProduct;
}
