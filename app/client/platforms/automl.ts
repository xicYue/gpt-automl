import { Model } from "@/app/api/automl/add-model/route";

type Params = {
  dataId: string;
  feature: string[];
  target: string;
};

export class ServerlessClient {
  async runAutoML(params: Params) {
    const res = await fetch(
      "http://start-pthon-huo-vlajldjxic.cn-hangzhou.fcapp.run/invoke",
      {
        method: "POST",
        body: JSON.stringify({
          description: "test",
          ...params,
        }),
      },
    );
    return res.json();
  }

  async addModel(model: Model) {
    const res = await fetch("/api/automl/add-model", {
      method: "POST",
      body: JSON.stringify(model),
    });
    await fetch(
      "http://start-pthon-huo-vlajldjxic.cn-hangzhou.fcapp.run/deploy",
      {
        method: "POST",
        body: JSON.stringify({
          modelName: model.name,
          pipeline_id: model.pipeline_id,
        }),
      },
    );
    return res.json();
  }
}
