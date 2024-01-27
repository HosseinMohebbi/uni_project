import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export class UploadService {
  static multerOptions(
    uploadPath?: string | null,
    fullDir?: string | null,
  ): MulterOptions {
    return {
      storage: diskStorage({
        destination: (req, file, callback) => {
          if (fullDir) {
            this.createDirectoryIfNotExists(fullDir);
            callback(null, fullDir);
          }
          const fullPath = uploadPath
            ? `public/uploads/${uploadPath}`
            : 'public/uploads';
          this.createDirectoryIfNotExists(fullPath);
          callback(null, fullPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    };
  }

  public static removeFile(filePath: string): boolean {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  }

  public static createDirectoryIfNotExists(directoryPath: string): boolean {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    return true;
  }
}
