const OSS = require("ali-oss");

const client = new OSS({
  region: "oss-cn-hangzhou",
  bucket: "automl-yxc",
  accessKeyId: "LTAI5tLFSaw8mTgBwS3uMAGR",
  accessKeySecret: "5EnsFLK2jaxuy5Dyn3ogVUPW1yIhvx",
});

export async function ossUpload(file: File) {
  const uploadResult = await client.put(file.name, file);
  return uploadResult;
}
