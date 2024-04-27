import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/'); // Hãy chắc chắn thư mục 'uploads/' đã tồn tại hoặc được tạo ra trước khi upload file
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Thêm một hậu tố duy nhất để tránh trùng lặp tên file
    }
});

const upload = multer({ storage: storage });

export default upload;