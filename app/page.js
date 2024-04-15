import Image from "next/image";
import styles from "./page.module.scss";
import GetWeatherReports from "./components/GetWeatherReports/GetWeatherReports";
import GetLatestHourTemp from "./components/GetLatestHourTemp/GetLatestHourTemp";

export default function Home() {
	return (
    	<main className={styles.main}>
      		<div className={styles.wrapper}>
				<div>
					<GetWeatherReports/>	
				</div>

				<div>
					<GetLatestHourTemp/>
				</div>

      		</div>
    	</main>
  	);
}
