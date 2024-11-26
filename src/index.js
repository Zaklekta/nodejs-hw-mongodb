import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import { createDirIfNotExist } from "./utils/createDirIfNotExist.js";
import { TEMP_UPLOAD_DIR, UPLOADS_DIR } from "./constants/index.js";
const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExist(TEMP_UPLOAD_DIR);
  await createDirIfNotExist(UPLOADS_DIR);
  setupServer();
};
bootstrap();
