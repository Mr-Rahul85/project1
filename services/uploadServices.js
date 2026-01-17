import cloudinary from "../config/cloudinary.js";

export const uploadAndSave = async ({ filePath, folder, Model, body }) => {
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
    folder,
  });

  // Save to MongoDB
  return await Model.create({
    title: body.title,
    description: body.description,
    address: body.address,
    location: body.location,
    mapUrl: body.mapUrl, 
    name: body.name,
    glance1:body.glance1,
    glance2:body.glance2,
    bttv:body.bttv,
    allowed:body.allowed,
    mediaUrl: result.secure_url,
    publicId: result.public_id,
    mediaType: result.resource_type,
    folder: result.folder,
  });
};
