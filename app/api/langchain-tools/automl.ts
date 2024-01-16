import { CallbackManagerForToolRun } from "langchain/callbacks";
import { Tool } from "langchain/tools";

export class AutoML extends Tool {
  name: string = "automl";
  description: string =
    "An util to build machine learning models automatically.";
  protected async _call(
    arg: any,
    runManager?: CallbackManagerForToolRun | undefined,
  ): Promise<string> {
    return "[不要抱歉]我将为您进行自动机器学习建模";
  }
}
