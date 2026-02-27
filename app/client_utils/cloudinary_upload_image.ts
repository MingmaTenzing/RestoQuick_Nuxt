import type { CloudinaryUploadResponse } from "~~/types/cloudinary";

type UploadImageOptions = {
  cloudName: string;
  uploadPreset: string;
  maxSizeInKb?: number;
};

export const cloudinary_image_upload = async (
  event: Event,
  options: UploadImageOptions,
) => {
  const input = event.target as HTMLInputElement;
  const image = input.files?.[0];

  if (!image) {
    throw new Error("No image provided");
  }

  const maxSizeInKb = options.maxSizeInKb ?? 300;

  if (image.size > maxSizeInKb * 1024) {
    input.value = "";
    throw new Error(`Image upload only supports upto ${maxSizeInKb}kb`);
  }

  if (!image.type.startsWith("image/")) {
    input.value = "";
    throw new Error("Only images allowed");
  }

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", options.uploadPreset);

  const uploadImage = await $fetch<CloudinaryUploadResponse>(
    `https://api.cloudinary.com/v1_1/${options.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  return uploadImage.secure_url;
};
