import { CosmosClient, PatchOperation } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const client = new CosmosClient(process.env["ConnectionStrings:CosmosDBConnection"]);
  const database = await client.database("organizacion");
  const container = await database.container("respuestas");

  const replaceOperation: PatchOperation[] = [
    {
      op: "replace",
      path: `/evaluaciones/${req.body.e}/preguntas/${req.body.p}/valor`,
      value: req.body.v,
    },
  ];
  await container.item(req.params.id, req.params.id).patch(replaceOperation);
};

export default httpTrigger;
