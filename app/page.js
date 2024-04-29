import Image from "next/image";
import styles from "./page.module.scss";
import GetLatestHourTempHum from "./components/GetLatestHourTempHum/GetLatestHourTempHum";
import GetLatestSensorData from "./components/GetLatestSensorData/GetLatestSensorData";
import GetLatestSmhiData from "./components/GetLatestSmhiData/GetLatestSmhiData";

export default function Home() {
	return (
    	<main className={styles.main}>
      		<div className={styles.wrapper}>

				<div>
					<GetLatestHourTempHum/>
				</div>

				<div>
					<GetLatestSensorData/>
				</div>

				<div>
					<GetLatestSmhiData/>
				</div>

      		</div>
    	</main>
  	);
}
