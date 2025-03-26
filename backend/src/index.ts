import express,{Application} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import locationsRoute from "./routes/locationRoutes";
import sensorsRoute from "./routes/sensorRoutes";
import sensorReadingsRoute from "./routes/sensorReadingRoutes";
import alertsRoute from "./routes/alertRoutes";
import sensorTypesRoute from "./routes/sensorTypeRoutes";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
app.use('/locations', locationsRoute);
app.use('/sensors', sensorsRoute);
app.use('/sensors', sensorReadingsRoute);
app.use('/alerts', alertsRoute);
app.use('/sensor_types', sensorTypesRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
