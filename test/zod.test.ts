import { z } from "zod";

function test() {
  const schema = z.object({
    name:z.string(),
    age: z.number(),
  });
  const data = {
    name: "John",
    age: 30,
  };
  const stringifiedSchema = JSON.stringify(schema);
  const parsedSchema = JSON.parse(stringifiedSchema);
  

}
