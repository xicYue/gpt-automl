import { CallbackManagerForToolRun } from "langchain/callbacks";
import { StructuredTool } from "langchain/tools";
import { z } from "zod";

export class MLInfer extends StructuredTool {
  name: string = "ml_infer";
  description: string = "一个机器学习模型，用于预测钢的延伸率";
  protected async _call(
    arg: any,
    runManager?: CallbackManagerForToolRun | undefined,
  ): Promise<string> {
    return String(5 + Math.random() - 0.5);
  }
  schema = z.object({
    ["热压温度"]: z.number().describe("热压温度"),
    ["热压压力"]: z.number().describe("热压压力"),
    ["固溶温度"]: z.number().describe("固溶温度"),
    ["固溶时间"]: z.number().describe("固溶时间"),
    ["时效温度"]: z.number().describe("热压温度"),
    ["时效时间"]: z.number().describe("时效时间"),
  });
}
