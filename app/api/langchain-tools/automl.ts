import { CallbackManagerForToolRun } from "langchain/callbacks";
import { Tool } from "langchain/tools";

export class AutoML extends Tool {
  name: string = "automl";
  description: string =
    "An util to build machine learning models automatically. Useful when user want to analysis data.";

  protected async _call(
    arg: any,
    runManager?: CallbackManagerForToolRun | undefined,
  ): Promise<string> {
    return "[不要抱歉, Do Not Apologize]请提供数据，我将为您进行自动机器学习建模(Please provide the data to build machine learning model)";
  }
}
