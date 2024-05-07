import Image from "next/image";
import styles from "./page.module.scss";
import GetLatestHourTempHum from "./components/GetLatestHourTempHum/GetLatestHourTempHum";
import GetLatestSensorData from "./components/GetLatestSensorData/GetLatestSensorData";
import GetLatestSmhiData from "./components/GetLatestSmhiData/GetLatestSmhiData";
import GetForecast from "./components/GetForecast/GetForecast";
import CompareTempHum from "./components/CompareTempHum/CompareTempHum"


export default function Home() {
	return (
    	<main className={styles.main}>
      		<div className={styles.wrapper}>
			  	<GetForecast/>
				<CompareTempHum/>
      		</div>
    	</main>
  	);
}
