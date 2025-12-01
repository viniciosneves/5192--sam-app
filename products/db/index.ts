import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
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
        id: randomUUID(),
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

export async function deleteProduct(id: string) {
    await ddbDocClient.send(
        new DeleteCommand({
            TableName: PRODUCTS_TABLE,
            Key: { id },
        }),
    );
}

export async function updateProduct(id: string, product: Partial<IProductDTO>) {
    const existingProduct = await ddbDocClient.send(
        new GetCommand({
            TableName: PRODUCTS_TABLE,
            Key: { id },
        }),
    );

    if (!existingProduct.Item) {
        throw new Error('Produto não encontrado');
    }

    const updated = {
        ...existingProduct.Item,
        ...product,
    };

    await ddbDocClient.send(
        new PutCommand({
            TableName: PRODUCTS_TABLE,
            Item: updated,
        }),
    );

    return updated;
}
