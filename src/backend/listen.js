import app from './index.js';
import 'dotenv/config';
const { PORT = 3752 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
