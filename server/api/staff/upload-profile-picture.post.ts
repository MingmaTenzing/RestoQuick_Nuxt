import { v2 as cloudinary } from "cloudinary";

export default defineEventHandler(async (event) => {
  //   const formData = await readMultipartFormData(event);
  //     const runtimeConfig = useRuntimeConfig();
  // const uploadResult = await new Promise((resolve, reject) => {
  //   cloudinary.v2.uploader
  //     .upload_stream((error, uploadResult) => {
  //       if (error) {
  //         return reject(error);
  //       }
  //       return resolve(uploadResult);
  //     })
  //     .end(byteArrayBuffer);
  // });
  //   if (!formData) {
  //     throw createError({ statusCode: 400, statusMessage: "No form data" });
  //   }
  //   cloudinary.config({
  //     cloud_name: runtimeConfig.CLOUDINARY_CLOUD_NAME,
  //     api_key: runtimeConfig.CLOUDINARY_API_KEY,
  //     api_secret: runtimeConfig.CLOUDINARY_API_SECRET_KEY,
  //   });
  //   const result = await cloudinary.uploader.unsigned_upload(
  //     formData?.[0]
  //     runtimeConfig.CLOUDINARY_UPLOAD_PRESET,
  //   );
  //   return result;
});
