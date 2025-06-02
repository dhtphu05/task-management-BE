import {v2 as cloudinary} from 'cloudinary';

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import UserModel from './src/models/users.model.js';
import mongoose from 'mongoose';

dotenv.config();
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

(async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const folderPath = './test_anh';

        // Lấy danh sách tất cả các file trong thư mục
        // const files = fs.readdirSync(folderPath).filter(file => 
        //     file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
        // );

        // console.log(`🔍 Tìm thấy ${files.length} ảnh trong thư mục.`);

        // // Upload từng ảnh
        // for (const file of files) {
        //     const filePath = path.join(folderPath, file);
        //     console.log(`📤 Đang upload: ${file} ...`);

        //     try {
        //         const uploadResult = await cloudinary.uploader.upload(filePath, {
        //             folder: 'uploaded_images', // Đặt thư mục trên Cloudinary
        //             resource_type: 'image'
        //         });

        //         console.log(`✅ Upload thành công: ${file}`);
        //         console.log("🔗 URL:", uploadResult.secure_url);

        //     } catch (uploadError) {
        //         console.error(`❌ Lỗi khi upload ${file}:`, uploadError);
        //     }
        // }
        //up anh len cloudinary sau do them url vao db
        // Sau khi upload xong, bạn có thể xóa các file đã upload nếu không cần thiết
        
    } catch (error) {
        console.error('Error configuring Cloudinary:', error);
    }
}
)();
async function uploadAvatar(filePath){
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'avatars', 
            resource_type: 'image'
        });
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        throw error; 
    }
}
async function saveAvatarToDB(userId, avatarUrl) {
    try{
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.avatar = avatarUrl; 
        await user.save(); 
    }
    catch (error) {
        console.error('Error saving avatar to DB:', error);
        throw error; 
    }
}
(async () =>{
    try {
        const filePath = './test_anh/default_image.HEIC'; 
        const avatarUrl = await uploadAvatar(filePath);
        console.log('Avatar URL:', avatarUrl);
        const userId = await UserModel.findOne({username: "dhtphu05"});
        console.log('User ID:', userId);
        await saveAvatarToDB(userId, avatarUrl);
        console.log('Avatar saved to DB successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
})();

